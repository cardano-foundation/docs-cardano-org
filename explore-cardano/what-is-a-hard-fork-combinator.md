## Understanding Hard Forks

The term hard fork is used to describe a radical change in the blockchain, for example, a change from one protocol to another. In most blockchains, a hard fork indicates block changes or a change to their interpretation. Traditionally, when conducting a hard fork, the current protocol would stop operating, new rules and changes would be implemented, and the chain would restart. It is important to note that a hard-forked chain *will be different* from the previous version and that the history of the pre-forked blockchain will no longer be available.

The Cardano blockchain has recently hard forked from a Byron federated model to a Shelley decentralized one. However, this hard fork was unique. Instead of implementing radical changes, we ensured a smooth transition to a new protocol while saving the history of the previous blocks. This means that the chain did not change radically, instead, it contains Byron blocks, and after a transition period, adds Shelley blocks. There was no fundamental restart point that erased the history of previous activities.

### Moving from Byron Ouroboros Classic to Shelley Ouroboros Praos

Cardano Byron mainnet ran on the Ouroboros *Classic* consensus protocol. Cardano Shelley mainnet, which is the current development era, transitions to a decentralized network running on the new Ouroboros *Praos* consensus protocol, which allows for more extended capabilities while also supporting the staking process with monetary rewards for ada holders and stake pool owners.

To enable orderly transitions in Cardano without any diversions in the system, it was necessary to update the code to support the new protocol’s conditions. Doing so in a single update might have caused a range of complexities, so Cardano decided to take a two-stage approach, using the Ouroboros *Byzantine Fault Tolerance* (BFT) protocol as an intermediary.

A shift from Ouroboros Classic to BFT (that happened on February 20, 2020)  is the only traditional hard fork within the Cardano blockchain. This forking event restarted the Byron mainnet to run the BFT protocol and enable a smoother transition to Ouroboros Praos without any further chain interruptions. The BFT protocol was carefully designed so that blockchain history would remain unchanged, and the blockchain would appear as a single entity. 

### What Is a Hard Fork Combinator?

A combinator is a technical term used to indicate the combination of certain processes or things. In the case of Cardano, a hard fork combinator combines protocols, thereby enabling the Byron-to-Shelley transition without system interruption or restart. It ensures that Byron and Shelley ledgers appear as one ledger. Shifting from BFT to Ouroboros Praos does not require all nodes to update simultaneously. Instead, nodes can update gradually, in fact, some can run Byron blocks, others - Shelley blocks.

The hard fork combinator is designed to enable the combination of several protocols, without having to make significant adjustments. The current Cardano chain combines Byron and Shelley blocks, and after future transitions, it will also combine Goguen, Basho, and Voltaire blocks - all as a single property.  This combinator facilitates the transition from Shelley to Goguen and beyond by simplifying the previous Byron-to-Shelley evolution.

