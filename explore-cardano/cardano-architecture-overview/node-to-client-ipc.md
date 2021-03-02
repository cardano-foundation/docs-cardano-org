## Node-to-Client IPC 

This section provides a detailed overview of the Node-to-Client IPC.

### Node-to-Client IPC Overview

Node-to-Client (NtC) is a connection between a full node and a client that consumes data but does not take part in the Ouroboros protocol (a wallet, for example.)

The purpose of the NtC IPC protocol is to allow local applications to interact with the blockchain via the node. This includes applications such as wallet backends or blockchain explorers. The NtC protocol enables these applications to access the raw chain data and to query the current ledger state, and it also provides the ability to submit new transactions to the system.

The NtC protocol uses the same design as the Node-to-Node (NtN) protocol, but with a different set of mini-protocols, and using local pipes rather than TCP connections. As such, it is a relatively low-level and narrow interface that exposes only what the node can provide natively. For example, the node provides access to all the raw chain data but does not provide a way to query data on the chain. The job of providing data services and more convenient higher level APIs is delegated to dedicated clients, such as cardano-db-sync and the wallet backend.

### NtC Mini-protocols

The NtC protocol consists of three mini-protocols:

* **chain-sync** - used for following the chain and getting blocks
* **local-tx-submission** - used for submitting transactions
* **local-state-query** - used for querying the ledger state

The NtC version of chain sync uses *full* blocks, rather than just block headers. This is why no separate block-fetch protocol is needed. The local-tx-submission protocol is like the NtN tx-submission protocol but simpler, and it returns the details of transaction validation failures. The local state query protocol provides query access to the current ledger state, which contains a lot of interesting data that is not directly reflected on the chain itself.

### How NtC works

In NtC, the node runs **the producer side** of the Chain-Sync protocol *only*, and the **client** runs the consumer side *only*.

This table shows which mini-protocols are enabled for NtC communication. 
![Node-to-Client](node-to-client-ipc.png)
