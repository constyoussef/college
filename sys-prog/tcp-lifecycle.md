# TCP Server Lifecycle

```text
SERVER EXECUTION FLOW
=====================
          |
    1. socket()    <-- "Buy the phone" (Create the endpoint)
          |
    2. bind()      <-- "Assign the extension" (Attach to an IP and Port)
          |
    3. listen()    <-- "Turn the ringer on" (Wait for incoming calls)
          |
    4. accept()    <-- "Pick up the phone" (Blocks until a client connects)
          |
    (Connection Established!)
```

---

1. `socket()`: Creates the socket and returns a file descriptor.

2. `bind()`: Associates the socket with a specific IP address and port number.

3. `listen()`: Tells the OS that this socket will be used to accept incoming connection requests.

4. `accept()`: This is a *blocking* call. The program will pasuse here a client actually knocks on the door. When a client connections, `accept()` returns a **brand new socket** specifically for talking to that client, leaving the orignial socket free to keep listening for other people.


```text
CLIENT EXECUTION FLOW
=====================
          |
    1. socket()    <-- "Buy the phone" (Create the endpoint)
          |
    2. connect()      <-- "Dial the number" (Reach out to Server IP & Port)
          |
    (Connection Established!)
```
