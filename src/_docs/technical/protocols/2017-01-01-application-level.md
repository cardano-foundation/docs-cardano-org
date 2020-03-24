---
layout: default
title: CSL Application-Level Messaging
permalink: /technical/protocols/csl-application-level/
group: technical-protocols
language: en
---
<!-- Reviewed at 721474b760466b888cf26545b52b35989b2162de -->

# CSL Application-Level Messaging

In this chapter we explore messaging in Cardano SL. The goal of this chapter
is to explain how all the pieces, such as Time-Warp, Network-Transport, and
Kademlia DHT, click together and make implementing a full Cardano SL node
possible.

## Message Typeclass and Message Types

When reading the source code, you often encounter things like
[this](https://github.com/input-output-hk/cardano-sl/blob/c8620af754252ebb71b1f5bc369b4f672f46d537/src/Pos/Block/Network/Types.hs#L42)

``` haskell
-- | 'GetHeaders' message (see protocol specification).
data MsgGetHeaders = MsgGetHeaders
    { -- not guaranteed to be in any particular order
      mghFrom :: ![HeaderHash]
    , mghTo   :: !(Maybe HeaderHash)
    } deriving (Generic, Show, Eq)

instance Message MsgGetHeaders where
    messageName _ = varIntMName 4
    formatMessage _ = "GetHeaders"
```

How do you read this? First, let's examine the `instance` part. This particular
snippet says that the data structure defined by type `MsgGetHeaders` is used as
a message payload. The name of such message is `"GetHeaders"`.

In this particular case, the data structure has two fields: `mghFrom` and
`mghTo`. Prefixes like `mgh` are used because Haskell puts symbols for record
fields in the global namespace, so it is programmer's duty to avoid clashes.

It should be noted that sometimes you see messages that are parametrized with a
type variable `ssc`. That is done for the code to be polymorphic with respect to
the way we carry out shared seed computation.
[Here](https://github.com/input-output-hk/cardano-sl/blob/04dc8e4a640a62f0d82633f3a78ab3d8540fd5e6/src/Pos/Block/Network/Types.hs#L65-L67) is an example of a message that sends newest headers first, minding `ssc`.

The way messages are serialized can be seen in
[`Pos.Binary.Communication`](https://github.com/input-output-hk/cardano-sl/blob/04dc8e4a640a62f0d82633f3a78ab3d8540fd5e6/src/Pos/Binary/Communication.hs) module.

Every message type should have an instance of the `Message` typeclass. Please
see [Time-Warp-NT guide](/technical/protocols/time-warp-nt/#messaging) for more info.

## Inv/Req/Data and MessagePart

Most of messages in Cardano SL are generalized with `Inv/Req/Data` standard (see
[`Pos.Communication.Relay`](https://github.com/input-output-hk/cardano-sl/blob/4378a616654ff47faf828ef51ab2f455fa53d3a3/infra/Pos/Communication/Types/Relay.hs#L23)
module). Within this framework we define three data types:

``` haskell
-- | Inventory message. Can be used to announce the fact that you have
-- some data.
data InvMsg key = InvMsg
    { imKey :: !key
    }
    deriving (Show, Eq)

-- | Request message. Can be used to request data (ideally data which
-- was previously announced by inventory message).
data ReqMsg key = ReqMsg
    { rmKey :: !key
    }
    deriving (Show, Eq)

-- | Data message. Can be used to send actual data.
data DataMsg contents = DataMsg
    { dmContents :: !contents
    }
    deriving (Show, Eq)
```

Here:

-   `key` is a type representing the node identifier.
-   `contents` is a type representing actual message payload.

To introduce a new message using `Inv/Req/Data` one should create two types: `key`
type and `contents` type for this message, and then implement [`MessagePart`](https://github.com/input-output-hk/cardano-sl/blob/69e896143cb02612514352e286403852264f0ba3/infra/Pos/Communication/MessagePart.hs#L9)
typeclass for both of them.

``` haskell
class MessagePart a where
    pMessageName :: Proxy a -> MessageName
```

Here, `pMessageName` is an identifier for a particular message type.

`Message` typeclass for `InvMsg key`, `ReqMsg key` and `DataMsg contents`
is automatically derived from the `MessagePart` typeclass for particular
key and contents.

Please see
[`Pos.Communication.Message`](https://github.com/input-output-hk/cardano-sl/blob/3d695fd804814647f50abe452a81a678aad080cc/src/Pos/Communication/Message.hs)
module for the examples of messages that are using `Inv/Req/Data`.

## Block Exchange Messages

<!-- Updated at 3b657302dede832b908f7ba792a164c83b362712 -->

This table explains
[`Pos.Block.Network.Types`](https://github.com/input-output-hk/cardano-sl/blob/309142c899ed898eaa877d959818a06fbbb37db0/src/Pos/Block/Network/Types.hs)
module.

| Message type    | Payload                                                            | Comments                       |
|-----------------|--------------------------------------------------------------------|--------------------------------|
| `MsgGetHeaders` | Header hash checkpoints (optional newest hash we're interested in) | Expect newest header first     |
| `MsgGetBlocks`  | Oldest header hash (newest hash)                                   | Both hashes have to be present |
| `MsgHeaders`    | Non-empty collection of block headers, newest first                | Polymorphic in `ssc`           |
| `MsgBlock`      | A single block                                                     | Polymorphic in `ssc`           |

For more details please see [binary
protocols](/technical/protocols/binary-protocols/#block-exchange-messages).

## Message names

All messages are given custom names, since using full type names would be
excessive. Each name is concatenation of one or two encoded `UnsignedVarInt`s.

This table contains names for all used messages/message parts. These names could also
be found in
[`Pos.Communication.Message`](https://github.com/input-output-hk/cardano-sl/blob/0906d8abc8e4ba8e1366defc3af0f5363e530146/src/Pos/Communication/Message.hs)
module. To distinguish from integers addition, concatenation is denoted here as
`(++)`.

| Message type     | Message name                    |
|------------------|---------------------------------|
| MsgGetHeaders    | `4`                             |
| MsgHeaders       | `5`                             |
| MsgGetBlocks     | `6`                             |
| MsgBlock         | `7`                             |
| ReqMsg           | `9` ++ `pMessageName key`       |
| MempoolMsg       | `10` ++ `pMessageName tag`      |
| DataMsg          | `11` ++ `pMessageName contents` |
| InvMsg           | `12` ++ `pMessageName key`      |

| Message part type                    | Name |
|--------------------------------------|------|
| `TxMsgContents`                      | `0`  |
| (`UpdateProposal`, \[`UpdateVote`\]) | `1`  |
| `UpdateVote`                         | `2`  |

Hence `cardano-sl` is shipped with Update system protocol, and message formats also
can be changed. So nodes should be aware of the protocol other peers are
running. Knowing this information, nodes can choose a message name to send to a
peer. This message name table is sent as
[`PeerData`](/technical/protocols/time-warp-nt/#bidirectional-сonnections) during
handshake before every conversation action between handshake. The exact binary
format of `PeerData` is described in [binary protocols](/technical/protocols/binary-protocols/#peer-data)
chapter.

## Message limits

Messages have maximum length limits. Different types of messages have different limits, as defined in [`Pos.Communication.Limits`](https://github.com/input-output-hk/cardano-sl/blob/895619d7056fe397e9c2a56d88994f167263c397/src/Pos/Communication/Limits.hs) module.

## Delegation Messages

*Delegation* is a feature that allows one stakeholder, called *issuer*, to let
another stakeholder, called *delegate*, generate blocks on her behalf.

To do this, issuer should create *proxy signing key* that allows delegate to
sign blocks instead of issuer. Any stakeholder can verify that a proxy signing
key was actually issued by a specific stakeholder to a specific delegate and
that this key is valid at time.

Delegation can be of two types: per-epoch delegation and delegation with
revocable long-lived certificates. Per-epoch delegation is called “lightweight”,
and the long-lived delegation is called “heavyweight”.

Please read about [Stake Delegation in Cardano SL](/technical/delegation/) for
more information.

### Lightweight Delegation

**WARNING: Currently, lightweight delegation is disabled and will be reworked in
[Shelley release](https://cardanoroadmap.com/), so information below can be outdated.**

Lightweight delegation allows delegate to sign blocks instead of issuer for some
range of epochs (this range is specified for a signing key created).

To do this, issuer should send message containing time range, issuer public key,
delegate public key and certificate over network. Every node from network
receives this message and can check later if the one who generated the block had
right for it. Lightweight delegation data is stored in memory and gets deleted
after some time [defined in configuration file](https://github.com/input-output-hk/cardano-sl/blob/acc53f53a20c7985d6550b4812117e44db08a70b/core/constants.yaml#L55).

This delegation type can be used to delegate blocks generating right to some
trusted node when an issuer knows it will be absent in some time range.

### Heavyweight Delegation

Heavyweight delegation serves two purposes:

1.  Delegate block generation right, like lightweight delegation.
2.  Share stake with some delegate, thus allowing delegate to take part in
    [Follow-The-Satoshi](/glossary/#follow-the-satoshi). No real money is transferred; stake of issuer is added
    to stake of delegate when calculating stakeholders for [Follow-The-Satoshi](/glossary/#follow-the-satoshi).

Every particular stakeholder can share stake with one and only one delegate. To
revoke certificate, a node should create a new certificate and put itself as
both issuer and delegate.

### Messages table

There are delegation-related messages, found in
[`Pos.Delegation.Types`](https://github.com/input-output-hk/cardano-sl/blob/6e8f8a98fd1537d084341a27a843e08dacc9f1eb/src/Pos/Delegation/Types.hs)
module. The format of delegation messages is described in
[binary protocols](/technical/protocols/binary-protocols/#delegation)
chapter.

## Update System Messages

You can see how system messages are implemented under `WorkMode`
in [`Pos.Communication.Methods`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Communication/Methods.hs) module.

| Message type     | Comments                                           |
|------------------|----------------------------------------------------|
| `UpdateProposal` | Serialized update proposal, sent to a DHT peers    |
| `UpdateVote`     | Message, payload of which contains the actual vote |
       
Plea see [`sendUpdateProposal`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Communication/Methods.hs#L47)
and [`sendVote`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Communication/Methods.hs#L40)
functions for more details.

# Workers, Listeners and Handlers

You can think about them as «operating personnel» for messages.

**Workers** initiate messages exchange, so a worker is an *active* communication
part of Cardano SL. **Listeners** accept messages from the workers and may send
some messages as answers, so a listener is a *passive* communication part of
Cardano SL. After a message was received, a listener uses the function called
**handler** to actually perform the corresponding job. A particular handler is
used based on the type of received message (as it has been said above, messages
have different types).

To be able to perform necessary actions, all workers and handlers work in the
`WorkMode`'s constraints (see below).

## Block Processing

Block exchange messages are described above.

### Block Processing Workers

Block acquisition is handled in
[`Pos.Block.Network.Retrieval`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs)
module.

The [`retrievalWorker`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs#L50)
function is very important: it's a server that operates on [block retrieval
queue](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs#L84)
validating headers, and these blocks form a proper chain. Thus, at [this
point](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs#L284)
it sends a message of type `MsgGetBlocks` to the listener, and at [this
point](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs#L345)
it receives an answer from this listener, a message of `MsgBlock` type.

Here's another example — the [`requestHeaders`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Logic.hs#L261) function. This function handles
expected block headers, tracking them locally. So at [this
point](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Logic.hs#L271)
it sends a message of type `MsgGetHeaders` to the listener, and at [this
point](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Logic.hs#L275)
it receives an answer from that listener, a message of `MsgHeaders` type.

Additional worker for the block processing is defined in
[`Pos.Block.Worker`](https://github.com/input-output-hk/cardano-sl/blob/d564b3f5a7e03e086b62c88212870b5ea89f5e8b/src/Pos/Block/Worker.hs)
module. We reuse [`retrievalWorker`] described above and define a
[well-documented](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Worker.hs#L82)
`blkOnNewSlot` worker. It represents an action which should be done when a new
slot starts. This action includes the following steps:

1.  [Generating a genesis block](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Worker.hs#L100), if necessary.
2.  [Getting leaders](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Worker.hs#L110) for the current epoch.
3.  [Initiation block generation](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Worker.hs#L114), if we're the slot leader or we're delegated to
    do so (optional).

### Logic

The way in which blocks are processed is specified in the
[`Pos.Block.Logic`](https://github.com/input-output-hk/cardano-sl/tree/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Logic)
modules. Please read about [blocks in Cardano SL](/technical/blocks/) for more
info.

### Block Processing Listeners

Listeners for the block processing are defined in
[`Pos.Block.Network.Listeners`](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Network/Listeners.hs)
module.

Handler
[`handleGetHeaders`](https://github.com/input-output-hk/cardano-sl/blob/fa5d01c08124934f01f2df22f2bc8784198f56c0/src/Pos/Block/Network/Listeners.hs#L46)
sends out the block headers: at [this
point](https://github.com/input-output-hk/cardano-sl/blob/fa5d01c08124934f01f2df22f2bc8784198f56c0/src/Pos/Block/Network/Listeners.hs#L89)
it receives a message of type `MsgGetHeaders` from the worker, [get the
headers](https://github.com/input-output-hk/cardano-sl/blob/fa5d01c08124934f01f2df22f2bc8784198f56c0/src/Pos/Block/Network/Listeners.hs#L95)
and then, at [this
point](https://github.com/input-output-hk/cardano-sl/blob/92cf690dc3be9af29502f493cbf9e8072b56cb67/src/Pos/Block/Network/Logic.hs#L140),
it sends a response message of type `MsgHeaders` to that worker.

A handler
[`handleGetBlocks`](https://github.com/input-output-hk/cardano-sl/blob/fa5d01c08124934f01f2df22f2bc8784198f56c0/src/Pos/Block/Network/Listeners.hs#L54)
sends out blocks. This handler corresponds to
[`retrieveBlocks`](https://github.com/input-output-hk/cardano-sl/blob/08fa863502baeb399e15f525540050a117430d95/src/Pos/Block/Network/Retrieval.hs#L319)
from main
[`retrievalWorker`](https://github.com/input-output-hk/cardano-sl/blob/08fa863502baeb399e15f525540050a117430d95/src/Pos/Block/Network/Retrieval.hs#L50).
Thus, it receives a message of type `MsgGetBlocks` from the worker
[here](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Network/Listeners.hs#L60),
[gets corresponding
headers](https://github.com/input-output-hk/cardano-sl/blob/7fdf6c8d0d2f62948f4685b923b7671db137d7b3/src/Pos/Block/Logic/Header.hs#L331),
and then it sends response message of type `MsgBlock` to that worker
[here](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Network/Listeners.hs#L71).

A handler
[`handleBlockHeaders`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Block/Network/Listeners.hs#L85)
sends out block headers for unsolicited use case in a similar way: it receives a
message of
[`MsgHeaders`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Block/Network/Listeners.hs#L95)
type from the worker and handles it.

## Delegation

Another example is working with delegation messages described above.

### Workers

Workers for delegation messages are defined in
[`Pos.Delegation.Worker`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Delegation/Worker.hs)
module.

All these workers do not send messages to one particular node. They send
messages to all neighbors.

### Listeners

Listeners for delegation messages are defined in
[`Pos.Delegation.Listeners`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Delegation/Listeners.hs)
module.

## Security

Workers for security operations are defined in
[`Pos.Security.Workers`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Security/Workers.hs)
module.

## Update System

Below is the list of workers and listeners related to update system.

### Workers

Workers for update system are defined in
[`Pos.Update.Worker`](https://github.com/input-output-hk/cardano-sl/blob/73cf4fc35d3cfb068458f2b6982990d08a99906e/src/Pos/Update/Worker.hs) module.
The only thing that the update system does is [checking](https://github.com/input-output-hk/cardano-sl/blob/73cf4fc35d3cfb068458f2b6982990d08a99906e/src/Pos/Update/Worker.hs#L27)
for a new *approved* update on each slot.

### Listeners

Listeners for update system are defined in
[`Pos.Update.Network.Listeners`](https://github.com/input-output-hk/cardano-sl/blob/22360aa45e5dd82d0c87872d8530217fc3d08f4a/src/Pos/Update/Network/Listeners.hs) module.

`UpdateProposal` relays:

-   `Req` — local node answers to a request about update proposal with the set
    of votes for/against this proposal.
-   `Inv` — checks if we need the offered proposal, and records the data if this
    inventory message is relevant.
-   `Data` — carries the proposal information along with votes, which is
    verified and recorded.

`UpdateVote` listeners:

-   `Req` — sends *our* vote to whoever requests it.
-   `Inv` — checks if we need the offered vote, and records it if relevant.
-   `Data` — carries a single vote, which is verified and recorded.

## WorkMode and MinWorkMode

A special types called [`WorkMode`](https://github.com/input-output-hk/cardano-sl/blob/73cf4fc35d3cfb068458f2b6982990d08a99906e/src/Pos/WorkMode/Class.hs#L65) and [`MinWorkMode`](https://github.com/input-output-hk/cardano-sl/blob/73cf4fc35d3cfb068458f2b6982990d08a99906e/src/Pos/WorkMode/Class.hs#L107) represent a bunch of constraints
to perform work for the real world distributed system. You can think about a constraint
as a *compile-time guarantee* that particular actions can be performed in the
particular context. For example, if we define type of some function `f` in the
terms of **logging** constraint, we definitely know that we can log different
info inside of this function `f`.

All workers and handlers described above work in the `WorkMode`'s constraints.
