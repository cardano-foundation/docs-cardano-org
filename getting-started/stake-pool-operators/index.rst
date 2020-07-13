Getting Started with Stake Pool Operations
==========================================

Stake pools use the Cardano node to validate how the pool interacts with the network, sends transactions, creates blocks, and so on.

**Operating a stake pool**

Stake pools are a key part of a decentralized Cardano, supporting the mechanisms that ensure the long-term health and liveness of the network. By running a stake pool, stake pool operators enable other users to participate in the protocol and gain rewards without needing to continuously run an online node.

.. toctree::
   :maxdepth: 1
   :titlesonly:

   prerequisites
   hardware-requirements
   keys
   operational-certificate
   metadada
   public-stakepools
   metadata-proxy-servers


**Recommended setup**

As stake pool operator, you will have two types of nodes, core nodes and relay nodes. Each core node must be accompanied by one or more relay nodes.

To be clear: Both types of nodes run exactly the same program, cardano-node. The difference between the two types is that core nodes are responsible for producing blocks, while relays are responsible for communicating with other relays int the network and broadcasting blocks. This difference determines how they are configured and how they are connected to the network.

* A core node is configured with various key-pairs and an operational certificate needed for block generation (cold keys, KES hot keys and VRF hot keys). It only connects to its relay nodes.

* A relay node doesn't need any keys and will therefore be unable to produce blocks. It is connected to its core node, other relays and external nodes.

Each node should run on a dedicated server, and the core node server's firewall should be configured to only allow incoming connections from its relays.

.. image:: network1.png


**How to create a stake pool**

To learn how to setup your own stake pool, please follow the `Cardano Tutorials`_

.. _Cardano Tutorials: ../../cardano-tutorials/readme
