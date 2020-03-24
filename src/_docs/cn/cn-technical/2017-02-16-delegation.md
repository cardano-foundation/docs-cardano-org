---
layout: default
title: 卡尔达诺股权委派
permalink: /technical/delegation/cn/
group: cn-technical
visible: true
language: cn
---
<!-- Reviewed at c23493d7a33a82d559d5bd9d289486795cf6592f -->

# 卡尔达诺结算层股权委派

这一章描述权益委托过程的实现细节。

如前所述。为了产生新区块，被选举为领导者的股东必须在线。这种情况可能没有什么吸引力，因为大多数的当选股东都必须为了刷新随机数而参加投币协议（领导者选举过程的关键属性）。如果有很多当选的领导者，会让股东和网络都有很大的压力，因为需要广播和存储大量的提交和共享。

委派的功能允许被称为发行人（_issuers_） `I1...In` 的股权所有人将他们的『参与义务』转移给某些代表团（_delegates_） `D1...Dm`，这些代表团会在[投币协议](https://github.com/input-output-hk/cardano-sl/blob/4bd49d6b852e778c52c60a384a47681acec02d22/src/Pos/Ssc/GodTossing.hs)中代表股权所有人 `S1...Sn`。在这种情况下，真正参与到投币协议中节点的数量就少很多，可以看看[论文](/glossary/#paper)的第38页。

不仅如此，代表团不仅可以生产新区块，参与到 [MPC/SSC](/technical/leader-selection/#follow-the-satoshi) 中，还可以在[系统更新](/cardano/update-mechanism/)时进行投票。

## 策略

领导者可以将自己生产新区块的权利转移给代表团。为了转移这个权利，领导者使用一个代理委托的策略：领导者产生一个[代理签名钥匙](https://github.com/input-output-hk/cardano-sl/blob/4378a616654ff47faf828ef51ab2f455fa53d3a3/core/Pos/Crypto/SignTag.hs#L33)，或者说 PSK，然后代表团会使用它[签名](https://github.com/input-output-hk/cardano-sl/blob/ed6db6c8a44489e2919cd0e01582f638f4ad9b72/src/Pos/Delegation/Listeners.hs#L65)信息来认证一个区块。有两种类型的 PSK：重量级和轻量级（见下文）

具体来说，股权所有人通过自己的公钥构建一个特殊证书来指定代表团的身份。以便之后代表团可以在有限的信息空间内用已签名的证书在自己的公钥下为这些信息提供签名。


这是[代理签名](https://github.com/input-output-hk/cardano-sl/blob/d01d392d49db8a25e17749173ec9bce057911191/core/Pos/Crypto/Signing.hs#L256)的格式。它包括了：

* 代理私钥，
* 签名。

代理私钥包括：

1. omega 值，
2. 发行人的公钥，
3. 代表团的公钥，
4. 代理证书。

Omega (or ω) 是[论文](/glossary/#paper)中一个特殊的值。在我们的实现中，它是[一对 epoch 的标识符](https://github.com/input-output-hk/cardano-sl/blob/f374a970dadef0fe62cf69e8b9a6b8cc606b5c7d/core/Pos/Core/Types.hs#L235)。这些标识符定义了委托有效期：如果 epoch 索引在这个范围内那么生产的区块就是有效的。

[代理证书](https://github.com/input-output-hk/cardano-sl/blob/d01d392d49db8a25e17749173ec9bce057911191/core/Pos/Crypto/Signing.hs#L209)就是 omega 和代表团公钥的[签名](https://github.com/input-output-hk/cardano-crypto/blob/84f8c358463bbf6bb09168aac5ad990faa9d310a/src/Cardano/Crypto/Wallet.hs#L74)。

## 重量级委派

重量级委托使用权益阈值 `T`，这意味着股权所有人拥有的权益不少于 `T` 时才能参与重量级委托。这个阈值在[配置文件](https://github.com/input-output-hk/cardano-sl/blob/42f413b65eeacb59d0b439d04073edcc5adc2656/lib/configuration.yaml#L224)中定义。就像主网的这个阈值是总权益的 0.03%，这个值可以通过系统更新来改变。

来自重量级委托的代理签名证书存储在区块链中。请注意发行者在每个 epoch 只能发布一个证书。

请注意重量级委托有一个传递关系，所以，如果 `A` 委派给 B，然后 B 又委派给 `C`，那么 `C` 代表的权益等于 `A + B`，而不仅仅是 `B`。


### 到期

在每一个 epoch 开始时，股权所有人不再传递阈值 `T`, 那么重量级委派证书就会过期。这样做是为了预防委派池膨胀攻击：用户提交了一个证书然后将自己所有的钱（高于阈值）都转到另一个账户，并且重复此操作。


## 轻量级委派

**注意：目前轻量级委派功能是关闭的，在 [Shelley 版本](https://cardanoroadmap.com/)中会打开这个功能，所以下面的信息可能是过期的。**

与重量级委托相反，轻量级委派不要求代表团拥有 `T` 或更多的股份。所以轻量级委派可以用于任何的节点。但是轻量级委派的代理签名证书不存在区块链中，所以轻量级委派证书必须要广播到代表团。

之后轻量级 PSK 可以被指定发行者的公钥、签名和信息本身进行[验证](https://github.com/input-output-hk/cardano-sl/blob/42f413b65eeacb59d0b439d04073edcc5adc2656/lib/src/Pos/Delegation/Logic/Mempool.hs#L309)。

请注意『每个 epoch 只能发布一个证书』的规则在轻量级委托中不适用。因为轻量级证书不存储在区块链中，所以可以在每个 epoch 签发很多轻量级证书，不会导致区块链膨胀。


### 确认代理签名支付

代表团应该使用他拥有的代理签名密钥，使用 PSK 和代表团的钥匙制作一个 PSK 签名。如果签名是正确的，那么就是由代表团进行签名的（由 PSK 策略确保是这种结果）。

## 为什么有两个委派

你可以将重量级委托和轻量级委托想象成强委托和弱委托。

重量级委派证书被存储在区块链中，所以被委派的权益可能会通过加入到委派权益中而参与 MPC。所以有很多重量级委派的代表团可能会累计足够的权益通过阈值的门槛。不仅如此，重量级委派可以参与卡尔达诺结算层更新的投票。

与此相反，轻量级委派的权益不会被计算到代表团的 MPC 相关权益。所以轻量级委派只能用来生产新区块。

## 回撤证书

回撤证书是一种特殊的证书，发行者创建一个回撤证书来撤回委托。重量级委托和轻量级委托都可以被撤回，不过撤回的方法不同。

作为相同的标准 PSK 的发行者和委派，撤销证书也是相同的。（换句话说，发行者委派给他自己）

要撤销轻量级委派，发行者发送撤销证书给网络，要求撤销委派，但是不能强制撤销，因为轻量级的 PSK 不是区块链的一部分。所以理论上轻量级委派是可以忽略撤销证书的，这样的话，他就一直保持着委派直到它的委派过期。但这样的情况不会妨碍区块链。

重量级委派撤销的处理是另一种方式。因为来自重量级委派的代理签名证书是存储在区块链中的，撤销证书也会被提交到区块链中。这种情况下，节点会删除撤销证书签发之前的重量级委派证。不过有三点很重要：

* 如果提交的重量级委派证书是在节点的内存池里，而且撤销证书也被提交了，那么委派证书将会从内存池中被删除，显然，这种情况下委派证书将永远不会添加到区块链中。  
* 如果一个用户提交委派证书后丢失了他的钱，他仍然可以撤销那个委派，即使那个时候他已经没有足够的钱了（也就是说他拥有的钱少于上面提到的阈值 `T`)  
* 尽管发行者在当前的 epoch 只能发布一个证书，在同一个 epoch 他可以撤销他的重量级委派。

