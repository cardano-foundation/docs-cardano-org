## Cardano DB Sync Best Practices

This section outlines some best practices for using the Cardano DB Sync component.

### Purpose of Cardano DB Sync

The cardano-db-sync component is designed to work with a locally running Cardano node. The purpose of Cardano DB Sync is to follow the Cardano chain and fetch information from the chain and an internally-maintained copy of ledger state. Data is then extracted from the chain and inserted into a PostgreSQL database. SQL queries can then be written directly against the database schema or as queries embedded in any language with libraries for interacting with an SQL database. 

Here are some examples of what you can do with a Cardano DB Sync instance on a specific network:

+ Look up details of any block, transaction, address, or stake pool on that network, usually by the hash that identifies that item or the index into another table.
+ Get the balance of any stake address for a specific epoch.
+ Check the amount of ada that is delegated to each stake pool for a specific epoch.

For details of sample queries, see [Sample Cardano DB Sync queries](https://docs.cardano.org/en/latest/explore-cardano/cardano-architecture-overview/working-with-db-sync.html#useful-queries).

**Recommended Hardware for Cardano DB Sync**

We recommend the following hardware for cardano-db-sync (with both db-sync and the node running on the same machine):

+ A Linux distribution (for example: Debian, Ubuntu, RHEL, CentOS, Arch)
+ 8 Gigabytes of RAM
+ 2 CPU cores
+ 50 Gigabytes or more of disk storage

The recommended configuration is to have the db-sync and the PostgreSQL server on the same machine. During syncing (where historical data is retrieved from the blockchain) there is a huge amount of data traffic between db-sync and the database. Traffic to a local database is significantly faster than traffic to a database on the local area network (LAN) or remotely to another location.

To run cardano-db-sync, you first need to have a locally-running cardano-node. For more information, see the [building and running instructions](https://docs.cardano.org/projects/cardano-db-sync/en/latest/getting-started/building-running.html).

**Sample Cardano DB Sync queries**

We have compiled a list of sample SQL queries that can be run against the db-sync database.

These queries are run using the psql executable that is distributed with PostgreSQL. You can connect to the database from the cardano-db-sync git checkout using:

```
PGPASSFILE=config/pgpass-mainnet psql cexplorer
```
 
Some of these queries have Haskell and Esqueleto equivalents in the file Query.hs and where they exist, the names of those queries are included in parentheses.

You can find the sample queries in [Working with Cardano DB Sync section](https://docs.cardano.org/en/latest/explore-cardano/cardano-architecture-overview/working-with-db-sync.html#useful-queries). 


