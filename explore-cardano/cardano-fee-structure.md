## Cardano transaction fee structure

Cardano uses a transaction fee system that covers the processing and long term storage cost of transactions.

The Cardano environment is unique in the way it handles fees, as fees do not go directly to the block producer. Instead, they are pooled and then distributed to all pools that created blocks during an epoch.

There currently are no fees for the memory cost of tracking the accumulated chain state, in particular UTxO.

### Preventing economic attacks

The Shelley hard fork event meant that the Cardano blockchain moved from federated to a fully decentralized environment, which might increase the incentive for malicious actors to perpetrate economic attacks.

An economic attack might occur where the costs incurred by the operators of a system are not covered by fees on the users of a given system. These situations allow users to impose costs on operators without paying the full cost themselves, which could potentially lead to a severe drop in operator participation, and might ultimately lead to the collapse of the system itself.

To prevent this situation from arising, it is crucially important to address both the existing unaccounted operator costs and the new costs.

Cardano's fee structure is quite simple.

Fees are constructed around two constants (a and b). The formula for calculating minimal fees for a transaction (tx) is  a * size(tx) + b, where:

-   a/b are protocol parameters
-   size(tx) is the transaction size in bytes

### Protocol parameters (a and b)

Protocol parameters are values that can be altered by Cardano's update system to react and adapt to changes in transaction volume, hardware prices, and ada valuation. Changing these parameters constitutes a hard fork, since it influences which transactions are accepted by the system.

**Protocol parameter a**

Parameter a reflects the dependence of the transaction cost on the size of the transaction. The larger the transaction, the more resources are needed to store and process it.

**Protocol parameter b**

The value of b is a payable fee, regardless of the size of the transaction. This parameter was primarily introduced to prevent Distributed-Denial-of-Service (DDoS) attacks. b makes such attacks prohibitively expensive, and eliminates the possibility of an attacker generating millions of small transactions to flood and crash the system. 
