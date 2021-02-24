## Cardano DB Sync Best Practices

This section outlines some best practices for using the Cardano DB Sync component.
Purpose of Cardano DB Sync
The cardano-db-sync component is designed to work with a locally running Cardano node. The purpose of Cardano DB Sync is to follow the Cardano chain and fetch information from the chain and an internally-maintained copy of ledger state. Data is then extracted from the chain and inserted into a PostgreSQL database. SQL queries can then be written directly against the database schema or as queries embedded in any language with libraries for interacting with an SQL database. 

Here are some examples of what you can do with a Cardano DB Sync instance on a specific network:
Look up details of any block, transaction, address, or stake pool on that network, usually by the hash that identifies that item or the index into another table.
Get the balance of any stake address for a specific epoch.
Check the amount of ada that is delegated to each stake pool for a specific epoch.
For details of sample queries, see Sample Cardano DB Sync queries.
Recommended Hardware for Cardano DB Sync
We recommend the following hardware for cardano-db-sync (with both db-sync and the node running on the same machine):

A Linux distribution (for example: Debian, Ubuntu, RHEL, CentOS, Arch)
8 Gigabytes of RAM
2 CPU cores
50 Gigabytes or more of disk storage

The recommended configuration is to have the db-sync and the PostgreSQL server on the same machine. During syncing (where historical data is retrieved from the blockchain) there is a huge amount of data traffic between db-sync and the database. Traffic to a local database is significantly faster than traffic to a database on the local area network (LAN) or remotely to another location.

To run cardano-db-sync,  you first need to have a locally-running cardano-node. For more information, see the building and running instructions.
Sample Cardano DB Sync queries
We have compiled a list of sample SQL queries that can be run against the db-sync database.

These queries are run using the psql executable that is distributed with PostgreSQL. You can connect to the database from the cardano-db-sync git checkout using:
PGPASSFILE=config/pgpass-mainnet psql cexplorer
 
Some of these queries have Haskell and Esqueleto equivalents in the file Query.hs and where they exist, the names of those queries are included in parentheses.
The sample queries include:
Chain metadata (queryMeta)
Current total of on-chain supply of ada (queryTotalSupply)
Slot number of the most recent block (queryLatestSlotNo)
Size of the cexplorer database
Current valid pools
Transaction fee for specified transaction hash
Transaction outputs for specified transaction hash
Transaction inputs for specified transaction hash
Transaction withdrawals for specified transaction hash
Get the stake distribution for each pool for a given epoch
Get the delegation history for a specified stake address
Get the reward history for a specified stake address
Get the block number of blocks created in an epoch by a specified pool
Get the block number of blocks created by a specific pool for each epoch
Get the tx-id, tx_block_id, tx_out_address of a voting registration
Get the amount delegated by epoch for a specified address
Get the total orphaned rewards
Get all reward account deposits
