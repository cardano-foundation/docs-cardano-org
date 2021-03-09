### How to create a transaction 

The multi-asset syntax can be used in the following contexts:

- `cardano-cli transaction build-raw --tx-out="..."`
- `cardano-cli transaction build-raw --mint="..."`

The CLI command `cardano-cli transaction build-raw` creates the transaction body. The `--tx-out` option specifies the transaction output in the usual way *(This is expressed as address+lovelace, where address is a Bech32-encoded address, and lovelace is the amount in lovelace)*, and the `--mint` option specifies the value to be minted or burnt.

### Transaction outputs (TxOuts)

The syntax for TxOut values has been extended to include multi-asset tokens. These values can be specified in two different ways:

- `$address $value`
- `${address}+${value}`

(where *address* is a Cardano address and *value* is a value). The second form is provided for backwards compatibility with earlier versions of the node.

To receive tokens, you just need to specify any address. It is not necessary to use special addresses to hold multi-asset tokens.
