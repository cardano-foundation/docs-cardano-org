Cardano Glossary
################

.. list-table:: Cardano Glossary
   :widths: 15 85
   :header-rows: 1

   * - Term
     - Definition
   * - ada
     - digital currency of the Cardano blockchain. Units of which are measured in lovelaces.
   * - Adrestia
     - name of the Haskell wallet backend.
   * - balance wallet
     - a wallet that stores your initial testnet ada balance, copied from the mainnet via the balance snapshot. The stake from this wallet cannot be delegated but can be transferred to and delegated from a Rewards wallet.
   * - Basho
     - fourth phase of Cardano development in which performance improvements will be integrated.
   * - block
     - a slot that contains a set of recent transactions on the network. Each block also contains data required to manage the blockchain such as an encrypted version of the previous block. As each block is completed, a new block is created to extend the chain.
   * - Byron
     - first 'boot strap' phase of Cardano development.
   * - consensus
     - the process by which a majority opinion is reached by everyone who is involved in running the blockchain. Agreement must be made on which blocks to produce, which chain to adopt, and to determine the single state of the network.
   * - controlled stake
     - the total amount of stake that a stake pool controls. It combines the stake that is owned by the pool operator with any stake that has been delegated to the pool by other ada holders. It can be measured as a total ada amount (e.g. 3M ada), or as a percentage of the total supply of ada within the network (e.g. 5%).
   * - cost per epoch
     - a fixed fee, in ada, which the stake pool operator takes every epoch from the pool rewards to cover the costs of running a stake pool. The cost per epoch is subtracted from the total ada that is rewarded to a pool, before the operator takes their profit margin. Whatever remains is shared equally among the delegators.
   * - DApp
     - decentralized application.
   * - delegation
     - the process by which ada owners can participate in the network and earn rewards by delegating the stake associated with their ada holdings to a stake pool.
   * - epoch
     - a defined group of slots that constitute a period of time.
   * - faucet
     - a web-based service that provides free tokens to users of a testnet.
   * - Goguen
     - third phase of Cardano development in which smart contracts will be delivered.
   * - lovelace
     - subunits of ada. One ada = 1,000,000 lovelaces.
   * - Ouroboros
     - the consensus protocol underlying Cardano. There are several different implementations including Classic, Praos, Genesis, and more recently Hydra for scalability.
   * - peer discovery
     - the process by which nodes find each other on the network and initiate contact.
   * - performance
     - a measure of the efficency of a stake pool, given as a percentage, is measured by how many blocks the stake pool has produced (and that are recorded on the main chain) compared to how many it was nominated to produce. For example, if a pool only produces half the number of blocks that were nominated, its performance rating is 50%. This could happen because the pool has a poor network connection, or has been turned off by its operator. Performance ratings make more sense over a longer period of time.
   * - produced blocks
     - the number of blocks that have been produced by a stake pool in the current epoch. Stake pools are rewarded in ada for each block that they produce.
   * - profit margin
     - the percentage of total ada rewards that the stake pool operator takes before sharing the rest of the rewards between all the delegators to the pool. A lower profit margin for the operator means they are taking less, which means that delegators can expect to receive more of the rewards for their delegated stake. A private pool is a pool with a profit margin of 100%, meaning that all the rewards will go to the operator and none to the delegators.
   * - proof of stake
     - a type of consensus mechanism used to reach agreement on records in the blockchain. It ensures distributed consensus based on the stake, or wealth, that is held by participants in the system. This stake is used as the main resource to determine the participant’s power in the system for maintaining the ledger.
   * - reward
     - an amount contained in each new block that is paid out to the stakeholder by the network.
   * - rewards wallet
     - a wallet that stores ada which can be used in stake delegation. The stake from a single Rewards wallet can only be delegated to a single stake pool. To delegate to more than one stake pool, you will need to create multiple Rewards wallets and distribute ada among them.
   * - saturation
     - a term used to indicate that a particular stake pool has more stake delegated to it than is ideal for the network. Saturation is displayed as a percentage. Once a stake pool reaches 100% saturation, it will offer diminishing rewards.The saturation mechanism was designed to prevent centralization by encouraging delegators to delegate to different stake pools, and operators to set up alternative pools so that they can continue earning maximum rewards. Saturation, therefore, exists to preserve the interests of both ada holders delegating their stake and stake pool operators.
   * - Shelley
     - second phase of Cardano development in which network decentralization will be delivered.
   * - slot
     - a fixed period of time within an epoch. Each epoch of time is divided into numbered slots. Slots that contain transactions are called blocks.
   * - slot leader
     - elected node that has been selected to create a block within the current slot. A random election process occurs based on the proportional stake.
   * - stake pool
     - a reliable block-producing server node that holds the combined stake of various stakeholders in a single entity, or pool.
   * - testnet
     - a test network where users can experiment with new features and code and provide their feedback before a live mainnet launch. A testnet can be run locally or in some cases a public is used.
   * - tps
     - transactions per second.
   * - UTXO
     - unspent transaction output.
   * - Voltaire
     - fifth phase of Cardano development in which treasury and governance capabilities will be delivered.
