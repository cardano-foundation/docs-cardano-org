Operating a stake pool
------------------------------------------

This section includes an overview of stake pool operations and explains the ways of creating and managing your own stake pool.

About stake pools, operators, and owners
========================================

A `stake pool <https://docs.cardano.org/en/latest/explore-cardano/what-is-a-stakepool.html>`_ is a reliable server node that holds and maintains the combined stake of various stakeholders in a single entity. Stake pools use the Cardano node to validate how the pool interacts with the network and are responsible for transaction processing and block production.

Successfully operating a stake pool includes the roles of a stake pool operator and one or more stake pool owner(s). It is important to note that there is a conceptual difference between these two roles:

+ **A stake pool operator** is a person who is assigned responsibility for setting up and keeping the stake pool running, which means that they own or rent a server, hold the key of the stake pool, and hold responsibility for running and monitoring the node. With their key, a stake pool operator can sign blocks, register, re-register, or retire a stake pool, and post updated certificates. A stake pool operator is also empowered to exclude some stake pool owners during re-registration. 
+ **A stake pool owner** is a person who pledges their stake to the pool to increase the pool’s reward earning capacity and desirability. The ability of the owner to `pledge stake`_ provides protection against Sybil attacks.

.. _pledge stake: https://docs.cardano.org/en/latest/explore-cardano/understanding-pledging-and-rewards.html 

Usually, the stake pool operator and the owner is the same person, however, a stake pool can also have multiple owners, who pledge their stake to form one larger pool to ensure it is competitive. Even in this case, there is still only one stake pool operator who is responsible for stake pool processes.

It is essential that all stake pool owners trust a stake pool operator. All operators’ and owners’ rewards are paid out into a single shared reward account associated with the reward address of the pool, and are distributed by the protocol amongst the owner accounts. The reason for this is that otherwise, everyone could choose to become a co-owner of a stake pool instead of delegating, which would render the mechanism of pledging stake ineffective.

This makes it clear to all parties that an agreement is needed to define when and how the accumulated rewards in a shared account should be split. For example, they can agree to have the operator control the shared account, or they could choose to use a multisig account.

To run a pool effectively, a bi-directional relationship and trust are crucial. If this trust is broken, other parties can lose in regards to accumulated or potential rewards, or reputation for the operator.

*Note that to eliminate such a case, it is beneficial for owners and operators to consider entering into contractual arrangements.* 

Setting up and operating a stake pool
=====================================

Stake pools are a key part of a decentralized Cardano, supporting the mechanisms that ensure the long-term health and liveness of the network. By running a stake pool, stake pool operators enable other users to participate in the protocol and gain rewards without a need to continuously run an online node.

.. toctree::
   :maxdepth: 1
   :titlesonly:

   creating-a-stake-pool
   establishing-connectivity-between-the-nodes
   creating-keys-and-operational-certificates
   public-stakepools-and-metadata-management
   SMASH-metadata-management
   stake-pool-performance
   stake-pool-ranking
   
You can also find out more about `pledging and delegating stake options here. <https://docs.cardano.org/en/latest/learn/pledging-and-delegating-options.html>`_
   
   

