---
layout: default
title: Time-Warp-NT Layer
permalink: /technical/protocols/time-warp-nt/
group: technical-protocols
language: en
---
<!-- Reviewed at dcf5509d8fc93ac4c221726d076dafe632d32b70 -->

# Time-Warp-NT Layer

[`time-warp`](https://github.com/serokell/time-warp-nt/) is developed to provide
a reliable networking layer with different levels of abstractions. Another
important objective of `time-warp` is to provide an easy way to write and run
tests for distributed systems using emulation mode, which should be flexible
enough to support various scenarios (tunable network delays, disconnects,
other real-time conditions).

`time-warp` is split up into two main parts:

1.  `Mockable` interfaces.
2.  Network functionality.

## Mockable

[`Mockable`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Class.hs#L30)
interfaces allow to abstract from language-specific details of implementation
of the basic functions.

They are split into several categories. For instance, [`Mockable Delay`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Monad.hs#L21) contains
`delay` operation, while [`Mockable Fork`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Monad.hs#L23) keeps elementary functions to manipulate threads.

This innovation allows to launch the same code both in production and testing
environment, where the latter allows to emulate time, threads, networking, etc.

[`Production`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Production.hs#L42) implements [all those interfaces](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Production.hs#L54-L219) with references to respective prototypes of the functions.

## Networking

This layer is written on top of [network-transport](https://github.com/serokell/network-transport/)
and provides network capabilities for the application layer. It is split up into two sub-layers:
**lower** and **upper**.

### Lower Layer

This sub-layer is a direct wrapper over [`network-transport`](https://github.com/serokell/network-transport/)
package, and it provides a convenient interface which allows to initiate lightweight
connection and send/receive data on it. Please read [Network Transport Layer
guide](/technical/protocols/network-transport) for more info.

It supports two types of connections, **unidirectional** and **bidirectional**.

#### Unidirectional Connections

Unidirectional connections allow to send a stream of bytes without waiting for
peer's response.

The function [`withOutChannel`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1465) executes given action, providing it with [one-shot
lightweight connection](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1828).

Upon unidirectional connection initialization, node [sends `U`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1376):

    +------------------+
    |       UNI        |
    +------------------+

    |   'U' :: Word8   |

`Word8` represents 8-bit unsigned integer value.

#### Bidirectional Сonnections

Bidirectional connections allow both nodes to send and receive bytes to each
other.

The function [`withInOutChannel`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1405) establishes connection, executes given action
with given handle to send and receive bytes on connection, and automatically
closes connection on action's end. Its usage requires a handshake, which
contains the following steps.

First, the initiator [sends](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1443) a **connection request**, which has the following
structure:

    +------------------+-----------------+
    |     `BI_SYN`     |      Nonce      |
    +------------------+-----------------+

    |   'S' :: Word8   |   Word64 (BE)   |

where `Nonce` is [randomly generated](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1421).

Then the peer [sends](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1072) **acknowledgement**, with the following structure:

    +------------------+-----------------+--------------+
    |     `BI_ACK`     |      Nonce      |   PeerData   |
    +------------------+-----------------+--------------+

    |   'A' :: Word8   |   Word64 (BE)   |   Generic    |

where `Nonce` is the [same nonce which came from request](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1067).

If the initiator receives the acknowledgement with correct nonce, a conversation
is started.

The opposite case could take place if the node have never sent any request on
that nonce (peer made a protocol error). It could also be that the node did send
the `BI_SYN`, but its handler for that conversation had already finished. That's
normal, and the node should ignore this acknowledgement.

[`PeerData`](https://github.com/input-output-hk/cardano-sl/blob/4378a616654ff47faf828ef51ab2f455fa53d3a3/infra/Pos/Communication/Types/Protocol.hs#L58) is some additional information that is sent from the peer and parsed
by the initiator. `time-warp` gives you an ability to provide some binary data
during handshake which then can be used by your application in different ways.
The structure of this data is generic. [*Application Level*
section](/technical/protocols/csl-application-level/#message-names) describes
how Cardano SL uses `PeerData`.

### Messaging

Before talking about upper layer, let's describe messaging.

In order to specify different handlers for various message types, sent messages
should implement [`Message`](https://github.com/serokell/time-warp-nt/blob/724769fe102752050e31ed8f609316a8a3e59589/src/Node/Message/Class.hs#L54) interface, defining two methods:

1.  `messageName`, it returns unique message identifier, which is sent along
    with the message itself and allows receiver to select correct handler to
    process this message.
2.  `formatMessage`, it provides description of message, for debug purposes.

Please see `Message` [instance](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/test/Test/Util.hs#L133) for the [`Parcel` data type](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/test/Test/Util.hs#L127) as an example.

### Upper Layer

This sub-layer enables message exchange. It provides *conversation style* of
communication. This style uses capabilities of bidirectional connection and allows
to send/receive messages (one or more). For a single conversation, types of incoming
and outgoing messages are fixed. In this case, the initiator node sends the message
name once, and then both the initiator and the peer send required messages.

Network events processing is initiated by [`node`](https://github.com/serokell/time-warp-nt/blob/e39f6b2c4a2aaaab308eddb9efee0503af73d927/src/Node.hs#L366) function. This function uses two important concepts: worker
and listener.

***Worker*** is some action which performs as the initiator of all
communication, being supplied with [`SendActions` type](https://github.com/serokell/time-warp-nt/blob/e39f6b2c4a2aaaab308eddb9efee0503af73d927/src/Node.hs#L160) which provides
function [`withConnectionTo`](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node.hs#L163).
This function initiates *conversation*, executing given action with
[`ConversationActions`](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node/Conversation.hs#L26)
provided and closing conversation once action completes. In turn,
`ConversationActions` provides [`send`](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node/Conversation.hs#L28) and [`recv`](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node/Conversation.hs#L35) functions to communicate with peer.

***Listener*** is a [handler](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node.hs#L117)
for a message. Each listener remembers type of related message, and
several listeners with non-overlapping message types could be defined.

Please see [complete example](https://github.com/serokell/time-warp-nt/blob/e39f6b2c4a2aaaab308eddb9efee0503af73d927/examples/PingPong.hs) for technical details.

### Serialization

`time-warp` doesn't rely on any predefined serialization strategy, but rather
allows users to use their own.

To define custom serialization, a user should create special data type, the
so-called *packing type*, and implement [`Serializable`](https://github.com/serokell/time-warp-nt/blob/724769fe102752050e31ed8f609316a8a3e59589/src/Node/Message/Class.hs#L77) interface for it. This interface defines
two methods:

1.  `packMsg`, represents the way how to pack the data to raw bytestring.
2.  `unpackMsg`, represents the way how to unpack the data.

Please see `Serializable` [instance](https://github.com/serokell/time-warp-nt/blob/fef2c9943d279403386d204554b1c08fc357f196/src/Node/Message/Binary.hs#L43) for the [`BinaryP` data type](https://github.com/serokell/time-warp-nt/blob/fef2c9943d279403386d204554b1c08fc357f196/src/Node/Message/Binary.hs#L20) as an example.
