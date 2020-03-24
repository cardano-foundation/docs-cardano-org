---
layout: default
title: Ouroboros Proof of Stake Algorithm
permalink: /cardano/proof-of-stake/
group: cardano
visible: true
language: en
---
<!-- Reviewed at c4c45ce9a7a8f4aa6d88a32829755196a017f6a1 -->

# Ouroboros Proof of Stake Algorithm

The Ouroboros Proof of Stake (PoS) Algorithm is the most important part of the protocol.
It defines the way in which nodes reach consensus about the state of the [ledger](/glossary/#ledger).

Ouroboros is unique as the first proof-of-stake blockchain protocol based on formal, peer-reviewed academic research.

## Why Proof of Stake?

The most important thing about picking a Proof of Stake (PoS) algorithm over a Proof
of Work (PoW) algorithm (as adopted by Bitcoin), is the energy consumption
considerations. Running the bitcoin protocol is a very expensive endeavor which uses
large amounts of energy. It is estimated that 3.8 American households can be powered
for a day by the energy that is spent to generate one bitcoin transaction. These energy
requirements for running the bitcoin protocol continue to grow as more and more bitcoin
miners sink money into mining. In addition, more energy is needed as the difficulty
of the problems that their computers or mining rigs, encounter increases. This is why
researchers have investigated alternative ways to reach consensus — such as using the
so-called BFT (Byzantine Fault Tolerant), consensus algorithms and PoS algorithms.

## What is Proof of Stake?

Proof of Stake is a novel approach to block generation. The core idea of Proof of Stake
is that instead of wasting electricity on cracking computationally heavy problems, a node
is selected to generate (or “mint”) a new block with a probability proportional to the
amount of coins this node has. If a node has positive (> 0) stake, it is called a “stakeholder”.
If a node eventually becomes chosen to mint a new block, it is called a “slot leader”.

### Proof

The “proof” part of “proof of stake” refers to evidence that blocks of
transactions are legitimate.

### Stake

While “stake” means “the relative value held by addresses on the node”. By “relative
value” we mean “all the total value held by wallets on a particular node divided by
the total value in the Cardano SL system”. For more information, please see:
[Balance and Stake in Cardano SL](/cardano/balance-and-stake/)

## About Slot Leaders

Nodes with a positive stake are called stakeholders, and only stakeholders may
participate in running the protocol. Moreover, to be able to generate new blocks
for the blockchain, a stakeholder must be elected as a slot leader. The slot leader can
listen to transactions announced by other nodes, make a block of those transactions,
sign this block with its secret key and publish it to the network.

You can think of a slot leader as a miner in bitcoin, but the above-mentioned consensus
defines who will be able to mine, when and how much.

## Epochs and Slots

The Ouroboros protocol divides the physical time into **epochs**, and each epoch is
divided into **slots**. For example:

```
+----------+----------+-------+----------+--------------------> t
|  slot 0  |  slot 1  |  ...  |  slot N  |

 \                                      / \
  -------------- epoch M ---------------   -- epoch M+1 -- ...
```

**Note:** a slot is a relatively short period of time (for example, 20 seconds).

Each slot has one and only one leader (slot leader, SL):

```
+----------+----------+-------+----------+----> t
|  slot 0  |  slot 1  |  ...  |  slot N  |

    SL 0       SL 1               SL N
```

The slot leader has a (sole) right to produce one and only one block during his slot:

```
  +------+   +------+           +------+
  | Bl 0 |<--| Bl 1 |<-- ... <--| Bl N |
  +------+   +------+           +------+
+----------+----------+-------+----------+----> t
|  slot 0  |  slot 1  |  ...  |  slot N  |

    SL 0       SL 1               SL N
```

It means that the number of slot leaders is strictly equal to the number of slots
in epoch (let's call this number `N`), so it is impossible to produce more than `N`
blocks during an epoch.

If slot leader missed their slot (for example, when offline), the right to produce
a block is lost until they are elected again.

**Note:** One or more slots can remain empty (without generated blocks), but the
majority of blocks (at least 50% + 1) **must** be generated during an epoch.

## How Slot Leaders Elections Work

Slot leaders are elected from the group of all stakeholders. Please note that not all
stakeholders participate in this election, but only ones who have enough stake (for example, 2% of
the total stake). This group of stakeholders are known as “electors”.

Electors elect slot leaders for the next epoch during the current epoch. Thus, at the end of epoch
`N` it is already known who are slot leaders for the epoch `N+1`, and it cannot be
changed.

You can think of this election as a “fair lottery”; anyone from the group of stakeholders can
become a slot leader. However, an important idea of PoS is that the more stake stakeholder has,
the more chances one has to be elected as a slot leader. 

**Note:** One stakeholder can be elected as a slot leader for more than one slot
during the same epoch.

### Multiparty Computation

One of the fundamental problems of the slot leader election process is its unbiasedness.
A certain degree of randomness is needed as a base for election, in this case, results of
this election are random and fair. So the question is where can this randomness be obtained
from?

A multiparty computation (MPC) approach is used to achieve this randomness where each elector
independently performs an action which is called “coin tossing” and after that shares results
with other electors. The idea is that results are randomly generated by each elector, but eventually
they agree on the same final value.

#### Commitment Phase

First of all, an elector generates a secret (or special random value). Next, an elector forms a
“commitment” which is a message that contains encrypted shares (see an explanation below) and
proof of secret.

The next step is when an elector signs this commitment with its secret key, specifies the epoch's
number and attaches its public key. In this case, everybody can check who created this commitment
and which epoch this commitment relates to.

Subsequently, an elector sends its commitment to other electors, so eventually each elector collects
commitments from all other electors.

**Note:** these commitments are put into the block, that is, they become a part of the blockchain.

#### Reveal Phase

The reveal phase is where an elector sends an “opening”, or special value for opening a commitment.
A commitment is like a locked box (with a secret in it), and the act of opening involves a key that
opens the box retrieves the secret.

**Note:** all openings are put into the block, that is, they become a part of the blockchain.

#### Recovery Phase

The final phase in the process is called the recovery phase.

Eventually, an elector has both commitments and openings. Theoretically some electors can be an
adversary and can publish its commitment but **not** publish its opening.

In this case, the honest electors can post all shares (mentioned above) to reconstruct the
secret. The idea is simple: an election finishes successfully even if some electors are adversaries.

Subsequently, an elector verifies that commitments and openings match, and if so, extracts the
secrets from the commitments and forms a seed (randomly generated byte string) from these secrets.
So all electors get the same seed, and it will be used for Follow the Satoshi (FTS) algorithm.

### Follow the Satoshi

At this moment, electors have the seed (randomness we need). Now they have to select a particular slot
leaders for the next epoch. This is where the Follow the Satoshi (FTS) algorithm comes into effect:

```
         +-----+
SEED --->| FTS |---> ELECTED_SLOT_LEADERS
         +-----+
```

To explain how a slot leader gets selected, think of the smallest, atomic piece
of value as a coin called “[Lovelace](/glossary/#lovelace)”. Fundamentally, the ledger produces the
distribution of coins, and since slot leaders can only be selected from stakeholders distribution of
stake. FTS is an algorithm that verifiably picks a coin, and when coin owned by stakeholder `S` selected,
`S` become a slot leader. It is clear that the more coins `S` has, the higher the probability that one
of his coins will be picked.

The reason why it is called “Follow the Satoshi” is that in bitcoin, an atomic piece of currency
is called “Satoshi”, honoring Satoshi Nakamoto, the creator of bitcoin. 

## Honest Majority

The fundamental assumption of a protocol is known as **honest majority**. This means that
participants owning at least 50% + 1 of the total stake are honest ones. In this
case we can **prove** that adversaries cannot break _persistence_ and _liveness_
of the blockchain. For more information see the [paper](/glossary/#paper) (pages 2 and 3).
