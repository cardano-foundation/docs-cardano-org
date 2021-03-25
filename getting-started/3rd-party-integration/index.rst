Integrating with third parties
==========================================

**Note:** Exchanges that are currently listing, or interesting in listing ada, must support a Shelley-supported version of Cardano.


**Warning:** Old components like **cardano-sl:node**, **cardano-sl:explorer**, or **cardano-sl:wallet** are no longer supported.

Only the following components are Shelley compliant and support both the Byron
and Shelley eras:

-  `cardano-node`_ - the latest cardano-node, which supports Ouroboros
   Praos.

-  `cardano-db-sync`_ - a necessary middleware to power both
   cardano-rest and cardano-graphql. This middleware stores blockchain
   data fetched from cardano-node in an intermediate database to enable
   higher-level interfaces for blockchain exploration.

-  `cardano-wallet`_ - this API is recommended for 3rd party wallets and
   exchanges who do not want to manage UTxOs for transactions
   themselves. Use it to send and receive payments from hierarchical
   deterministic wallets on the Cardano blockchain via HTTP REST or a
   command-line interface.

-  `cardano-rest`_ - is made of two HTTP APIs that are used to retrieve
   transactions, addresses, and time periods (epochs and slots) from the
   cardano-db-sync component and submit an already serialized
   transaction to the network using cardano-explorer-api &
   cardano-submit-api respectively. The cardano-submit-api uses the same
   API as the cardano-sl:explorer to ease migration from already
   integrated clients. New integration should, however, look into
   cardano-graphql.

-  `cardano-graphql`_ - the HTTP GraphQL API for Cardano. A more flexible
   alternative for blockchain exploration than cardano-rest.

-  `Adrestia libraries`_ - is recommended for larger exchanges who wish to
   construct their own wallet scheme and manage UTXOs themselves. This
   consists of the following:

      -  `cardano-coin-selection`_
      -  `cardano-addresses`_
      -  `cardano-transactions`_
      -  `cardano-serialization-lib`_
      -  `bech32`_

The only currently available language target is Haskell, although
support for JavaScript is being worked on and should be available soon.

**Warning:**  Adrestia’s components and their respective repositories are also listed on `Github`_.

.. _cardano-node: https://github.com/input-output-hk/cardano-node
.. _cardano-db-sync: https://github.com/input-output-hk/cardano-db-sync
.. _cardano-wallet: https://github.com/input-output-hk/cardano-wallet
.. _cardano-rest: https://github.com/input-output-hk/cardano-rest
.. _cardano-graphql: https://github.com/input-output-hk/cardano-graphql
.. _Adrestia libraries: https://github.com/input-output-hk/adrestia
.. _cardano-coin-selection: https://github.com/input-output-hk/cardano-coin-selection
.. _cardano-addresses: https://github.com/input-output-hk/cardano-addresses
.. _cardano-transactions: https://github.com/input-output-hk/cardano-transactions
.. _cardano-serialization-lib: https://github.com/Emurgo/cardano-serialization-lib
.. _bech32: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
.. _Github: https://github.com/input-output-hk/adrestia/
