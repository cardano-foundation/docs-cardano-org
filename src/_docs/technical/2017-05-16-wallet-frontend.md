---
layout: default
title: Cardano SL Wallet Frontend
permalink: /technical/wallet-frontend/
group: technical
visible: true
language: en
---
<!-- Reviewed at cd26fb28eb48f893a4ca2d045a10da19c211b807 -->

# Cardano SL Wallet Frontend

When developing Cardano SL, the need arose for a UI from which users could
access their funds, send and receive transactions, and perform other tasks
related to managing a personal cryptocurrency wallet. The Daedalus wallet is the
Cardano's solution to these necessities.

Currently, it allows a user to use their ADA in the aforementioned actions, and
providing support for other currencies is planned for the near future — as is
the exchange between different currencies, both digital and not.

## Building Daedalus client API

To run Daedalus client API locally, you have to start [`cardano-sl`](https://github.com/input-output-hk/cardano-sl/)
with wallet API as follows.

Please make sure that you are in the root directory of `cardano-sl` repository.
Also make sure you have [npm](https://www.npmjs.com/) program.

## Running and testing Daedalus client API

In order to see Daedalus client API in action, first run a local Cardano SL network:

``` bash
# run tmux in another window
$ tmux
# launch nodes
$ ./scripts/launch/demo-with-wallet-api.sh
```

By default, this should launch Cardano SL network consisting of 3 nodes talking to
each other. One node is running wallet API, and it will behave the same as Daedalus
wallet that is run in production.

## Notify websockets

We can test the websockets with a small utility
application(`npm install -g wscat`):

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

We should be seeing the same changes manually from here:

``` bash
curl http://localhost:8090/api/settings/sync/progress
```

Account should be renamed into address. Please see an issue
[CSM-249](https://issues.serokell.io/issue/CSM-249) for details.

## Wallet events

Aside from these HTTP endpoints, there is one unidirectional websocket channel
opened from server to client, the `notify` endpoint.

This channel serves as a notification system so that Daedalus UI can be informed
about events. Currently supported events are:

-   `LocalDifficultyChanged` - local blockchain height,
-   `NetworkDifficultyChanged` - global blockchain height,
-   `UpdateAvailable` - new system update available,
-   `ConnectedPeersChanged` - number of peers connected to the node changed,
-   `ConnectionOpened` - websocket connection opened,
-   `ConnectionClosed` - websocket connection closed.

As this channel is unidirectional, any message sent to the channel from the
client will be ignored.
