---
layout: default
title: Network Transport Layer
permalink: /technical/protocols/network-transport/
group: technical-protocols
language: en
---
<!-- Reviewed at ef835a2334888eda7384da707c4077a8b576b192 -->

# Network Transport Layer

This guide is for developers who want to build their own client for Cardano SL.
Please read [Cardano SL Implementation Overview](/technical/) for more info.
This guide covers the network transport layer used in Cardano SL nodes.

The transport layer is a layer that sits between TCP and the application level
protocol. It is in principle independent of the application protocol (indeed the
reference implementation is used in multiple different applications with
different application level protocols).

The point of the transport layer is that it provides multiple lightweight
logical connections multiplexed on a single TCP connection. Each lightweight
connection is unidirectional and provides reliable ordered message transport
(i.e. it provides framing on top of TCP).

Properties of the transport protocol:

-   **Single TCP connection**. Only a single TCP connection at a time is used
    between any pair of peers. These connections are potentially long-lived.
    Once a connection with a peer is established, it is used for
    sending/receiving messages until the TCP connection is *explicitly* closed
    or some unrecoverable error occurs.

Properties of the implementation:

-   **Reporting of network failures**. Network failures are not hidden from the
    application layer. If a TCP connection is dropped unexpectedly, the
    transport layer should notify the application layer. In Cardano SL, the
    policy is to try to reconnect and only declare a peer unreachable if
    reconnecting also fails.

## Overview

Typical use of the transport involves:

1.  Listening for new TCP connections from peers.
2.  Establishing a TCP connection to other peer(s).
3.  Creating lightweight connections on an established TCP connection.
4.  Sending message(s) to peer(s) (on one or more lightweight connections).
5.  Receiving message(s) from peer(s) (on one or more lightweight connections).
6.  Closing lightweight connections.
7.  Closing TCP connections.

In Cardano SL, multiple lightweight connections are used to support the
application level messaging protocol. Multiple application level messages can be
sent concurrently, and multiple conversations can be in progress at once. Most
application messages are sent on a newly created lightweight connection, and, if
needed, larger application level message are broken into multiple transport
level messages for transport. Other application level messages are sent as part
of a conversation which is put together from a pair of unidirectional
lightweight connections.

## Terminology

Basic transport concepts are:

-   Transport
-   EndPoint
-   Connection
-   Event
-   Errors

**Transport** refers to the whole layer and protocol described in this document.
An instance of the transport refers to the configuration and state of a running
implementation of the transport, which in particular includes a TCP listening
socket, bound to a particular port on a local network interface, for example
`192.168.0.1:3010`.

**EndPoint** refers to a logical endpoint within a transport instance. This
means it has an address and that connections are between endpoints. In practice
it is just a thin abstraction over the TCP/IP notion of an endpoint, addressed
via a hostname and port.

Endpoint addresses are binary strings with the structure `HOST:PORT:LOCAL_ID`,
for example, `192.168.0.1:3010:0`.

Note that while a transport instance listens on a single port, in principle
there can be multiple addressable endpoints within a single transport instance,
and this is what the `LOCAL_ID` refers to. Cardano SL, however, does not
currently make use of this feature, so it always uses `LOCAL_ID` 0.

**Heavyweight connection** refers to a TCP connection between two endpoints. Two
connected endpoints use one and *only one* TCP-connection at once.

**Connection** (or more explicitly a *lightweight connection*) is a
unidirectional connection between endpoints. All lightweight connections between
endpoints are multiplexed on a single heavyweight connection (i.e. a single TCP
connection).

The lightweight connections are a logical concept layered on top of TCP. Every
connection has an integer ID. It is in principle possible to have thousands of
lightweight connections multiplexed on a single heavyweight TCP connection.

The typical style of operation is that the application layer wishes to establish
a lightweight connection to an endpoint, and if no heavyweight connection yet
exists, then one is created. Similarly, when the last lightweight connection is
closed, real TCP connection is shut down cleanly.

Lightweight connections are unidirectional: messages on a lightweight connection
flow in one direction only. However, lightweight connections can be established
in either direction. The same heavyweight connection is used for lightweight
connections in either direction between peers; it does not matter which peer
first established the heavyweight connection.

