---
layout: default
title: 技术细节
group: base
permalink: /technical/cn
children: cn-technical
language: cn
---

<!-- Reviewed at d0868afac50ba6ffcbd95054e65cbf77fa513082 -->

# 卡尔达诺结算层技术细节

对于想要贡献原始客户端，以及想基于卡尔达诺结算层创建自己的客户端的开发人员来说，这一章节是一个起点。尽管如此，这一节将主要覆盖原始客户端，并有所扩展，在一段时间内可以把它当做最初的参考文档

## 高层次概述

一个卡尔达诺结算层节点是一个区块链节点。运行时，他会找到其他节点(通过 [DHT](http://ast-deim.urv.cat/cpairot/dhts.html))，然后开始执行区块链的相关任务。

卡尔达诺结算层中的时间会以 epochs 划分。epochs 又会以 slots 划分。 Epochs 和 slots 会被编号。 因此，slot `(3,5)` 被读作『第3个 epochs 的第5个 slot』 (第0个 slot 以及第0个 epoch 也是可以的).

卡尔达诺结算层会使用一些常量集, 特殊值定义在
[`constants.yaml` 配置文件中](https://github.com/input-output-hk/cardano-sl/blob/bf5dd592b7bf77a68bf71314718dc7a8d5cc8877/core/constants.yaml)。
主要有两种：生产模式和开发模式。 在本指南中，我们将参考生产常量。

假设卡尔达诺结算层的值是：:

-   slot 持续时间: 120秒,
-   安全参数 *k*: 60.

换句话说，**一个 slot 可以持续120秒**, 而一个 epochs有 [`10×k`](https://github.com/input-output-hk/cardano-sl/blob/9ee12d3cc9ca0c8ad95f3031518a4a7acdcffc56/core/Pos/Core/Constants/Raw.hs#L161)
个 slot, 所以它可以持续**1200分钟**或**20个小时**.

每个 slot 上有一个节点被称作 slot 领导者。只有这个 slot 有权在这些 slot 中生成一个新区块；这个区块会被加入到区块链中。然而我们并不能确保这个区块一定会被生成(比如 slot 领导者在响应的过程中可能会离线)。

此外，slot 领导者可以将其权利委托给另一个节点 `N`；在这种情况下，节点 `N` 而非 slot 领导者将有权生成一个新的块。请注意，`N` 具有委托权的节点不能被称为 slot 领导者，它只是一个委托。

理论上可以将 slot 领导者的权力委托给多个节点，但是不推荐，之后会解释原因。此外，使用相同的密钥（即一台计算机上）我们可以运行中多个节点，假设有节点 `A`, `B`, `C`，如果节点 `A` 被选为 slot 领导者，不仅 `A` 本身，节点 `B` 和 `C` 都能够生成一个新区块。在这种情况下，每一个节点都将发出一个不同的块，网络将分叉 - 每个其他节点将只接受这些并发区块块中的一个。之后，这个分叉将被淘汰。

在 epoch 中，节点之间相互发送 MPC 消息，以达成共识，谁将被允许在下一个时期生成区块。Data 消息中的有效载荷 （以及事务）会被包含在块中。

一个地址持有的货币（或『股份』）越多，被选择生成一个区块的可能性就越大。请阅读[乌洛波罗斯权益证明算法](/cardano/proof-of-stake/)获取更多细节。


简而言之:

1. 发送信息，
2. 接收信息/交易/等等，
3. 形成一个区块 (如果你是 slot 领导者的话)，
4. 重复。

## 商业逻辑

### 接收者

接收者处理传入的消息并对其作出响应。各种补充的听众不会被覆盖，而是集中在一个接收者上。

接收者大多使用[中继框架](/technical/protocols/csl-application-level/#invreqdata-and-messagepart)，其中包括三种类型的消息：

* `Inventory` 消息：节点在获取新数据时向网络发布消息。  
* `Request` 消息：如果某个新数据没有被这个节点获取的话，节点会向其他节点获取在 `Inventory` 消息中的新数据。  
* `Data` 消息：节点对 `Request` 消息回复的数据。`Data`消息包含具体的数据。

例如，当用户创建新的交易时，钱包将具有交易 ID 的 `Inventory` 消息发送到网络。如果收到 `Inventory` 的节点没有该 ID 相关的交易记录，那么它会回复 `Request` 消息，然后钱包会在 `Data` 消息中发送该交易信息。节点收到 `Data` 消息后，将 `Inventory` 消息发送给 DHT 网络中的邻居，并重复之前的操作。

另一个例子 - 区块接收者：[`handleGetHeaders`](https://github.com/input-output-hk/cardano-sl/blob/69e896143cb02612514352e286403852264f0ba3/src/Pos/Block/Network/Listeners.hs#L30)，
[`handleGetBlocks`](https://github.com/input-output-hk/cardano-sl/blob/69e896143cb02612514352e286403852264f0ba3/src/Pos/Block/Network/Listeners.hs#L50)，
[`handleBlockHeaders`](https://github.com/input-output-hk/cardano-sl/blob/69e896143cb02612514352e286403852264f0ba3/src/Pos/Block/Network/Listeners.hs#L77)。

### Worker

一个 Worker 会在一个时间区间内进行重复性的工作. 比如：


- [`onNewSlotWorker`](https://github.com/input-output-hk/cardano-sl/blob/69e896143cb02612514352e286403852264f0ba3/infra/Pos/Communication/Protocol.hs#L218)：在每个插槽的开始时运行。做一些清理，然后运行其他功能。这个 Worker 在这个 epoch 的开始时也会创造了一个 『起始块』。有两种类型的块：『生成块』和『主块』。主块储存在区块链中; 在 epoch 之间，每个节点都会间断性地生成块。主块不会被告知其他节点。但是，如果节点离线一段时间，并且需要同步区块链，节点可以请求其他人的创世区块。
- [`blkOnNewSlot`](https://github.com/input-output-hk/cardano-sl/blob/d01d392d49db8a25e17749173ec9bce057911191/src/Pos/Block/Worker.hs#L69): 创建一个新块（当轮到节点创建一个新块时），并将其发给其他节点。


## 权益证明

卡尔达诺结算层的核心基于 乌洛波罗斯 权益证明算法。正如同名的[白皮书](https://eprint.iacr.org/2016/889)所描述的那样。


## 分叉

通常，一个链（主链）由一个节点维护，但最终可能会出现分叉链。回想一下，只有区块 `k` 和更多 slot 被认为是稳定的。这样一来，如果接收一个区块，它既不是区块链的一部分也不是 blockchain 的延续，我们首先检查其复杂程度（复杂性是链的长度）是否比我们的大，TODO

然后我们开始随后请求来自先前块提供替代链头的节点。如果我们来得深入k插槽前，替代链被拒绝。否则，一旦我们到达我们连锁店中​​存在的区块，替代链就会被添加到存储区。从国家的角度来看，我们存储和维护所有可行的替代链。如果看起来一个替代链比主链更长，那么它们被替换，使替代链成为新的主链。

## 补充部分

### Slotting

我们使用的共识方案依赖于正确的 slot。更具体地说，它依赖于系统中的节点可以访问的当前时间（小的偏差是可接受的），然后用于确定何时开始和结束任何特定的 slot，并且在该 slot 执行特定的动作。

系统开始时间是 `(0,0)` slot 的时间戳（即，第0 epoch 的第0slot）。

## P2P 网络

### Peer 发现

我们使用 Kademlia DHT 进行对等节点的发现。这是基于 [Kademlia: 基于 XOR 度量的 P2P 信息系统](https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf) 的哈希表的通用解决方案。

简言之，在 Kademlia 网络的每个节点都被提供一个 `160` 字节的随机生成的 id。节点之间的距离由 `XOR` 确定。网络以这样的方式组织：节点对于每个相对距离：`2^i < d <= 2^(i+1)` 只知道 `K` (在最初的客户端实现中 `K=7`)。

初始对等节点通过[发送](https://github.com/serokell/kademlia/blob/bbdca50c263c6dae251e67eb36a7d4e1ba7c1cb6/src/Network/Kademlia/Implementation.hs#L194) Kademlia 的 `FIND_NODE` 信息完成，它带有以自己节点 ID 作为[预先配置的一组节点](https://github.com/input-output-hk/cardano-sl/blob/43a2d079a026b90ba860e79b5be52d1337e26c6f/src/Pos/Constants.hs#L89)以及通过用户命令行输入的节点的参数。我们的实现中会一次[发送](https://github.com/input-output-hk/cardano-sl/blob/43a2d079a026b90ba860e79b5be52d1337e26c6f/infra/Pos/DHT/Real/Real.hs#L228)这个请求给所有已知的对等节点，然后等待第一个回复。

客户端运行时，每个 Kademlia 协议收集对等节点。已知对等节点在后续启动之间保存，[恢复](https://github.com/serokell/kademlia/blob/bbdca50c263c6dae251e67eb36a7d4e1ba7c1cb6/src/Network/Kademlia.hs#L197)。对于每个对等体，我们保存其[主机和端口号](https://github.com/serokell/kademlia/blob/bbdca50c263c6dae251e67eb36a7d4e1ba7c1cb6/src/Network/Kademlia/Types.hs#L42)，以及它们的[节点 id](https://github.com/serokell/kademlia/blob/bbdca50c263c6dae251e67eb36a7d4e1ba7c1cb6/src/Network/Kademlia/Types.hs#L70)。

### Messaging

Kademlia 已经提供了已知节点的概念。这样的节点可以被称为*邻居*。要将消息发送到网络上的所有节点，你可以发送给邻居，它们会将其发送给它们的邻居，依次类推。但有时候我们可能不需要在整个网络上传播消息，而是只将消息发送给邻居。因此我们有三种类型的发送消息：

- 发送给一个节点，
- 发送给邻居，
- 发送给网络。

#### 消息类型

为了处理这个，使用三种消息头，并且有两种消息：

- 简单：发送给一个同伴。
- 广播：试图发送到整个网络，迭代地发送消息到邻居。

广播消息在检索（在处理之前）重新发送给邻居。而且，它们会通过 LRU 缓存检查，已经收到的消息会被忽略。


### 领导者和富人计算（LRC）

『Slot 领导者』和『富人』是乌洛波罗斯权益证明算法的重要概念。

- Slot 领导者：当前 epoch（当前 epoch 的每个 slot） 的 slot 领导者是在而当前 epoch 开始时通过[追随中本聪](/cardano/proof-of-stake/#追随中本聪)（FTS）计算的。FTS 使用 `shared seed`，它是前一个 epoch [多方计算](/cardano/proof-of-stake/#多方计算)（MPC）算法的结果：MPC 结果中，一些节点揭露它们的 种子，这些种子的 `xor` 称为 `shared seed`。

- 富人：只有已经发送 VSS 证书并且有足够权益的节点才能参与 MPC 算法。在 epoch 的开始，节点必须知道所有潜在的参与者以在这个 epoch 中验证 MPC 消息。富人也是在当前 epoch 的开始计算的。

富人对于其他组件也很重要；例如，更新系统使用富人判断节点是否可以发布更新协议和投票。

有两种计算富人的方法：

- 考虑共同权益 
- 考虑委派权益（乌洛波洛斯提供委派自己权益给其他节点的机会，更多信息请参阅[委派章节](/cardano/differences/#权益委派)。

MPC 和更新系统组件需要具有委派权益的富人，但不需要拥有共同权益的委派组成。

## 常量

卡尔达诺结算层使用一些基础常量。他们的值经过了协议原作者和独立安全评论员的讨论，因此强烈推荐可选客户端使用这些常量。 

这些常量在 
[`constants.yaml` 配置文件](https://github.com/input-output-hk/cardano-sl/blob/bf5dd592b7bf77a68bf71314718dc7a8d5cc8877/core/constants.yaml)
中定义，分为生产环境和开发环境。
