#include <arpa/inet.h> // For inet_pton (IP address conversion)
#include <iostream>
#include <sys/socket.h> // Core socket functions
#include <unistd.h>     // For close()

int main() {
  // 1. Create a socket
  int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
  if (clientSocket == -1) {
    std::cerr << "Failed to create sockert.\n";
    return 1;
  }
  std::cout << "Socket created successfully.\n";

  // 2. Define the server address we want to connect to
  sockaddr_in serverAddress{};
  serverAddress.sin_family = AF_INET;
  serverAddress.sin_port = htons(8080); // Must match the server's port

  // Convert IPv4 address from text to binary form
  // "127.0.01" is the loopback address (localhost)
  if (inet_pton(AF_INET, "127.0.0.1", &serverAddress.sin_addr) <= 0) {
    std::cerr << "Invalid address or address not supported.\n";
    return 1;
  }

  // 3. Connect to the server
  if (connect(clientSocket, (struct sockaddr *)&serverAddress,
              sizeof(serverAddress)) == -1) {
    std::cerr << "Connection to the server failed.\n";
    return 1;
  }
  std::cout << "Connected to the server successfully!\n";

  // 4. Clean up
  close(clientSocket);
  std::cout << "Disconnected from server.\n";

  return 0;
}