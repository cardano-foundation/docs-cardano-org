---
layout: default
title: Bootstrap Era
permalink: /timeline/bootstrap/
group: timeline
language: en
---

<!-- Reviewed at c23493d7a33a82d559d5bd9d289486795cf6592f -->

# Bootstrap Era

After the Cardano SL Testnet era and release of Cardano SL, the network will
operate in “bootstrap mode” for a period of time called Bootstrap era. As people
who purchased Ada redeem their coins, the stake will automatically get delegated
to a pool of trusted nodes that will maintain the network. During this time no
block rewards will be issued — we will maintain the network pro bono. This is
required because in order for the protocol to function properly, some of the
stakeholders who jointly posses majority of stake have to be online, which in
reality won't be the case during the first months of network operation.

The Bootstrap era will lead to the [Reward era](/timeline/reward), during which
updates to the protocol will be issued, and the major stakeholders will be
provided with convenient options to run their nodes on personal servers in the
cloud.

## Stake Locking

The Bootstrap era is the period of Cardano SL existence that allows only fixed predefined
users to have control over the system. The set of such users (the bootstrap stakeholders)
and propotion of total stake each of them controls is defined in genesis block.

Purpose of Bootstrap era is to address concern that at the beginning of mainnet majority of
stake will probably be offline (which breaks the protocol at the start). Bootstrap era is to be ended
when network stabilizes and majority of stake is present online.

The next era after Bootstrap is called [the Reward era](https://cardanodocs.com/timeline/reward/).
Reward era is actually a "normal" operation mode of Cardano SL as a PoS-cryptocurrency.

### Requirements

1.  During Bootstrap era stake in Cardano SL should be effectively delegated to a fixed set of keys `S`.
2.  `S` = 7
3.  Stake should be distributed among `s` ∈  `S`.
4.  At the end of Bootstrap era stake should be unlocked:
    1.  Ada buyers should be able to participate in protocol themselves (or delegate their rights to some
        delegate not from `S`).
    2.  Each Ada buyer should explicitly state she wants to take control over her stake.
        * Otherwise it may easily lead to situation when less than majority of stake is online once Reward
        era starts.
    3.  Before this withdrawing stake action occurs, stake should be still being controlled by `S` nodes.

### Proposal

Let us now present the Bootstrap era solution:

1.  Initial `utxo` contains all the stake distributed among Bootstrap stakeholders. Initial `utxo`
    consists of `(txIn, txOut)` pairs, and every `txOut` contains an address with stake distribution in it.
    So we just set distribution in a way it sends all coins to all Bootstrap stakeholders.
2.  While the Bootstrap era takes place, users can send transactions changing initial `utxo`. We enforce
    setting stake distribution for each transaction output to spread stake to Bootstrap stakeholders in. This
    effectively makes stake distribution is system constant.
3.  There is genesis state of heavyweight delegation. It contains pairs `(Issuer, ProxySK)`, where
    `Issuer` is an identifier of stakeholder who delegated and `ProxySK` is a proxy secret key for delegate.
    Please note that:
    *  delegate must differ from an issuer in each pair, i. e. no revocations are allowed;
    *  delegate can't be an issuer, i.e. transitive delegation is not supported.
4.  When the Bootstrap era is over, we disable restriction on stake distribution. Bootstrap stakeholders will
    vote for Bootstrap era ending: special update proposal will be formed, where a particular constant
    will be set appropriately to trigger Bootstrap era end at the point update proposal gets adopted.
    System operates the same way as in Bootstrap era, but users need to explicitly state they understand
    owning their stake leads to responsibility to handle the node. To get his stake back user should
    send a transaction, specifying delegate key(s) in stake distribution. It may be the key owned by user
    himself or the key of some delegate (which may also be one or few of Bootstrap stakeholders).

Please read about [Stake Delegation in Cardano SL](/technical/delegation/) for more details about
delegation mechanism.
