#include <algorithm> // For std::remove
#include <iostream>
#include <mutex>        // For race conditions
#include <netinet/in.h> // sockaddr_in structure for internet addresses
#include <string>
#include <sys/_types/_socklen_t.h>
#include <sys/socket.h> // Core socket functions
#include <thread>       // For multithreading
#include <unistd.h>     // for close()
#include <vector>

// Global lock
std::mutex clientsMutex;

// Our "Guest List" - Shared among all threads
std::vector<int> clientSockets;

// Function to send a message to everyone EXCEPT the sender
void broadcastMessage(const std::string &message, int senderSocket) {
  std::lock_guard<std::mutex> lock(clientsMutex); // Grab the key!
  for (int currentSocket : clientSockets) {
    if (currentSocket != senderSocket) {
      // send() is the counterpart to recv(). It pushes data out.
      send(currentSocket, message.c_str(), message.length(), 0);
    }
  }
}

// This function will be run by a separate thread for EACH client
void handleClient(int clientSocket) {
  std::cout << "[Thread] Handling client on socket ID: " << clientSocket
            << "\n";

  char buffer[4096]; // Buffer to store incoming messages

  // Keep reading from this client until they disconnect
  while (true) {
    // recv() is a blocking call. It waits until the client sends data.
    ssize_t bytesRead = recv(clientSocket, buffer, sizeof(buffer), 0);

    if (bytesRead <= 0) {
      // If bytesRead is 0, the client disconnected.
      // If < 0, an error accurred.
      std::cout << "[Thread] Client on socket " << clientSocket
                << " disconnected.\n";
      // Protect teh list while we remove the client
      {
        std::lock_guard<std::mutex> lock(clientsMutex);
        auto it =
            std::find(clientSockets.begin(), clientSockets.end(), clientSocket);
        if (it != clientSockets.end()) {
          clientSockets.erase(it);
        }
      }

      break;
    }

    // Convert the received bytes into a C++ string and print it
    std::string message(buffer, bytesRead);
    std::cout << "Client " << clientSocket << " says: " << message;

    // Broadcast hte message to all other clients
    std::string broadcastMsg =
        "Client " + std::to_string(clientSocket) + ": " + message;
    broadcastMessage(broadcastMsg, clientSocket);
  }

  close(clientSocket);
}

int main() {
  // 1. Create a socket
  // AF_INET = IPv4, SOCK_STREAM = TCP, 0 = default protocol
  int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
  if (serverSocket == -1) {
    std::cerr << "Failed to create sockert.\n";
    return 1;
  }
  std::cout << "Socket created successfully.\n";

  // Allow port reuse so we don't get "Address already in use" errors when
  // restarting the server quickly
  int opt = 1;
  setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

  // 2. Bind the socket to an IP / port
  sockaddr_in serverAddress{};
  serverAddress.sin_family = AF_INET;
  serverAddress.sin_port =
      htons(8080); // Host TO Network Short (handles byte order)
  serverAddress.sin_addr.s_addr =
      INADDR_ANY; // Listen on any available network interface

  if (bind(serverSocket, (struct sockaddr *)&serverAddress,
           sizeof(serverAddress)) == -1) {
    std::cerr << "Faild to bind to port 8080.\n";
    return 1;
  }
  std::cout << "Bound to port 8080.\n";

  // 3. Listen for connections
  // The '5' is the backlog: how many clients can wait in line if the server is
  // busy
  if (listen(serverSocket, 5) == -1) {
    std::cerr << "Failed to listen on socket.\n";
    return 1;
  }
  std::cout << "Server is running and listening on port 8080...\n";

  // The Main Loop
  while (true) {
    sockaddr_in clientAddress{};
    socklen_t clientSize = sizeof(clientAddress);

    // Main thread blocks here waiting for the next client
    int clientSocket =
        accept(serverSocket, (struct sockaddr *)&clientAddress, &clientSize);
    if (clientSocket == -1) {
      std::cerr << "Failed to accept client.\n";
      continue; // Skip this one and try accepting the next
    }

    std::cout << "New client connected! Socket ID: " << clientSocket << "\n";

    // Grab the lock. (If another thread has it, we pause here and wait)
    std::lock_guard<std::mutex> lock(clientsMutex);

    // Add the new client to the guest list
    clientSockets.push_back(clientSocket);

    // Create a new thread, give it the handleClient function and the client's
    // socket
    std::thread clientThread(handleClient, clientSocket);

    // Detach the thread so it runs independently in the background.
    // If we don't detach or join, the program will crash when the thread object
    // goes out of scope.
    clientThread.detach();
  }

  // Clean up and close the connections
  close(serverSocket);

  return 0;
}