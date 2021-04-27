## Cardano Token Registry for On-chain Identifiers

### A Registry for the Goguen Era

The Goguen era of Cardano focuses on functionality to support smart contracts and custom token issuance, which will turn Cardano into a more interoperable and scalable platform to satisfy business needs. It will also further provide Cardano users with the power of decentralized governance and decision-making.

The [Cardano Token Registry](https://github.com/input-output-hk/offchain-metadata-tools) exposes the functionality of a key-value store and enables querying by users and applications of metadata associated with on-chain identifiers from a database through a RESTful API.

Examples of applications that may use the server:
* Wallets
* DApps

### What Problem does the Cardano Token Registry Address?

The introduction of the Cardano Token Registry for the Goguen era addresses one fundamental problem—Mapping opaque on-chain identifiers (typically hashes representing asset IDs, output locking scripts, token forging policies, or public key hashes) to metadata suitable for human consumption registered off-chain.

#### An Off-chain Registry

There are a number of reasons why we don’t want to store all metadata on-chain:

* The trust model for metadata is different to the one used by the ledger and transactions. The only trust we have (and can expect to have) in the metadata is that it is signed by a particular key, regardless of the purpose or nature of the data. For instance, when posting a script, there is no explicit association between the script and the signing key other than the owner of the key choosing to post it.
* The metadata is precisely that: metadata. While it is about some identifier on the chain, it does not directly affect ledger state transitions, and therefore we should not require it to be associated with a specific transaction.
* Higher cost to users for modifications and storage
* Increases in the UTXO size
* Difficulty in querying the data
* Size limits on transaction metadata

### Defining metadata in the Goguen era

Blockchain data is usually represented in forms that are not very human- or user-friendly. Long strings of hashes or other types of obscure identifiers often pose a challenge for the human user who's used to clearer and more logical methods of interpreting and understanding data.

The blockchain may contain personal information in the form of metadata, which is often hashed for security and privacy purposes. This hashed metadata is, by design, unintelligible and unreadable, so a method is required to map the information contained in on-chain identifiers -such as hashes- to some associated metadata suitable for human understanding.

Much of the information that we want to store is not determined by the chain, so we propose a system that is independent from the blockchain and can benefit the usability of applications in the Cardano ecosystem.

For example:

* The identification of a hash's preimage (the script corresponding to an output locked by a script hash, or the public key corresponding to a public key hash).
* Inclusion of human- and user-friendly metadata, like the name and ticker of a native token or the creator’s website address.
* The integration of metadata into the UI of established applications.
* A solid security model for the metadata.

### Metadata mappings: potential use cases

Within the Goguen era, a metadata distribution system could be applied to several use cases:

* Script hashes and native token Identifiers
* Datum hashes
* Public key hashes
* Stable addresses for oracle data
* Distributed exchange address listing
* Stake pool metadata

#### Script hashes and native token identifiers

In the Goguen era of Cardano, script hashes will be used for locking outputs and forging policy identifiers. In both cases, users will likely want to know the script that goes with the hash. This information might be contained on-chain, but in most instances, the chain will only display the hash until the time the script runs (when spending a script-locked output, for example.)

Some of our applications might also require the provision of other metadata:

* 'Higher level' forms of the code (such as the Plutus IR)
* Creator information (contact details, etc.)
* Human-readable names

The latter would be particularly useful in the multi-asset support environment, as token holders will need to see easy-to-understand names for their tokens, rather than hash strings.

#### Datum hashes

In the Extended UTXO [EUTXO](https://iohk.io/en/blog/posts/2021/03/11/cardanos-extended-utxo-accounting-model/) model, datums are provided by hash, and the spending party must provide the full value, which is inconvenient since the spending party needs to find out what the datum is. A quick enough metadata registry for entries might provide a convenient off-chain channel for datum communication.

#### Public key hashes

A perennial problem faced by communication via public keys is that people want to see names, rather than public keys, so an 'address book' is required. A metadata registry would act as a decentralized address book for wallets, containing user contact details such as key servers for PGP keys.

#### Distributed exchange address listing

Users offering tokens for sale and exchange can lock them in contracts that specify "you can spend this UTXO if you send x amount of tokens to y address". In this context, an output constitutes an "offer", which can be considered as metadata about the output, and could be managed by a metadata server.

#### Stake pool metadata

Currently, stake pool metadata is handled by [a metadata aggregation server (SMASH)](https://docs.cardano.org/en/latest/explore-cardano/cardano-architecture-overview/smash-handbook.html) because:

* The stake pool metadata system does have to monitor the chain, since the metadata is fetched from URLs posted to the chain.
* The stake pool metadata system is “pull-based”: it must monitor a large number of stake pool metadata URLs for updates.
* The implementation cost for a metadata server is not extremely high, as it mostly consists of a database with a small HTTP API.
* The stakepool metadata has different restrictions on content. For instance, the size limit of stake pool metadata is much smaller than what we would reasonably limit a script size by.
* Types of metadata in Cardano.

#### Who should register metadata?

Registration of metadata mappings is optional and is independent of any on-chain activities.
Users may choose to register metadata mappings with a server so that applications using the server can query and display additional human readable data relevant to the on-chain identifier.

## Step-By-Step Guide (Linux / Mac OS)

### How to Submit Metadata Mappings to the Cardano Token Registry

This article outlines the steps required to create a metadata mapping for a native token, and submit it to the Cardano Token Registry. The Cardano Token Registry currently supports mappings for Native Tokens only.

> This article assumes you have already created a native token with associated policy script, **PolicyID**, private key that you used to sign, etc. If you need to create a native token, please follow the steps of [Minting A New Native Asset](https://docs.cardano.org/en/latest/native-tokens/getting-started-with-native-tokens.html#example-minting-a-new-native-token) example.

### Mapping Definition

A mapping is the association of  a unique on-chain identifier with a set of  human-readable attributes. As a user, you generate a mapping file (JSON format), containing the mapping itself and the relevant cryptographic setup validating that you are the person who minted that token. That file can then be sent out to the registry for review and inclusion.

### Native Asset Identification

An asset is uniquely identified by an **assetID**, which is a pair of both the **PolicyID** and the asset name.

The **PolicyID** is the **unique identifier** associated with a minting policy, which determines whether a transaction is allowed to mint or burn a particular token.

The **PolicyID** is computed by applying a hash function to the policy itself (the monetary script). A **PolicyID** can have multiple asset names, so different policies can use the same asset names for different assets. Assets with the same **assetID** are fungible with each other, and are not fungible with assets that have a different **assetID**.

The **AssetName** is an immutable property to distinguish different assets within the same policy.

Adding to the Registry

1. Create your native token
2. Prepare JSON mapping file for submission
3. Creating the Pull Request (PR)

#### Creating your Native Token

Native tokens is an accounting system defined as part of the cryptocurrency ledger that enables tokens to be tracked, sent, and received within the Cardano blockchain. After the steps in [Minting A New Native Asset](https://docs.cardano.org/en/latest/native-tokens/getting-started-with-native-tokens.html#example-minting-a-new-native-token), you will have the policy script, associated private key/s, **PolicyID** and **AssetName**, which are requirements for preparing your JSON mapping file.


#### Prepare JSON Mapping File for Submission

Use the [offchain-metadata-tools](https://github.com/input-output-hk/offchain-metadata-tools) tool to prepare a JSON mapping file for submission. This can be done manually if you are able to compile the cryptographic primitives yourself, but it is recommended that you use the [offchain-metadata-tools](https://github.com/input-output-hk/offchain-metadata-tools).

By creating a mapping file, you effectively create a record that maps human-readable content to the unique token identifier of the tokens you have minted, such as:

* **Name -** Required - What is your token name? Non unique / Doesn’t have to be the same as the **AssetName**.
* **Description -** Required - A short explanation about your token,
* **Ticker -** Optional - Non unique, limit 4 characters,
* **URL -** Optional - Site to be associated with that token,
* **Logo -** Optional  - Associated logo to be picked up by the wallets displaying your token.

##### Example for Creating a Mapping File

We consider the following native asset:
```
Baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f.myassetname
```

To create a new entry, you must first obtain your metadata subject. The subject is defined as the concatenation of the base16-encoded **PolicyID** and base16-encoded **AssetName** of your asset.

##### 1) Encode your **assetName** with base16:
```
echo -n "myassetname" | xxd -ps
6d7961737365746e616d65
```

##### 2) Concatenate the **PolicyID** with the base16-encoded **assetName** to obtain the 'subject' for your entry:
```
baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65
```

##### 3) Initiate a draft file using the ‘subject’ value:
```
token-metadata-creator entry --init baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65
```

##### 4) Add the required fields:
```
token-metadata-creator entry baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 \
--name "My Gaming Token" \
--description "A currency for the Metaverse." \
--policy policy.json
```

If desired, add optional fields:
```
token-metadata-creator entry baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 \
  --ticker "TKN" \
  --url "https://finalfantasy.fandom.com/wiki/Gil" \
  --logo "icon.png"
```

##### 5) Sign the file

This is important as the signature will be used and compared with the signature from the asset policy forging script. This step validates the original monetary script and generates signatures for each mapping in the JSON file:
```
token-metadata-creator entry baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 -a policy.skey
```

##### 6) Finalize your Submission
```
token-metadata-creator entry baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 --finalize
```

You’re now ready to submit your mapping file to the [Cardano Token Registry](https://github.com/cardano-foundation/cardano-token-registry).

#### Pull Request and Validation Process

The final step is to submit the mapping to the registry. This is done by submitting a Pull Request to the Cardano Foundation’s [Token Registry repository](https://github.com/cardano-foundation/cardano-token-registry).

Please see below for general steps, check the [Wiki](https://github.com/cardano-foundation/cardano-token-registry/wiki) or FAQs or more information.

##### Fork and clone the repo

[Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) your own copy of [cardano-foundation/cardano-token-registry](https://github.com/cardano-foundation/cardano-token-registry) to your account.

Then clone a local copy:
```
$ git clone git@github.com:<your-github-username>/cardano-token-registry
$ cd cardano-token-registry
```

##### Add the mapping to /mappings/ folder
```
$ cp /path-to-your-file/baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65.json mappings/
```

##### Commit to the repo
```
$ git add mappings/baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65.json
$ git commit -m "Your Token Name"
$ git push origin HEAD
```

##### Make a Pull request

Create a [pull request from your fork](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

> From here you will see your PR show up in Github - Foundation registry operators will review it for well formedness, proper content and to see how it fared with the automated tests - it might be that you are asked to modify some items, that it gets rejected - or even merged! You’ll be notified through Github/email and can add to the comments or see what is happening. The wiki should help guide you through the specific steps - do ask or raise issues in the repository if you get stuck.
