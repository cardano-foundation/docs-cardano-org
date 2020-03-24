---
layout: default
title: 卡尔达诺结算层钱包前端
permalink: /technical/wallet-frontend/cn/
group: cn-technical
visible: true
language: cn
---
<!-- Reviewed at cd26fb28eb48f893a4ca2d045a10da19c211b807 -->

# 卡尔达诺结算层钱包前端

卡尔达诺结算层发展时，用户需要一个可以查看资金，发送接收转账，处理其他个人电子货币钱包的任务这样的用户界面，这一需求在增长。代达罗斯钱包是对于这些需求的解决方案。

目前，它允许用户使用上述功能，并计划在不久的将来提供对其他货币的支持，包括电子货币和非电子货币。


## 构建代达罗斯客户端 API

要在本地运行代达罗斯客户端 API，您必须按照下面的要求开启 [`cardano-sl`](https://github.com/input-output-hk/cardano-sl/) 的钱包 API。

请确保您在 `cardano-sl` 的根目录。同时确保您已经安装 [npm](https://www.npmjs.com/) 程序。


## 运行和测试代达罗斯客户端 API

为了在操作中看到代达罗斯客户端 API，首先运行一个本地的卡尔达诺结算层网络：

``` bash
# run tmux in another window
$ tmux
# launch nodes
$ ./scripts/launch/demo-with-wallet-api.sh
```

默认情况下，这将启动由3个互连节点组成的尔达诺结算层网络。一个节点运行钱包 API，它会同生产环境中运行的代达罗斯钱包行为一致。


## WEBSOCKETS 通知

我们可以用一个小工具(`npm install -g wscat`)来测试 websocks：


``` bash
> wscat -c ws://127.0.0.1:8090

connected (press CTRL+C to quit)

< {"tag":"ConnectionOpened"}

< {"tag":"NetworkDifficultyChanged","contents":{"getChainDifficulty":1}}
< {"tag":"LocalDifficultyChanged","contents":{"getChainDifficulty":1}}
< {"tag":"NetworkDifficultyChanged","contents":{"getChainDifficulty":2}}
< {"tag":"LocalDifficultyChanged","contents":{"getChainDifficulty":2}}
< {"tag":"NetworkDifficultyChanged","contents":{"getChainDifficulty":3}}
< {"tag":"LocalDifficultyChanged","contents":{"getChainDifficulty":3}}
< {"tag":"NetworkDifficultyChanged","contents":{"getChainDifficulty":4}}
< {"tag":"LocalDifficultyChanged","contents":{"getChainDifficulty":4}}
```

从这我们可以看到相同的改变：

``` bash
curl http://localhost:8090/api/settings/sync/progress
```

Accound 应该重命名为地址。请查看这个 issues [CSM-249](https://issues.serokell.io/issue/CSM-249) 获取更多细节。

## 钱包事件

除了这些 HTTP 接入点外，还有一个从服务器到客户端的单向 websocket 通道，`notify` 接入点。

这个通道充当通知系统。以便可以告知代达罗斯 UI 相关事件。目前支持的事件有：

 - `LocalDifficultyChanged` - 当前区块链高度，
 - `NetworkDifficultyChanged` - 全球区块链高度，
 - `UpdateAvailable` - 新的系统可用更新，
 - `ConnectedPeersChanged` - 连接到对等节点数量的改变，
 - `ConnectionOpened` - 打开 websocket 连接，
 - `ConnectionClosed` - 关闭 websocket 连接。

由于此通道是单向的，因此从客户端发送到通道的任何消息都会被忽略。

