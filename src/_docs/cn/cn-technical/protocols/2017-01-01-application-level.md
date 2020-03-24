---
layout: default
title: CSL 应用层消息
permalink: /technical/protocols/csl-application-level/cn/
group: cn-technical-protocols
language: cn
---
<!-- Reviewed at 721474b760466b888cf26545b52b35989b2162de -->

# CSL 应用层消息

在本章中，我们探讨卡尔达诺结算层的消息传递。本章的目的是如何将所有的部分（如 Time-Warp, Network-Transport, 和
Kademlia DHT）组合在一起，实现完整的卡尔达诺结算层节点。


## 消息类型类和消息类型

阅读源代码时，你经常会遇到[这样](https://github.com/input-output-hk/cardano-sl/blob/c8620af754252ebb71b1f5bc369b4f672f46d537/src/Pos/Block/Network/Types.hs#L42)的东西：


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


怎么阅读这些？首先，我们来看看这个 `instance` 部分。这个特定的片段是说，有类型定义的数据结构 `MsgGetHeaders` 被当做消息有效载荷。这样的消息的名字是 `"GetHeaders"`。

在这个特定的案例中，数据结构有两个字段：`mghFrom` 和 `mghTo`。使用 `mgh` 这样的前缀，是因为 Haskell 把记录字段的符号放在全局名字空间中，所有程序员有责任避免冲突。

应该指出的是，有时你会看到使用类型变量 `ssc` 进行参数化的消息。这是为了使与我们进行共享种子计算的方式在代码上是多态的。[这里](https://github.com/input-output-hk/cardano-sl/blob/04dc8e4a640a62f0d82633f3a78ab3d8540fd5e6/src/Pos/Block/Network/Types.hs#L65-L67)是一个消息的例子，首先发送最新的头部，记作 `ssc`。

消息序列化的方式可以在 [`Pos.Binary.Communication`](https://github.com/input-output-hk/cardano-sl/blob/04dc8e4a640a62f0d82633f3a78ab3d8540fd5e6/src/Pos/Binary/Communication.hs) 模块看到。

每个消息类型都应该有一个 `Message` 类型类的实例。请参阅 [Time-Warp-NT 指南](/technical/protocols/time-warp-nt/#messaging)了解更多信息。


## Inv/Req/Data 和 MessagePart

卡尔达诺结算层的大部分消息都是 `Inv/Req/Data` 标准化的（参见 [`Pos.Communication.Relay`](https://github.com/input-output-hk/cardano-sl/blob/4378a616654ff47faf828ef51ab2f455fa53d3a3/infra/Pos/Communication/Types/Relay.hs#L23) 模块）。在这个框架内，我们定义了三种数据类型：

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

这里：

- `key` 表示节点标示符的类型。
- `contents` 表示实际消息有效载荷的类型。

为了通过 `Inv/Req/Data` 引入新消息，应该创建两种类型：这个消息的 `key` 和 `contents`，然后为它们都实现 [`MessagePart`](https://github.com/input-output-hk/cardano-sl/blob/69e896143cb02612514352e286403852264f0ba3/infra/Pos/Communication/MessagePart.hs#L9)。

``` haskell
class MessagePart a where
    pMessageName :: Proxy a -> MessageName
```

这里，`pMessageName` 是一个特定消息类型的标识符。

`InvMsg key` 的 `Message` 的类型类，`ReqMsg key` 和 `DataMsg contents` 自动从 `MessagePart` 类型类派生出特定的键和内容。

请参阅 [`Pos.Communication.Message`](https://github.com/input-output-hk/cardano-sl/blob/3d695fd804814647f50abe452a81a678aad080cc/src/Pos/Communication/Message.hs) 模块了解使用 `Inv/Req/Data` 的消息例子。


## 区块交换信息

<!-- Updated at 3b657302dede832b908f7ba792a164c83b362712 -->

该表格解释了 [`Pos.Block.Network.Types`](https://github.com/input-output-hk/cardano-sl/blob/309142c899ed898eaa877d959818a06fbbb37db0/src/Pos/Block/Network/Types.hs) 模块。

| Message type    | Payload                                                            | Comments                       |
|-----------------|--------------------------------------------------------------------|--------------------------------|
| `MsgGetHeaders` | Header hash checkpoints (optional newest hash we're interested in) | Expect newest header first     |
| `MsgGetBlocks`  | Oldest header hash (newest hash)                                   | Both hashes have to be present |
| `MsgHeaders`    | Non-empty collection of block headers, newest first                | Polymorphic in `ssc`           |
| `MsgBlock`      | A single block                                                     | Polymorphic in `ssc`           |

有关详细信息，请参阅[二进制协议](/technical/protocols/binary-protocols/#block-exchange-messages)。

## 消息名称

所有消息都有给定的名字，因为使用完整的类型名称超过了限度。每个名称是一个或两个 `UnsignedVarInt` 编码的串联。

该表包含所有使用的消息部分的名称。这些名字也可以在 [`Pos.Communication.Message`](https://github.com/input-output-hk/cardano-sl/blob/0906d8abc8e4ba8e1366defc3af0f5363e530146/src/Pos/Communication/Message.hs) 模块中找到。为了区分整数加法，连接在这里表示为 `(++)`

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

因为 `cardano-sl` 随附系统更新协议，消息格式也可以改变。所以节点应该知道其他节点正在运行的协议。了解这些信息，节点可以选择一个消息名称发送给对等体。该消息表名 [`PeerData`](/technical/protocols/time-warp-nt/#bidirectional-сonnections) 会在握手期间的每个对话动作之前被发送。[二进制协议](/technical/protocols/binary-protocols/#peer-data)章节中 `PeerData` 描述了确切的二进制格式。

## 消息限制

消息具有最大长度限制。不同类型的消息具有不同的限制，在 [`Pos.Communication.Limits`](https://github.com/input-output-hk/cardano-sl/blob/895619d7056fe397e9c2a56d88994f167263c397/src/Pos/Communication/Limits.hs) 模块中有定义。 

## 委派消息

委派是这样一个功能，它允许一个叫做 *issuer* 的权益所有人让另一个权益所有人（称为委托人）来代表它来生成块。

为此，issuer 应该创建代理签名密钥，允许委托人签署代替 issuer 的区块。任何权益所有人都可以验证代理签名密钥实际上是由特定权益所有人通过特定代理发布的，并且该密钥在某个时间段是有效的。

委派可以有两种类型：per-epoch 委派和可撤销的长期证书的授权。每个 Per-epoch 委派称为『轻量级』，而长期的委派称为『重量级』。

请阅读『[卡尔达诺结算层的权益委派](/technical/delegation/)』获取更多信息。


### 轻量级委派

**警告：目前，轻量级委派已被禁用，并将在 [Shelley 版本](https://cardanoroadmap.com/)进行重新整理，因此下面的信息可能已过时**。

轻量级委派允许委派人替代 issuer 在一定范围内的 epochs 生成区块（这个范围是签名密钥指定的）

为此，issuer 应该通过网络发送包含时间范围的消息，issuer 密钥，委派公钥和证书。来自网络的每个节点都会收到这条消息，并可以稍后检查生成该块的人是否合适。轻量级委派数据存储在内存中，在一段时间后会被删除（[在配置文件中定义](https://github.com/input-output-hk/cardano-sl/blob/acc53f53a20c7985d6550b4812117e44db08a70b/core/constants.yaml#L55))。

这种授权类型可以用于在发行人知道某个时间范围内不存在的情况下将生成区块的权利委托给某个可信任的节点。

### 重量级委派

重量级委派有两个目的：

1. 就像轻量级委派那样，委派生成区块的权利。
2. 与一些代表分享股份，从而允许代表参与[追随中本聪算法](/glossary/#follow-the-satoshi)。没有真正的金钱转移；在为[追随中本聪算法](/glossary/#follow-the-satoshi)计算权益所有人时，issuer 的权益被加到代表的权益中。

每一个特定的权益所有人最多能与一个代表分享权益。为了撤销证书，节点应该创建一个新的证书，并将其自身同时作为颁发者和委托者。

### 消息列表

在 [`Pos.Delegation.Types`](https://github.com/input-output-hk/cardano-sl/blob/6e8f8a98fd1537d084341a27a843e08dacc9f1eb/src/Pos/Delegation/Types.hs) 模块中有与委托相关的消息。授权消息的格式在[二进制协议](/technical/protocols/binary-protocols/#delegation)章节有描述。

## 更新系统消息

你可以在 [`Pos.Communication.Methods`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Communication/Methods.hs) 模块的 `WorkMode` 看到消息系统是怎么实现的。

| Message type     | Comments                                           |
|------------------|----------------------------------------------------|
| `UpdateProposal` | Serialized update proposal, sent to a DHT peers    |
| `UpdateVote`     | Message, payload of which contains the actual vote |
       

请参阅 [`sendUpdateProposal`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Communication/Methods.hs#L47) 和 [`sendVote`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Communication/Methods.hs#L40) 功能的更多细节。

# Workers, Listeners 和 Handlers

你可以把它们视为消息的『操作人员』

**Workers** 发起消息交换，因此 worker 是卡尔达诺结算层的积极通信部分。**Listeners** 可以从 workers 接收信息，且可能会发送一些消息作为回复。因此 listener 是卡尔达诺结算层的被动通信部分，收到信息后，listener 使用一种叫做 **handler** 的函数来实际执行相应的作业。根据收到的信息的类型使用特定的处理程序（如上所述，消息具有不同的类型）。

为了能够执行必要的操作，所有的 workers 和 handlers 在 `WorkMode` 进行工作（见下文）。


## 区块处理

上面描述了区块交换信息。

### 区块处理 Workers

获取块在 [`Pos.Block.Network.Retrieval`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs) 模块中进行处理。

这个 [`retrievalWorker`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs#L50) 非常重要：它是一个在[区块检索队列](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs#L84)上验证头文件的服务器，这些区块形成一个合适的链。它发送一个 `MsgGetBlocks` 类型的信息给 listener，[此时](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Retrieval.hs#L284)它从这个 listener 接收一个类型为 `MsgBlock` 信息的回答。

这是另一个例子 - [`requestHeaders`](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Logic.hs#L261) 功能。这个函数处理预期的区块头，并在本地跟踪它们。在[这个地方](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Logic.hs#L271)，它向 listener 发送一种类型为 `MsgGetHeaders` 的信息，而[在这](https://github.com/input-output-hk/cardano-sl/blob/83fbebb3eec16c30a96c499301250c5a3756c0c1/src/Pos/Block/Network/Logic.hs#L275)，它从这个 listener 接收一个类型为 `MsgHeaders` 的回答。

[`Pos.Block.Worker`](https://github.com/input-output-hk/cardano-sl/blob/d564b3f5a7e03e086b62c88212870b5ea89f5e8b/src/Pos/Block/Worker.hs) 模块中定义了用于区块处理的其他 worker。我们重用了上述的 `retrievalWorker`（TODO：and define a
[well-documented](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Worker.hs#L82)），并记载了一个记录良好的 `blkOnNewSlot` worker。它代表了一个新 slot 开始时应该完成的操作，这个操作包括以下步骤：

1. 如有必要，生成一个[创始区块](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Worker.hs#L100)。
2. 获取当前 epoch 的 leader。
3. 如果我们是 slot 领导者，或者我们委派这么做，[生成起始区块](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Worker.hs#L114)（可选）。

### 逻辑

处理区块的方式在 [`Pos.Block.Logic`](https://github.com/input-output-hk/cardano-sl/tree/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Logic) 模块中定义。请阅读[卡尔达诺结算层中的区块](/technical/blocks/)获取关于区块的更多信息。

### 区块处理 Listeners

区块处理的 Listeners 在 [`Pos.Block.Network.Listeners`](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Network/Listeners.hs) 模块中定义。

处理程序 [`handleGetHeaders`](https://github.com/input-output-hk/cardano-sl/blob/fa5d01c08124934f01f2df22f2bc8784198f56c0/src/Pos/Block/Network/Listeners.hs#L46) 发送区块头部：[在这](https://github.com/input-output-hk/cardano-sl/blob/fa5d01c08124934f01f2df22f2bc8784198f56c0/src/Pos/Block/Network/Listeners.hs#L89)，它从 worker 收到一个 `MsgGetHeaders` 类型的信息，[获取头部](https://github.com/input-output-hk/cardano-sl/blob/fa5d01c08124934f01f2df22f2bc8784198f56c0/src/Pos/Block/Network/Listeners.hs#L95)，然后[在这](https://github.com/input-output-hk/cardano-sl/blob/92cf690dc3be9af29502f493cbf9e8072b56cb67/src/Pos/Block/Network/Logic.hs#L140)，它向 worker 发送 `MsgHeaders` 类型的回复信息。

[`handleGetBlocks`](https://github.com/input-output-hk/cardano-sl/blob/fa5d01c08124934f01f2df22f2bc8784198f56c0/src/Pos/Block/Network/Listeners.hs#L54) 处理程序发送区块。这个处理程序对应 [`retrievalWorker`](https://github.com/input-output-hk/cardano-sl/blob/08fa863502baeb399e15f525540050a117430d95/src/Pos/Block/Network/Retrieval.hs#L50) 的 [`retrieveBlocks`](https://github.com/input-output-hk/cardano-sl/blob/08fa863502baeb399e15f525540050a117430d95/src/Pos/Block/Network/Retrieval.hs#L319)，因此，它从 worker [这里](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Network/Listeners.hs#L60)接收 `MsgGetBlocks` 类型的信息，[获得对应的头部](https://github.com/input-output-hk/cardano-sl/blob/7fdf6c8d0d2f62948f4685b923b7671db137d7b3/src/Pos/Block/Logic/Header.hs#L331) ，然后[在这里](https://github.com/input-output-hk/cardano-sl/blob/a5f7991ff03a1e45114b901bfbbbb1ee3cd4d194/src/Pos/Block/Network/Listeners.hs#L71)向这个 worker 发送 `MsgBlock` 类型的响应信息。

处理程序 [`handleBlockHeaders`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Block/Network/Listeners.hs#L85) 以类似的方式发送未经请求的用例的区块头部：它接收来自 worker 的 [`MsgHeaders`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Block/Network/Listeners.hs#L95) 类型，并处理它。

## 委派

另一个例子是使用上述的委派信息

### Workers

委派信息的 Worker 在 [`Pos.Delegation.Worker`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Delegation/Worker.hs) 模块中定义。

所有这些 workers 不会发送信息到一个特定的节点。他们发送信息给所有的邻节点。

### Listeners

委派消息的 Listeners 在 [`Pos.Delegation.Listeners`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Delegation/Listeners.hs) 模块中定义。

## 安全

进行安全操作的 workers 在 [`Pos.Security.Workers`](https://github.com/input-output-hk/cardano-sl/blob/0d28e6133bd6349f5236bcebab39ea6bfc4c2b7e/src/Pos/Security/Workers.hs) 模块中定义。

## 更新系统

以下是与更新系统相关的工作人员和听众列表。


### Workers

更新系统的 worker 在 [`Pos.Update.Worker`](https://github.com/input-output-hk/cardano-sl/blob/73cf4fc35d3cfb068458f2b6982990d08a99906e/src/Pos/Update/Worker.hs) 模块中定义。更新系统所做的唯一事情是在每个 slot 上[检查](https://github.com/input-output-hk/cardano-sl/blob/73cf4fc35d3cfb068458f2b6982990d08a99906e/src/Pos/Update/Worker.hs#L27)新的已批准更新。

### Listeners

更新系统的 Listeners 在 [`Pos.Update.Network.Listeners`](https://github.com/input-output-hk/cardano-sl/blob/22360aa45e5dd82d0c87872d8530217fc3d08f4a/src/Pos/Update/Network/Listeners.hs) 模块中定义。


`UpdateProposal` 中继器:

-   `Req` — 本地节点回答关于更新提案的请求，并针对此提案进行一组投票。
-   `Inv` — 检查我们是否需要提供的提案，并记录数据是否与此库存消息相关。
-   `Data` — 将提案信息与投票一起进行验证和记录。


`UpdateVote` listeners:

-   `Req` — 把*我们*的投票发给任何人。
-   `Inv` — 检查我们是否需要提供的投票，并记录相关的。
-   `Data` — 进行一次投票，核实和记录。


## WorkMode 和 MinWorkMode

有一个特殊的类型称为 [`WorkMode`](https://github.com/input-output-hk/cardano-sl/blob/73cf4fc35d3cfb068458f2b6982990d08a99906e/src/Pos/WorkMode/Class.hs#L65)，[`MinWorkMode`](https://github.com/input-output-hk/cardano-sl/blob/73cf4fc35d3cfb068458f2b6982990d08a99906e/src/Pos/WorkMode/Class.hs#L107)  表示一系列执行真实世界的分布式系统的工作的约束条件。你可以把约束看做*运行时保证*，它可以在特定的上下文执行特定的操作。例如，如果我们根据 **logging** 约束定义一些函数 `f` 的类型，我们肯定知道我们在这个函数 `f` 里面记录不同的信息。

上面描述的所有 workers 和 handlers 都受 `WorkMode` 的限制。

