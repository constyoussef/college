# Client Architecture

```text
CLIENT ARCHITECTURE
===================

    [User Types]                             [Server Broadcasts]
         |                                           |
    std::cin                                       recv()
         |                                           |
+-------------------+                      +-------------------+
|    MAIN THREAD    |                      |  RECEIVER THREAD  |
| (Handles sending) |                      | (Handles reading) |
+-------------------+                      +-------------------+
         |                                           |
       send()                                    std::cout
         |                                           |
         ---------------------------------------------
                               |
                        [TCP SOCKET]
                               |
                           (Network)
```

> [!NOTE]
> The client uses two threads to achieve full-duplex communication:
> 1. **Main Thread**: Waits for user input (`std::cin`) and sends it to the server.
> 2. **Receiver Thread**: Constantly waits for incoming data from the server (`recv()`) and displays it.
>
> This prevents the UI (terminal input) from blocking the display of messages from other users.
