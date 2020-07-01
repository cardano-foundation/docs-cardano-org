---
title: What is proof of stake?  
description: About
parent: 2020-05-04_05-00-00_about-en.md
order: 2
last_updated: "2020-06-26T09:00:00+01:00"
---
## What is proof of stake?
Proof of stake is a type of consensus mechanism used to reach agreement on records in the blockchain. It ensures distributed consensus based on the stake, or wealth, that is held by participants in the system. This stake is used as the main resource to determine the participant’s power in the system for maintaining the ledger.

Ada held on the Cardano network represents a stake in the network, with the size of the stake proportional to the amount of ada held. As a user's value increases, the opportunity to maintain the ledger by producing new blocks also increases. The creator of a new block is chosen randomly, where the probability of a user being chosen is determined by their stake.

Proof of stake is undoubtedly more efficient, by orders of magnitude, than proof of work as it uses less electricity and computing power. Crucially, our ground-breaking proof-of-stake consensus protocol [Ouroboros](https://iohk.io/en/blog/posts/2020/06/23/the-ouroboros-path-to-decentralization/) is proven to have the same security guarantees that proof of work has. This protocol determines how individual nodes assess the current state of the ledger system and reach a consensus. Rigorous security guarantees are established by Ouroboros and it was delivered with several peer-reviewed papers that were presented in top-tier conferences and publications in the area of cybersecurity and cryptography. Different [implementations of Ouroboros](https://iohk.io/en/blog/posts/2020/03/23/from-classic-to-hydra-the-implementations-of-ouroboros-explained/) have been developed. For further details on each flavour of Ouroboros, you can read the technical specifications for [Classic](https://iohk.io/en/research/library/papers/ouroborosa-provably-secure-proof-of-stake-blockchain-protocol/), [Byzantine Fault Tolerance (BFT)](https://iohk.io/en/research/library/papers/ouroboros-bfta-simple-byzantine-fault-tolerant-consensus-protocol/), [Genesis](https://iohk.io/en/research/library/papers/ouroboros-genesiscomposable-proof-of-stake-blockchains-with-dynamic-availability/), [Praos](https://iohk.io/en/research/library/papers/ouroboros-praosan-adaptively-securesemi-synchronous-proof-of-stake-protocol/), and more recently the scalability solution [Hydra](https://eprint.iacr.org/2020/299.pdf). 

To be secure, Ouroboros requires a good number of ada holders to be online and maintain sufficiently good network connectivity at any given time. A core feature of Cardano are stake pools, operational nodes that are committed to run the protocol 24/7, on behalf of the contributing ada holders who have organized themselves into a combined pool. These reliable block-producing server nodes hold the combined stake of the group of stakeholders in a single entity, the stake pool. Delegation in Cardano is designed in such a way that members of a stake pool retain full control over spending their ada at all times. Stake pools are responsible for processing transactions and producing new blocks and are managed by stake pool operators, who earn rewards in return for their commitment and effort. Stake pool members also receive rewards for contributing to the pool by delegating their stake.


