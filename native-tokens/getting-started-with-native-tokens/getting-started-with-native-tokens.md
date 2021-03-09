---
title: How to Use Multi-Asset Tokens in the Cardano Node
description: Native tokens in Cardano
parent: native-tokens
order: 3
last_updated: "2020-12-10T12:31:00+01:00"
---

## Getting Started With Native Tokens

### Prerequisites

This section is for advanced users who are proficient with the Cardano-node [command line interface (CLI)](https://docs.cardano.org/projects/cardano-node/en/latest/reference/cardano-node-cli-reference.html).

This section describes how to:

- create new currencies and assets;
- submit and send transactions containing multi-asset tokens;
- send and receive token bundles;
- manage your addresses and values.

> Note: Users who do not need to create new assets (“token holders”) will be able to send and receive existing multi-asset tokens using a wallet such as Daedalus or Yoroi, and with no requirement to use any CLI commands.

To start, please ensure that you are familiar with setting up and operating the [Cardano node](https://github.com/input-output-hk/cardano-node). Alternatively, see instructions on how to [start your node](https://docs.cardano.org/projects/cardano-node/en/latest/stake-pool-operations/start_your_nodes.html) to submit the commands. You will not need to set up and start a full block producing node (“stake pool”), just a much simpler relay node. This node will need to connect to a Cardano network that is capable of processing native tokens (e.g., the native token pre-production environment (PPE), or the Cardano Mainnet once it has been upgraded).

### Configuring a Relay Node Using the Cardano CLI

*This document describes how to interact with the node from a bash command line, but it is also possible to download and run the node as a `docker` image, which will involve less system configuration. The docker image is `input-output/cardano-node` - please ensure you have the [latest version](https://github.com/input-output-hk/cardano-node/releases) (1.24.x).*

To configure a relay node to communicate with the pre-production environment for the Mary era, first build and install the node as described in [https://github.com/input-output-hk/cardano-node](https://github.com/input-output-hk/cardano-node), and then set up its configuration:  

```
mkdir -p mary-ppe/config
cd mary-ppe
# download and save the configuration files to the config subdirectory
```

You may then use the following command from the `mary-ppe` directory to start the relay node. Note that you **do not need** to configure and run the node as a “stake pool” (block producing node):

```
export CARDANO_NODE_SOCKET_PATH=socket
 
cardano-node run --topology config/topology.json  
--database-path db --config config/config.json --port 3001 
--socket-path "$CARDANO_NODE_SOCKET_PATH"
```

The latest configuration files can be found [here](https://hydra.iohk.io/job/Cardano/cardano-node/cardano-deployment/latest-finished/download/1/index.html). You will need to download all the files that are associated with the `launchpad` cluster and copy them to your `config` subdirectory.

Once you have started the node, leave it running in its own terminal window (or run it in the background if you prefer).

### Using the Cardano CLI

Once a relay node has been set up, the `cardano-cli` command can be used to interact with the network as usual: 

```
cd mary-ppe
cardano-cli ...
```

Note that multi-asset support is provided as part of the Mary consensus era, so many commands will require the `--mary-era` flag:

```
cardano-cli ... --mary-era
```

### Understanding Values

Lovelace values can be specified in two ways:

- `${quantity} lovelace` (where quantity is a signed integer)
- `${quantity}` (where quantity is a signed integer)

Values for other assets can be specified as:

- `${quantity} ${policyId}.${assetName}`
- `${quantity} ${policyId}` 

Where `quantity` is a signed integer and `policyId` is a hex-encoded policy ID [a script hash]), and `assetName` is an alphanumeric asset name.

#### Syntax of multi-asset values

The `cardano-cli` can specify multi-asset values in transaction outputs and when minting or burning tokens. The syntax for these values has been designed to be backwards-compatible with the previous ada-only syntax (`address+lovelace`):

- ada values are defined as integer (INT) lovelace, e.g. `42 lovelace`
- multi-asset values can be defined as:
  - `INT policyid.assetname`, e.g. `42 $MYPOLICY.myassetname`
  - `INT policyid`, e.g. `42 $MYPOLICY` (No asset name specified)
  - `policyid.assetname`, e.g `$MYPOLICY.myassetname` (This will mint only one of `myassetname`)
- Multiple assets can be combined in the same multi-asset value using the `+` operator, e.g:

`100 lovelace + 42 $MYPOLICY.foo + -2 $MYPOLICY.bar + 10 lovelace`

**Negating individual values**

Any individual value can be negated using the `-` prefix operator. For example:

- `-42 $MYPOLICY`
- `-72191 $MYPOLICY.foo`
- `-100`
- `-920 lovelace`

**Combining individual values**

Values can be combined using the binary operator `+`. For example:

- `42 lovelace + -1 (this would result in a Value of 41 lovelace)`
- `20 $MYPOLICY + 12 $MYPOLICY.foo + -2 $MYPOLICY.bar`
- `201 4$MYPOLICY.foo + 12 + -1 + 9 lovelace + 10 $MYPOLICY`



### Creating a Transaction

The native tokens syntax can be used in the following contexts:

- `cardano-cli transaction build-raw --tx-out="..."`
- `cardano-cli transaction build-raw --mint="..."`

The CLI command `cardano-cli transaction build-raw` creates the transaction body. The `--tx-out` option specifies the transaction output in the usual way *(This is expressed as address+lovelace, where address is a Bech32-encoded address, and lovelace is the amount in lovelace)*, and the `--mint` option specifies the value to be minted or burnt.

#### Transaction outputs (TxOuts)

The syntax for TxOut values has been extended to include multi-asset tokens. These values can be specified in two different ways:

- `$address $value`
- `${address}+${value}`

(where *address* is a Cardano address and *value* is a value). The second form is provided for backwards compatibility with earlier versions of the node.

To receive tokens, you just need to specify any address. It is not necessary to use special addresses to hold multi-asset tokens.


To inspect the values in an address, you need to view a UTxO value using:

```
cardano-cli shelley query utxo --mary-era
```

This will show the content of any token bundles that you possess. You can choose to see a specific address using the `--address` `$ADDRESS` option:

```
cardano-cli shelley query utxo --address "$ADDRESS" --mary-era
```
