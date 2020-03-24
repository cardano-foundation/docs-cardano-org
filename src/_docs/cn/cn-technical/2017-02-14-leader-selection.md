---
layout: default
title: 卡尔达诺结算层中的领导者选举
permalink: /technical/leader-selection/cn/
group: cn-technical
visible: true
language: cn
---
<!-- Reviewed at e1d0f9fb37a3f1378341716916f0321fb55698df -->

# 卡尔达诺结算层中的领导者选举

这一章描述[领导者](/glossary/#slot-leader)选举过程。

## 追随中本聪算法

如[前](/cardano/proof-of-stake/#follow-the-satoshi)所述，卡尔达诺结算层使用追随中本聪算法（FTS）来选择领导者。每个当前 epoch 的领导者在当前 epoch 开始的时候，由 FTS 算法计算得出。所以创始区块包含一组领导者列表。领导者的数量和 epoch 的 slot 数量是一致的，这个数量[取决](https://github.com/input-output-hk/cardano-sl/blob/5f7b619c6ec9056c6fe778d862c426233af165df/core/Pos/Core/Constants/Raw.hs#L136)于在[配置文件](https://github.com/input-output-hk/cardano-sl/blob/446444070ee09857603797a90af970fff215c8c5/core/constants.yaml#L10)中定义的基本安全参数 `K`。

FTS 使用[共享种子](https://github.com/input-output-hk/cardano-sl/blob/446444070ee09857603797a90af970fff215c8c5/core/Pos/Core/Types.hs#L256)，该[共享种子](https://github.com/input-output-hk/cardano-sl/blob/446444070ee09857603797a90af970fff215c8c5/core/Pos/Core/Types.hs#L256)为上个 epoch 计算的结果：在 MPC 的结果中的一些节点会揭露它们的种子，这些种子的 XOR 就被称为共享种子，实际上共享种子就是一个[字符串](https://github.com/input-output-hk/cardano-sl/blob/446444070ee09857603797a90af970fff215c8c5/core/Pos/Core/Types.hs#L257)。

股东被选举为领导者的概率与股东持有的币的数量相关。同一个股东可以在同一个 epoch 里面被选举为多个 slot 的领导者。

## 算法

在[论文](/glossary/#论文)的第11页从以学术角度描述了领导者的选举过程。

节点将所有未花费的输出(`utxo`)按照一种特定的方法（按字典）进行排序，因此结果是一对 `(StakeholderId, Coin)` 的有序[序列](https://github.com/input-output-hk/cardano-sl/blob/1f866450a8a530c119e3fc9edb84c97c56417aa2/src/Pos/Genesis.hs#L177)，`StakeholderId` 是股东的 ID（股东的公钥哈希值），`Coin` 是股东持有币的数量。这里假设 `utxo` [不是空的](https://github.com/input-output-hk/cardano-sl/blob/1f866450a8a530c119e3fc9edb84c97c56417aa2/src/Pos/Lrc/FtsPure.hs#L52)。

然后节点选择几个在 `1` 和[系统中 Lovelaces 的数量](https://github.com/input-output-hk/cardano-sl/blob/1f866450a8a530c119e3fc9edb84c97c56417aa2/src/Pos/Lrc/FtsPure.hs#L49)之间的随机数 `i`。为了找到第 `i` 个币的拥有者，节点找到最小的 `x`，使得这个列表从 `x` 到 `i` 的所有币的总数不小于 `i`(这样第 `x` 个地址就是第 `i` 个的拥有者)。


结果是一个非空的 `StakeholderId` 序列，也就是被选中的股东们的 ID，[`SlotLeaders`](https://github.com/input-output-hk/cardano-sl/blob/5f7b619c6ec9056c6fe778d862c426233af165df/core/Pos/Core/Types.hs#L264) 序列保存在[节点运行环境中](https://github.com/input-output-hk/cardano-sl/blob/da70b2597aab352d7574a3946a366395b09e97eb/node/src/Pos/Context/Context.hs#L94)。

由于是 P2SH 地址，所以节点不知道是会谁将要给它们发送资金。因此，P2SH 地址可以包含目标地址，该目标地址指明哪些地址应该被视为『拥有』用于 FTS 的基金。

