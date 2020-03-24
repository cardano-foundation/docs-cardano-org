---
layout: default
title: Transaction Fees
permalink: /cardano/transaction-fees/
group: cardano
language: en
---

# Transaction Fees in Cardano SL

## Motivation

There are two main reasons why transaction fees are needed for Cardano SL:

1.  People who run full Cardano SL nodes spend time, money and effort to run the protocol, for which they should
    be compensated and rewarded. In contrast to Bitcoin, where new currency is created with each mined block,
    in Cardano SL, transaction fees are the only source of income for participants in the protocol.
2.  The second reason is the prevention of DDoS (Distributed Denial of Service) attacks. In a DDoS attack, an attacker
    tries to flood the network with dummy transactions, and if he has to pay a sufficiently high fee for each of those
    dummy transactions, this form of attack will become prohibitively expensive for him.

## How transaction fees work

Whenever somebody wants to transfer an amount of Ada, some minimal fees are computed for that transaction. In order for
the transaction to be valid, these minimal fees have to be included, although the sender is free to pay higher fees if
he so wishes.

Please also read about transaction distribution [below](#transaction-fees-distribution).

## Minimal transaction fees

The minimal fees for a transaction are calculated according to the formula:

```
a + b × size
```

where:

*  `a` is a special constant, at the moment it is 0.155381 ADA;
*  `b` is a special constant, at the moment it is 0.000043946 ADA/byte;
*  `size` is the size of the transaction in bytes.

This means that each transaction costs at least 0.155381 ADA, with an additional cost of 0.000043946 ADA per byte of
transaction size. For example, a transaction of size 200 bytes (a fairly typical size) costs:

```
0.155381 ADA + 0.000043946 ADA/byte × 200 byte = 0.1641702 ADA.
```

The reason for having parameter `a` is the prevention of DDoS attacks mentioned above: even a very small dummy
transaction should cost enough to hurt an attacker who tries to generate many thousands of them.

Parameter `b` has been introduced to reflect actual costs: storing larger transactions needs more computer memory
than storing smaller transactions, so larger transactions should be more expensive than smaller ones.

Although particular values for parameters `a` and `b` were calculated, these values will probably be adjusted in
future to better reflect actual costs.

## Transaction fees distribution

All transaction fees of a given [epoch](https://cardanodocs.com/glossary/#epoch) are collected in a virtual pool,
and the idea is to then redistribute the money from that pool amongst people who were elected [slot leaders](https://cardanodocs.com/glossary/#slot-leader)
by the PoS-algorithm during that epoch and who created blocks.

At this stage of Cardano SL, where all blocks are created by nodes operated by IOHK and our partners, fees are
already collected (to prevent DDoS attacks), but they will not be distributed and instead will be burnt.

As soon as Cardano SL enters its next, [fully decentralized stage](https://cardanoroadmap.com/), fees will be
distributed as described above.