A bidirectional conversation can be established by making use of a pair of
unidirectional lightweight connections. Cardano SL follows this pattern. Refer
to the `time-warp-nt` documentation for details. But note that this transport
layer has no special concept of a bidirectional conversation, there are only
collections of unidirectional connections.

## Network Byte Order

In the following descriptions of control messages, all integers are encoded in
[network byte order](https://en.wikipedia.org/wiki/Endianness#Networking).

Thus `Int32` used below in message definitions refers to a 32-bit *signed*
integer value in network byte order.

## Setting Up a Transport Instance

Each transport instance must set up a TCP listening socket. The local interface
and port number to use are determined by the application using the transport.

The implementation should be ready to accept new TCP connections at any time
(perhaps limited by a resource policy), and then perform the initial steps for a
new heavyweight connection described below.

## Establishing Heavyweight Connections (initiating)

Assume that a heavyweight connection is to be established between endpoints
labelled A and B, with endpoint A initiating the connection. Both endpoints have
endpoint address, which, as previously described, are of the form
`HOST:PORT:LOCAL_ID`.

Establishing a heavyweight connection from A to B proceeds as follows. First A
must record in its local state that it is initializing a heavyweight connection
to B. This is needed in case of crossed connection requests (see below). A TCP
connection is opened by endpoint A to the `HOST` and `PORT` of endpoint B.

Endpoint A sends a **connection request** message with the following structure:

    +-----------+-------------+--------------------+
    |   B-LID   |   A-EIDlen  |       A-EID        |
    +-----------+-------------+--------------------+
    |   Int32   |   Int32     |       bytes        |

Where

-   `B-LID` - `B`'s endpoint local ID;
-   `A-EIDlen` - length of `A`'s endpoint address;
-   `A-EID` - `A`'s endpoint address.

Thus A sends the local endpoint ID that it wishes to connect to, and its own
address to identify the initiating node. The address that A sends should be its
canonical public address. The host part may be an IP address or DNS name. It is
used to avoid establishing multiple TCP connections between endpoints. Within
the Cardano SL protocol, the local endpoint ID is always 0.

Endpoint A then expects a **connection request response** message which is a
single `Int32` encoding one of the following responses:

-   `ConnectionRequestAccepted` (0)
-   `ConnectionRequestInvalid` (1)
-   `ConnectionRequestCrossed` (2)

In the typical `ConnectionRequestAccepted` case, endpoint A must record in its
local state that it now has an established (i.e. no longer initializing)
heavyweight to B. It may then proceed to the main part of the protocol described
below.

A `ConnectionRequestInvalid` response occurs when the endpoint identified by the
local endpoint ID does not exist. For example, it happens if A sends to B that
it wishes to connect to local endpoint ID 1, when only ID 0 exists. In this case
both endpoints must close the TCP connection.

A `ConnectionRequestCrossed` response occurs when endpoint B determined that a
TCP connection already exists between A and B, or connections between A and B,
and B and A were being established concurrently. In this case both endpoints
must close the TCP connection.

## Establishing Heavyweight Connections (Receiving)

Assume, as before, that a heavyweight connection is to be established between
endpoints labelled A and B, with endpoint A initiating the connection. We now
consider this from the point of view of endpoint B.

Both endpoints have endpoint address of the form `HOST:PORT:LOCAL_ID`. To be
concrete, assume that B has only one endpoint, with `LOCAL_ID` of 0.

The transport instance for B has a listening socket open on the host and port
corresponding to the endpoint IDs. It accepts a new TCP connection from some
peer. It now expects to receive on that TCP connection a **connection request**
message (in the format described above).

Transport instance B must now respond with a **connection request response**
message (in the format described above), based on the following rules.

If the connection request asks for a local endpoint ID that does not exist (i.e.
anything other than 0 in our example), it must respond with
`ConnectionRequestInvalid` and close the TCP connection.

The rules for `ConnectionRequestCrossed` are described below in more detail.

Otherwise, when the endpoint ID is valid and there is no existing TCP
connection, it should reply with `ConnectionRequestAccepted` and record in its
local state that it now has an established heavyweight with A. It may then
proceed to the main part of the protocol.

## Crossed Connection Request

As mentioned previously, the protocol tries to ensure that only one TCP
connection is used between any two endpoints at once. The typical case is that
an endpoint can simply determine if it has an existing heavyweight connection to
a peer because it either initiated it or received it and it knows if any
existing TCP connection is still open. The hard case arises when two endpoints
initiate establishing heavyweight connections to each other *at the same time*
(in the usual distributed systems sense of "same time").

Each endpoint will have recorded in its local state that it is in the process of
initiating a heavyweight connection to the other endpoint. Each endpoint will
send the connection request message as usual. When each endpoint accepts an
incoming TCP connection, it checks the peer endpoint ID from the connection
request message.

The additional rule is that it must lookup in its local state to see if a
connection to the peer endpoint was either 1. already *being* established
outbound or 2. already fully established. In the first case then we are in the
crossed connection situation. The second case can also occur legitimately (i.e.
not a protocol violation) when one peer has discovered that the existing TCP
connection has failed (i.e. its end is closed) and is trying to establish a new
TCP connection, while the other peer has not yet discovered that the existing
TCP connection is dead.

### Crossed Connection Situation

In the crossed connection situation, thus far this is completely symmetric
between endpoints, but we must break the symmetry to resolve which of the two
TCP connections to use, and which to close. The solution the protocol uses to
break the symmetry is that the endpoint addresses can be ordered
(lexicographically in their binary string form). Thus the rule each node must
use to decide whether to accept or reject the incoming connection request is:
reply with `ConnectionRequestAccepted` if the peer's endpoint ID is less than
the local endpoint id, and otherwise reply with `ConnectionRequestCrossed` and
close the TCP connection.

### Connection Dead / Re-establish Situation

In the second case, where the endpoint handling the incoming TCP connection has
determined that an established connection already exists between the two
endpoints, the protocol is as follows. A `ConnectionRequestCrossed` reply is
sent and the TCP connection is closed. Additionally, the endpoint tries to
validate the liveness of the existing connection, with the purpose of either
validating that it is live or determining that it is not in order to close the
dead connection (which will then allow opening a new one).

To validate the liveness, the endpoint sends a **ProbeSocket** message. If a
**ProbeSocketAck** message is not received within an implementation-defined time
period then the endpoint should close the TCP connection and update its local
state accordingly to enable a new connection to be established by either
endpoint.

An endpoint that receives a ProbeSocket message should reply with a
ProbeSocketAck.

The encoding for these messages is simple:

    +-------------+
    | ProbeSocket |
    +-------------+
    |    Int32    |

    +----------------+
    | ProbeSocketAck |
    +----------------+
    |     Int32      |

where the value for the control message headers are 4 and 5 respectively.

## Main Protocol

Once a heavyweight connection has been established between two endpoints then
the main part of the protocol begins.

The main protocol between two endpoints consists of sending/receiving a series
of messages: control messages and data messages. Each has a header to identify
the message and a body appropriate to the message type. The messages for the
main protocol are control messages to create and close lightweight connections,
and data messages for sending data on a lightweight connection.

Lightweight connections are unidirectional. There are independent sets of
lightweight connections in each direction of the TCP connection. The lightweight
connections in each direction are managed by the *sending* side. The receiving
side has no direct control over the allocation of lightweight connections.

Lightweight connections are identified by a Lightweight connection ID, which is
a 32-bit signed integer. Lightweight connection IDs must be greater than 1024.
Lightweight connection ID numbers should be used sequentially.

The control messages to create or close a lightweight connection simply identify
the lightweight connection ID that they act on. Similarly, data messages
identify the ID of the lightweight connection that the data is being sent on.

Messages for different connection ID can be interleaved arbitrarily (enabling
the multiplexing of the different lightweight connections). The only constraints
are the obvious ones: for any connection ID the sequence of messages must be a
create connection message, any number of data messages and finally a close
connection message.

The format of these messages is as follows:

    +-----------+-----------+
    | CreateCon |   LWCId   |
    +-----------+-----------+
    |   Int32   |   Int32   |

    +-----------+-----------+
    |  CloseCon |   LWCId   |
    +-----------+-----------+
    |   Int32   |   Int32   |

    +-----------+-----------+-------------------+
    |   LWCId   |    Len    |       Data        |
    +-----------+-----------+-------------------+
    |   Int32   |   Int32   |     Len-bytes     |

where:

-   CreateCon control header is 0;
-   CloseCon control header is 1;
-   LWCId is the lightweight connection id, which is &gt;= 1024.

The header Int32 is aliased between the control message headers and the
lightweight connection IDs of the data messages, which is why connection ids
must be 1024 or greater.

The data messages consist of the lightweight connection ID and a length-prefixed
frame of data. Implementations of this protocol may wish to impose a maximum
size on these data frames, e.g. to ensure reasonable multiplexing between
connections or for resource considerations.

Note that there need be no direct correspondence between these message
boundaries and reads/writes on the TCP socket or packets. It may make sense for
performance or network efficiency to arrange for a connection open, small data
message and connection close to be sent in a single write.

## Closing Heavyweight Connections

Cleanly closing the heavyweight connection is not trivial. This is because the
heavyweight connection should only be closed once lightweight connections in
both directions are closed. Given that the allocation of lightweight connections
is controlled independently by each endpoint then some synchronization is
required for both endpoints to agree that there are no more lightweight
connections in either direction.

When one endpoint determines that it has no more outgoing lightweight
connections, and the set of incoming connections it knows of is empty, then it
may initiate the protocol to close the heavyweight connection. It does so by
sending a **CloseSocket** message. The message carries the maximum incoming
lightweight connection ID seen by the endpoint: i.e. the highest connection ID
that has been allocated by the remote endpoint that has so far been seen by the
local endpoint. The local endpoint now updates the state it uses to track the
remote endpoint to note that it is now in the process of closing. If the local
endpoint now receives a create connection message from the remote endpoint,
while it has the remote endpoint marked as being in the process of closing then
it resets the state back to the normal connection established state. This
happens if the remote endpoint opened a new lightweight connection before it
received the close socket message, and so the attempt to close the socket should
be abandoned.

When an endpoint receives a **CloseSocket** message it checks its local state to
check the number of outbound lightweight connections and the maximum lightweight
connection ID it has used for outgoing connections. If there are still outbound
connections then the close socket message is ignored. Additionally, if the
maximum outbound lightweight connection ID used thus far by the local node is
higher than the one received in the close socket message then the close socket
message is ignored. This case can happen even if the number of outbound
connections is currently zero, if an outbound connection was created and then
closed prior to the close socket message arriving. In both cases what has
happened is that the heavyweight connection has become active again while one
side was trying to close it due to inactivity, and so it is appropriate to
abandon the attempt to close it.

If on the other hand there are no outbound connections and the last new
connection ID seen by the remote endpoint is the same as that locally, then both
sides agree and the TCP connection should be closed.

The message structure is:

    +-------------+-----------+
    | CloseSocket |   LWCId   |
    +-------------+-----------|
    |    Int32    |   Int32   |

where:

-   `CloseSocket` - close connection control message, value `2`;
-   `LWCId` - maximum lightweight connection ID used thus far.

## Flow Control and Back-pressure

Lightweight connections do not provide any flow control over and above what is
provided by TCP. The protocol does not provide any facility to reject incoming
lightweight connections. Any such facility must be layered on top, in the
application layer or another intermediate layer.

Implementations should consider the problem of back-pressure and head of line
blocking. Head of line blocking is a problem common to many protocols layered on
top of TCP, such as HTTP 1.x where one large response can "block" other smaller
responses for other URLs because the responses are sent in order. This problem
is less severe in this transport protocol because connection are multiplexed, so
small messages need not be blocked by large messages. Nevertheless, it is still
the case that the multiplexed stream of data for all connections must be
received in order: it is not possible to push back on one lightweight connection
vs another, only on the whole heavyweight connection.
