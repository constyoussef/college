#include <iostream>
#include <netinet/in.h> // sockaddr_in structure for internet addresses
#include <sys/_types/_socklen_t.h>
#include <sys/socket.h> // Core socket functions
#include <unistd.h>     // for close()

int main() {
  // 1. Create a socket
  // AF_INET = IPv4, SOCK_STREAM = TCP, 0 = default protocol
  int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
  if (serverSocket == -1) {
    std::cerr << "Failed to create sockert.\n";
    return 1;
  }
  std::cout << "Socket created successfully.\n";

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
  std::cout << "Listening for incoming connections on port 8080...\n";

  // 4. Accept a client connection (This is a BLOCKING call)
  sockaddr_in clientAddress{};
  socklen_t clientSize = sizeof(clientAddress);
  int clientSocket =
      accept(serverSocket, (struct sockaddr *)&clientAddress, &clientSize);

  if (clientSocket == -1) {
    std::cerr << "Failed to accept client.\n";
    return 1;
  }
  std::cout << "Client connected successfully!\n";

  // Clean up and close the connections
  close(clientSocket);
  close(serverSocket);

  return 0;
}