---
layout: default
title: Leader Selection in Cardano SL
permalink: /technical/leader-selection/
group: technical
visible: true
language: en
---
<!-- Reviewed at e1d0f9fb37a3f1378341716916f0321fb55698df -->

# Leader Selection in Cardano SL

This chapter describes [slot-leader](/glossary/#slot-leader) selection process.

## Follow the Satoshi

As mentioned [earlier](/cardano/proof-of-stake/#follow-the-satoshi), Cardano SL
uses Follow the Satoshi (FTS) algorithm to choose slot leaders. Leaders for
each slot of the current epoch are computed by FTS in the beginning of the current
epoch. So genesis block contains a list of selected slot leaders. The number of
selected slot-leaders corresponds to a number of slots in epoch, and this number
[depends](https://github.com/input-output-hk/cardano-sl/blob/5f7b619c6ec9056c6fe778d862c426233af165df/core/Pos/Core/Constants/Raw.hs#L136)
on fundamental security parameter `k` defined in [configuration
file](https://github.com/input-output-hk/cardano-sl/blob/446444070ee09857603797a90af970fff215c8c5/core/constants.yaml#L10).

FTS uses a [shared
seed](https://github.com/input-output-hk/cardano-sl/blob/446444070ee09857603797a90af970fff215c8c5/core/Pos/Core/Types.hs#L256)
which is result of [Multi Party Computation
(MPC)](/cardano/proof-of-stake/#multi-party-computation) algorithm for previous
epoch: in the result of MPC some nodes reveal their seeds, XOR of these seeds is
called *shared seed*. Actually shared seed [is a bytestring](https://github.com/input-output-hk/cardano-sl/blob/446444070ee09857603797a90af970fff215c8c5/core/Pos/Core/Types.hs#L257).

The probability that a stakeholder will be chosen as a slot leader is
proportional to the number of coins this stakeholder holds. The same stakeholder
can be chosen as a leader for multiple slots within an epoch.

## Algorithm

Theoretical aspects of the slot leader selection process is described in
[paper](/glossary/#paper), page 11.

The node sorts all unspent outputs (`utxo`) in a deterministic way
(lexicographically), so result is an ordered
[sequence](https://github.com/input-output-hk/cardano-sl/blob/1f866450a8a530c119e3fc9edb84c97c56417aa2/src/Pos/Genesis.hs#L177)
of pairs `(StakeholderId, Coin)`, where `StakeholderId` is an id of stakeholder
(its public key hash) and `Coin` is an amount of coins this stakeholder has.
It's assumed that `utxo` [isn't
empty](https://github.com/input-output-hk/cardano-sl/blob/1f866450a8a530c119e3fc9edb84c97c56417aa2/src/Pos/Lrc/FtsPure.hs#L52).

Then the node chooses several random `i`s between `1` and [amount of Lovelaces
in the system](https://github.com/input-output-hk/cardano-sl/blob/1f866450a8a530c119e3fc9edb84c97c56417aa2/src/Pos/Lrc/FtsPure.hs#L49).
To find owner of `i`-th coin node finds the lowest `x` such that sum of all coins
in this list up to 'i'-th is not less than 'i' (and then 'x'-th address is the
owner of `i`-th coin).

The result is a non-empty sequence of `StakeholderId`, ids of selected stakeholders.
This sequence of [`SlotLeaders`](https://github.com/input-output-hk/cardano-sl/blob/5f7b619c6ec9056c6fe778d862c426233af165df/core/Pos/Core/Types.hs#L264)
is storing in the [node's runtime
context](https://github.com/input-output-hk/cardano-sl/blob/da70b2597aab352d7574a3946a366395b09e97eb/node/src/Pos/Context/Context.hs#L94).

With P2SH addresses, node doesn't know who is going to end up with funds sent to
them. Therefore, P2SH addresses can contain destination address which specifies
which addresses should count as “owning” funds for the purposes of FTS.
