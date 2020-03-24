---
layout: default
title: 卡尔达诺结算层钱包后端
permalink: /technical/wallet-backend/cn/
group: cn-technical
visible: true
language: cn
---
<!-- Reviewed at ac0126b2753f1f5ca6fbfb555783fbeb1aa141bd -->

# 卡尔达诺结算层钱包后端


[地址](/cardano/addresses/)章节讨论的地址是发送和接收资金的基础，而钱包是简化用户最终流程的一种方式。


## 什么是钱包？

在卡尔达诺中，钱包的定义如下：


``` haskell
data CWallet = CWallet
    { cwId       :: !CWalletAddress
    , cwMeta     :: !CWalletMeta
    , cwAccounts :: ![CAccount]
    , cwAmount   :: !CCoin
    }
```

其中 `CWalletMeta` 指明当前钱包是共享的还是个人的，以及钱包使用的货币和钱包的名字。有了这个，钱包类型很容易扩展，因为任何附加的功能可以添加到 `CWalletMeta` 类型，而其他字段不变。每个钱包，无论名称，类型和货币，都必须具有上述字段。

## 交易和钱包

在[转账](/cardano/transactions/)章节定义了交易数据的结构。然而，为了方便客户的操作，交易在客户中有不同的表现形式，他们被表示为：


``` haskell
data CTx = CTx
    { ctId            :: CTxId
    , ctAmount        :: CCoin
    , ctConfirmations :: Word
    , ctMeta          :: CTxMeta
    , ctInputAddrs    :: [CAddress Acc]
    , ctOutputAddrs   :: [CAddress Acc]
    }
```


本质上，一个客户端的转账由实际交易 `Id`，收到的币的数量，交易已得到的确认数（即当前位于包含所述交易区块顶部的区块数量），输入和输出地址。元数据，数据类型 `CTxMeta`，表明交易的货币，标题或名称，描述信息，以及 POSIX 格式的发送日期。


## 钱包后端 API

目前，钱包 API 提供了一系列使用钱包的方法。Haskell 库 `servant` 提供了一个模块化的 API 构建方法。该库使用组合器来构建院子 HTTP 操作，并将这些原子方法粘合在一起以形成更大和更完整的 API。

请注意，只有当您使用 `--wallet` 选项运行节点时，钱包 Web API 才可用，这个 API 的默认端口 `8090` 可以通过 `--wallet-port` 选项进行更改。

钱包 Web API 文档可以在[这里](https://cardanodocs.com/technical/wallet/api/)找到


### TLS 连接

钱包 Web API 使用 TLS 进行安全通信。调用 API 需要发送客户端 CA 证书，该证书在启动节点时使用，并将客户端标识为允许调用服务器 API。

请注意，客户端证书文件是启动节点时 `--tlsca` 作为选项提供的文件。

例如，如果该文件是可用的 `ca.crt`，那么对于运行节点 `localhost:8090` 调用 curl 命令可以像这样：


``` bash
curl --cacert ca.crt -v https://localhost:8090/api/settings/sync/progress
```

如果该请求成功，那么您已经正确配置了 TLS。


### 处理错误

如果事件请求失败，则有一个 `WalletError` 类型，它只封装一个 `Text` 来显示发生了什么。

