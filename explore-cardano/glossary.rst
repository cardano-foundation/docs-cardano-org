.. _glossary:

Cardano Glossary
################

.. glossary::
    ada
      digital currency of the Cardano blockchain. One ada = 1,000,000 lovelaces.
    
    address
      indicates a unique set of numbers and symbols identifying a particular wallet. The address allows users to receive payments, process transactions, and control their stake.

    Adrestia
      name of the Haskell wallet backend.
      
    asset
      a digital item of property that holds value stored in the distributed ledger. An asset can represent security or utility tokens of fungible or non-fungible nature.

    balance wallet
      a wallet that stores your initial testnet ada balance, copied from the mainnet via the balance snapshot. The stake from this wallet cannot be delegated but can be transferred to and delegated from a Rewards wallet.

    Basho
      fourth phase of Cardano development in which performance improvements will be integrated.
      
    BFT
      Byzantine fault tolerance (BFT), is a property in the system that ensures there is resistance to certain types of failures. A BFT system can continue to operate even if some nodes fail or malicious behavior occurs in the system.

    block
      a slot that contains a set of recent transactions on the network. Each block also contains data required to manage the blockchain such as an encrypted version of the previous block. As each block is completed, a new block is created to extend the chain.

    Byron
      first 'boot strap' phase of Cardano development.
      
    chain
      a set of blocks that have been produced and are connected to another in consecutive order.

    consensus
      the process by which a majority opinion is reached by everyone who is involved in running the blockchain. Agreement must be made on which blocks to produce, which chain to adopt, and to determine the single state of the network.

    controlled stake
      the total amount of stake that a stake pool controls. It combines the stake that is owned by the pool operator with any stake that has been delegated to the pool by other ada holders. It can be measured as a total ada amount (e.g. 3M ada), or as a percentage of the total supply of ada within the network (e.g. 5%).

    cost per epoch
      a fixed fee, in ada, which the stake pool operator takes every epoch from the pool rewards to cover the costs of running a stake pool. The cost per epoch is subtracted from the total ada that is rewarded to a pool, before the operator takes their profit margin. Whatever remains is shared equally among the delegators.
      
    Daedalus
      a secure wallet for the ada cryptocurrency that manages balances and provides the ability to send and receive payments. Daedalus is a full node wallet which means that it downloads a full copy of the Cardano blockchain and independently validates every transaction in its history. It has a friendly user interface and is recommended for new users to start with.

    DApp
      decentralized application.

    delegation
      the process by which ada owners can participate in the network and earn rewards by delegating the stake associated with their ada holdings to a stake pool.

    epoch
      a defined group of slots that constitute a period of time.

    faucet
      a web-based service that provides free tokens to users of a testnet.
      
    fee
      amount of ada or other cryptocurrency charged for transaction processing.
      
    fungible token
      a digital asset representing value that can be divided into smaller fractions like one ada is divided into lovelaces or one bitcoin into satoshi.

    Goguen
      third phase of Cardano development in which smart contracts will be delivered.
      
    hard fork
      a radical change of the network’s protocol changing the state of operational flow from one model to a completely different one. Cardano is currently undergoing the hard fork from a federated model to a decentralized one.
      
    incentive
      a way to encourage participants of the system to engage in the network by rewarding them with a return that is proportional to their efforts. Incentives aim to ensure equality and fairness in a distributed network of participants by encouraging consistent, active, and strong participation. Cardano's incentives model uses game theory to calculate the incentives required.
      
    interoperability
      one of the significant features within Cardano development that aims to enable interconnection between numerous blockchains and legitimate recognition of activities by central authorities. Enabled cross-chain transfers and the establishment of the internet of blockchains will grant enhanced user experience and functionality.
      
    key pair
      a set of two keys: public verification key and private signing key. These keys are used to process and approve transactions within the blockchain.
      
    ledger
      a distributed database that is operated in a decentralized manner by multiple nodes across numerous locations.

    lovelace
      the smallest unit of ada, equivalent to one millionth of one ada. A lovelace is to ada what a satoshi is to bitcoin.
      
    mainnet
      a live blockchain that has been deployed and is in operation.
      
    Marlowe
      a domain-specific programming language (DSL) that is built on top of Plutus functionality. Marlowe can be used for financial purposes. There is a friendly Marlowe playground - an environment where non-technical users can easily execute smart contracts prewriting specific conditions.
      
    metadata
      a set of additional data stating certain transaction conditions or owner details. In smart contracts, metadata represents conditions under which a deal should execute. In a non-fungible token, metadata can store owner ID, ownership status, or intellectual rights.
      
    network
      a technical infrastructure combining Cardano-nodes and relative interactions in one unified system.
      
    non-fungible token
      a digital asset acting as an information holder. It can contain ownership rights or intellectual property rights. Non-fungible means that it cannot be divided into smaller fractions. Hence, it acts as one unit representing particular information.
      
    OBFT
      Ouroboros Byzantine Fault Tolerant protocol. See BFT.

    Ouroboros
      the consensus protocol underlying Cardano. There are several different implementations including Classic, Praos, Genesis, and more recently Hydra for scalability.
      
    P2P
      peer-to-peer. Sending transactions or sharing files directly between nodes in a decentralized system without depending on a centralized authority.

    peer discovery
      the process by which nodes find each other on the network and initiate contact.

    performance
      a measure of the efficency of a stake pool, given as a percentage, is measured by how many blocks the stake pool has produced (and that are recorded on the main chain) compared to how many it was nominated to produce. For example, if a pool only produces half the number of blocks that were nominated, its performance rating is 50%. This could happen because the pool has a poor network connection, or has been turned off by its operator. Performance ratings make more sense over a longer period of time.
      
    Plutus
      a Turing-complete programming platform for writing functional smart contracts on the Cardano blockchain. Plutus is based on the Haskell programming language.

    produced blocks
      the number of blocks that have been produced by a stake pool in the current epoch. Stake pools are rewarded in ada for each block that they produce.

    profit margin
      the percentage of total ada rewards that the stake pool operator takes before sharing the rest of the rewards between all the delegators to the pool. A lower profit margin for the operator means they are taking less, which means that delegators can expect to receive more of the rewards for their delegated stake. A private pool is a pool with a profit margin of 100%, meaning that all the rewards will go to the operator and none to the delegators.

    proof of stake
      a type of consensus mechanism used to reach agreement on records in the blockchain. It ensures distributed consensus based on the stake, or wealth, that is held by participants in the system. This stake is used as the main resource to determine the participant’s power in the system for maintaining the ledger.
      
    protocol
      a term used for consensus reaching methods. For instance, Ouroboros protocol, OBFT protocol.

    reward
      an amount contained in each new block that is paid out to the stakeholder by the network.

    rewards wallet
      a wallet that stores ada which can be used in stake delegation. The stake from a single Rewards wallet can only be delegated to a single stake pool. To delegate to more than one stake pool, you will need to create multiple Rewards wallets and distribute ada among them.

    saturation
      a term used to indicate that a particular stake pool has more stake delegated to it than is ideal for the network. Saturation is displayed as a percentage. Once a stake pool reaches 100% saturation, it will offer diminishing rewards.The saturation mechanism was designed to prevent centralization by encouraging delegators to delegate to different stake pools, and operators to set up alternative pools so that they can continue earning maximum rewards. Saturation, therefore, exists to preserve the interests of both ada holders delegating their stake and stake pool operators.

    Shelley
      second phase of Cardano development in which network decentralization will be delivered.

    slot
      a fixed period of time within an epoch. Each epoch of time is divided into numbered slots. Slots that contain transactions are called blocks.

    slot leader
      elected node that has been selected to create a block within the current slot. A random election process occurs based on the proportional stake.

    stake pool
      a reliable block-producing server node that holds the combined stake of various stakeholders in a single entity, or pool.

    testnet
      a test network where users can experiment with new features and code and provide their feedback before a live mainnet launch. A testnet can be run locally or in some cases a public is used.
      
    token
      a digital unit that represents a footprint of value defined by the community, market state, or self-governed entity. A token can act as a payment unit, reward, trading asset, or information holder.

    tps
      transactions per second.
      
    transaction
      an instance that represents the process of sending or receiving funds in the system.
      
    treasury
      a virtual pot where 5% of all earned rewards go every epoch. During the Voltaire era, treasury reserves will be used for further development, system improvements, and to ensure the long-term sustainability of Cardano.
      
    tx
      see transaction.

    UTXO
      unspent transaction output.

    Voltaire
      fifth phase of Cardano development in which treasury and governance capabilities will be delivered.
      
    Yoroi
      a light wallet for Cardano that is used to manage ada balances and conduct transactions. A simple, fast, and secure wallet for daily use purposes that is developed by Emurgo.
