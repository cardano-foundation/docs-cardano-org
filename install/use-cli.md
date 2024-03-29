# Using the command line interface #
The `cardano-cli` command line interface (CLI) is installed as part of the node installation process. This CLI provides a collection of tools for generating keys, constructing transactions, creating certificates, and other important tasks.

It is organized in a hierarchy of subcommands, and each level comes with its own built-in documentation of command syntax and options. For more details, read the [CLI command reference](https://github.com/input-output-hk/cardano-node/blob/master/doc/reference/cardano-node-cli-reference.md/). 

To access the top level help, type the following command (without arguments):

`cardano-cli`

All the available sub-subcommands are displayed, one of which is `node`. To continue drilling down the hierarchy, type the following command:

`cardano-cli node`

To learn about the sub-sub-subcommand `key-gen`, type the following command:

`cardano-cli node key-gen`

The parameters that this command takes are displayed. To generate a key-pair of offline keys and a file for the issue counter, type the following command:
```
   cardano-cli node key-gen \
        --cold-verification-key-file cold.vkey \
        --cold-signing-key-file cold.skey \
        --operational-certificate-issue-counter-file cold.counter
```
