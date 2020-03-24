---
layout: default
title: Time-Warp-NT 层
permalink: /technical/protocols/time-warp-nt/cn/
group: cn-technical-protocols
language: cn
---
<!-- Reviewed at dcf5509d8fc93ac4c221726d076dafe632d32b70 -->

# Time-Warp-NT 层

[`time-warp`](https://github.com/serokell/time-warp-nt/) 是为提供不同抽象层次方法的可靠网络层而开发的。`time-warp` 另一个重要的目标是提供一种使用仿真模式编写和运行分布式系统测试的简单方法，该模式可以足够灵活地支持各种情况（可调节网络延迟，断开连接和其他实时情况）。

`time-warp` 主要分为两个部分：

1. `Mockable` 接口。
2. 网络功能。

## Mockable

[`Mockable`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Class.hs#L30) 接口允许从基本功能实现的语言特定细节中抽象出来。

他们分成几个类别。例如，[`Mockable Delay`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Monad.hs#L21) 包含 `delay` 操作，而 [`Mockable Fork`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Monad.hs#L23)  保留基本功能来操作线程。

这个创新允许在生产和测试环境中启动相同的代码，后者允许模拟时间，线程，网络等。

[`Production`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Production.hs#L42) [实现了这些接口](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Mockable/Production.hs#L54-L219) ，并引用了各自功能的原型。

## 网络

该层写在[网络传输](https://github.com/serokell/network-transport/)之上，为应用层提供网络功能。它被分成两个子层：**低层**和**高层**。

### 低层

这个子层是 [`network-transport`](https://github.com/serokell/network-transport/) 包的直接封装，它提供了一个方便的接口，允许发起轻量级的链接和发送/接收数据。请阅读[网络层传输指南](/technical/protocols/network-transport)了解更多信息。

它支持两种类型的连接，**单向**和**双向**。

#### 单向连接

单向连接允许发送一个字节流而不用等待对方的响应。

[`withOutChannel`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1465) 功能执行给定的操作，为其提供[一次性的轻量级连接](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1828)。

单向连接初始化时，节点[发送 `U`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1376)。

    +------------------+
    |       UNI        |
    +------------------+

    |   'U' :: Word8   |

`Word8` 表示8位无符号整数值。

#### 双向连接

双向连接允许两个节点相互发送和接收字节。

[`withInOutChannel`](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1405)  函数建立连接，用给定的句柄执行给定的动作，以在连接上发送和接收字节，并在动作结束时自动关闭连接。它的使用需要握手，其中包含以下步骤。

首先，发起者[发送](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1443)一个**连接请求**，其具有以下结构：

    +------------------+-----------------+
    |     `BI_SYN`     |      Nonce      |
    +------------------+-----------------+

    |   'S' :: Word8   |   Word64 (BE)   |

其中 `Nonce` 是[随机生成的](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1421)。


然后对方[发送](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1072)以如下结构发送**确认**：


    +------------------+-----------------+--------------+
    |     `BI_ACK`     |      Nonce      |   PeerData   |
    +------------------+-----------------+--------------+

    |   'A' :: Word8   |   Word64 (BE)   |   Generic    |

其中 `Nonce` 是[来自请求的相同随机数](https://github.com/serokell/time-warp-nt/blob/dfefb3ccbcd746909b10048e9f49641e1885a4ec/src/Node/Internal.hs#L1067)

如果发起者已正确地随机数接收到确认，则开始对话。

如果节点从未发送过任何请求（对等点发生协议错误），则会发生相反的情况。也有可能是节点确实发送了 `BI_SYN`，但对话的处理程序已经完成了。这是正常的，节点应该忽略这个确认。


[`PeerData`](https://github.com/input-output-hk/cardano-sl/blob/4378a616654ff47faf828ef51ab2f455fa53d3a3/infra/Pos/Communication/Types/Protocol.hs#L58)  是由对等体发送并由发起者解析的一些附加信息。`time-warp` 使您能够在握手过程中提供一些二进制数据，然后以不同的方式使用您的应用程序。这个数据的结构是互通的，[*应用程序级别*
章节](/technical/protocols/csl-application-level/#message-names)描述了卡尔达诺结算层如何使用 `PeerData`。

### 消息

在讨论上层之前，我们来描述消息。

为了让不同的消息类型指定不同的处理程序，发送的消息应该实现 [`Message`](https://github.com/serokell/time-warp-nt/blob/724769fe102752050e31ed8f609316a8a3e59589/src/Node/Message/Class.hs#L54)  接口，定义两种方法：
1. `messageName`，它将返回唯一的消息标识符，该标识符与消息本身一起发送，并允许接收者选择正确的处理程序来处理此消息。
2. `formatMessage`， 它提供消息的描述，用于调试。

请查看 `Message` [实例](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/test/Test/Util.hs#L133)的 [`Parcel` 数据类型](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/test/Test/Util.hs#L127)作为例子。


### 上层

这个子层实现了数据交换。它提供了交流的*沟通方式*。该类型使用双向连接的功能，并允许发送/接收信息（一个或多个）。对于单个对话，输入和输出消息的类型是固定的。在这种情况下，发起方节点只发送一次消息名称，然后发起方和对方发送所需的消息。

网络事件处理由 [`node`](https://github.com/serokell/time-warp-nt/blob/e39f6b2c4a2aaaab308eddb9efee0503af73d927/src/Node.hs#L366) 功能启动。这个函数使用了两个重要的概念：worker
和 listener。

**Worker** 是作为所有通信发起者执行的一些动作，被用于提供提供 [`withConnectionTo`](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node.hs#L163) 功能的 [`SendActions` 类型](https://github.com/serokell/time-warp-nt/blob/e39f6b2c4a2aaaab308eddb9efee0503af73d927/src/Node.hs#L160)。这个函数启动*对话*，执行 [`ConversationActions`](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node/Conversation.hs#L26) 给定的动作，一旦动作完成关闭会话。反过来，`ConversationActions` 提供 [`send`](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node/Conversation.hs#L28) 和 [`recv`](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node/Conversation.hs#L35) 功能来与对等点对话。

***Listener*** 是一个消息的 [handler](https://github.com/serokell/time-warp-nt/blob/8a4c8792049a589cdc3e87f6a863b026430b266e/src/Node.hs#L117)。每个相关消息的 listener 成员类型，以及几个不重复消息类型的 listeners 可以被定义。

请查看[完整例子](https://github.com/serokell/time-warp-nt/blob/e39f6b2c4a2aaaab308eddb9efee0503af73d927/examples/PingPong.hs)获取技术细节。

### 序列化

`time-warp` 不依赖任何预定义的序列化策略，而是允许用户使用自己的。

要定义自定义序列化，用户应该可以创建特殊的数据类型，即所谓的*打包类型*，并为其实现 [`Serializable`](https://github.com/serokell/time-warp-nt/blob/724769fe102752050e31ed8f609316a8a3e59589/src/Node/Message/Class.hs#L77)  接口。这个接口定义了两个方法：

1.  `packMsg`，展示将数据压缩到原始字符串。
2.  `unpackMsg`， 展示将数据解压缩。


请查阅 `Serializable` [实例](https://github.com/serokell/time-warp-nt/blob/fef2c9943d279403386d204554b1c08fc357f196/src/Node/Message/Binary.hs#L43)作为 [`BinaryP` 数据类型](https://github.com/serokell/time-warp-nt/blob/fef2c9943d279403386d204554b1c08fc357f196/src/Node/Message/Binary.hs#L20)的例子。

