# Multi-threaded Server Flow

```text
MAIN THREAD (Listening Loop)
============================
          |
      accept() <--- (Waits here)
          |
  [Client Connects]
          |
     --------------------------------------------
     |                                          |
[Spawns Worker Thread 1]                 [Loops back to accept()]
Handles Client A socket                         |
     |                                  [Client Connects]
recv() / send()                                 |
                                     ------------------------
                                     |
                            [Spawns Worker Thread 2]
                            Handles Client B socket
```

> [!TIP]
> This "Thread-per-Connection" model allows the server to handle multiple clients simultaneously without the main loop getting blocked by a single client's network activity.
