Getting Started with Stake Pool Operations
==========================================

Stake pools use the Cardano node to validate how the pool interacts with the network, sends transactions, creates blocks, and so on.

**About Stake Pool Operators and Owners**

Successfully operating a stake pool includes the roles of a stake pool operator and a stake pool owner(s). It is important to note that there is a conceptual difference between these two roles:

+ **A stake pool operator** is a person who is assigned responsibility for setting up and keeping the stake pool running, which means that they own or rent a server, hold the key of the stake pool, and hold responsibility for running and monitoring the node. With their key, a stake pool operator can sign blocks, register, re-register, or retire a stake pool, and post updated certificates.
+ **A stake pool owner** is a person who pledges their stake to the pool to increase the pool’s reward earning capacity and desirability. The ability of the owner to `pledge stake`_ provides protection against Sybil attacks.

.. _pledge stake: https://docs.cardano.org/en/latest/explore-cardano/understanding-pledging-and-rewards.html 

Usually, the stake pool operator and the owner is the same person, however, a stake pool can also have multiple owners, who pledge their stake to form one larger pool to ensure it is competitive. Even in this case, there is still only one stake pool operator who is responsible for stake pool processes.

It is essential that stake pool owners trust a stake pool operator. All operators’ and owners’ rewards are paid out into a single shared reward account associated with the reward address of the pool, and are distributed by the protocol amongst the owner accounts. The reason for this is that otherwise, everyone could choose to become a co-owner of a stake pool instead of delegating, which would render the mechanism of pledging stake ineffective.

This makes it clear to all parties that an agreement is needed to define when and how the accumulated rewards in a shared account should be split. For example, they can agree to have the operator control the shared account, or they could choose to use a multisig account.

To run a pool effectively, a bi-directional relationship and trust are crucial. If this trust is broken, other parties can lose in regards to accumulated or potential rewards, or reputation for the operator.

*To eliminate such a case, it is beneficial for owners and operators to consider entering into contractual arrangements.* 

**Operating a stake pool**

Stake pools are a key part of a decentralized Cardano, supporting the mechanisms that ensure the long-term health and liveness of the network. By running a stake pool, stake pool operators enable other users to participate in the protocol and gain rewards without needing to continuously run an online node.

.. toctree::
   :maxdepth: 1
   :titlesonly:

   prerequisites
   hardware-requirements
   stake-pool-performance
   stake-pool-ranking
   keys
   operational-certificate
   metadada
   public-stakepools
   metadata-proxy-servers

**How to create a stake pool**

To learn how to setup your own stake pool, follow the instructions on `how to setup a stake pool`_.

.. _how to setup a stake pool: https://docs.cardano.org/projects/cardano-node/en/latest/getting-started/install.html

**Recommended setup**

As stake pool operator, you will have two types of nodes, core nodes and relay nodes. Each core node must be accompanied by one or more relay nodes.

To be clear: Both types of nodes run exactly the same program, cardano-node. The difference between the two types is that core nodes are responsible for producing blocks, while relays are responsible for communicating with other relays in the network and broadcasting blocks. This difference determines how they are configured and how they are connected to the network.

* A core node is configured with various key-pairs and an operational certificate needed for block generation (cold keys, KES hot keys and VRF hot keys). It only connects to its relay nodes.

* A relay node doesn't need any keys and will therefore be unable to produce blocks. It is connected to its core node, other relays and external nodes.

Each node should run on a dedicated server, and the core node server's firewall should be configured to only allow incoming connections from its relays.

.. image:: network1.png

**Establishing connectivity between the nodes**

All nodes are connected to each other within the Cardano networking layer. This connection is essential for information exchange about transactions and new block creation.

With Byron, federated nodes were wholly responsible for managing block production and network connections. The Byron network consisted of a set of federated core nodes - static nodes that produced blocks, and maintained the Cardano network. With the launch of Shelley, the network runs in a hybrid mode with federated nodes operated by IOG and manually configured connections between different stake pool operators (SPOs), and between SPOs and the IOG nodes. Over the lifetime of the Shelley system, the network will transition into full decentralization using continuous automatic discovery and selection of peers.  

During the initial phase, nodes connect to other nodes by means of a static configuration, defined in a topology file. To avoid a situation when relay nodes go offline, which causes the block-producing nodes to be inaccessible, it is crucial to connect to reliable relay nodes. Currently, IOG offers all SPOs reliable nodes to which they can connect. It is also recommended that SPOs use the community lists and tools to generate a configuration that uses 20 or more other SPOs as peers. In practice, many SPOs can use more than 20 peers for connection purposes. The community tools help to select peers that are both nearby and far away so that there is strong inter-region connectivity.

Before the network is moved from federated to fully decentralized, the node’s network layer will be switched to use continuous automatic discovery and peer selection. This will be achieved through upgrades to the network stack. Initially this will enable improved automation of connecting SPO relays to each other so that less static manual configuration is needed. Ultimately it will enable a full peer-to-peer (P2P) topology for all Cardano nodes, which will make the network less reliant on IO-run relays.

Please follow this link to read more about the `Cardano network`_, communication between the nodes, and mini-protocols that enable this functionality.

.. _Cardano network: https://docs.cardano.org/en/latest/explore-cardano/cardano-network.html

