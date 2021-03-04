# How to Submit Mapping or Entry to Cardano Registry
Before explaining the main steps to submit a mapping or an entry to the Cardano Registry, you need to understand the main concepts.

## Main Concepts

The main concepts of Cardano token registry are asset and mapping.

### Native Asset Identification

An asset is uniquely identified by an asset ID. The asset ID is a pair of the following:
* Policy ID
* Asset name.

The PolicyID is a unique identifier, a sequence of letters and numbers, that is associated with a minting policy. It is computed by applying a hash function to the policy itself (either a monetary script or a Plutus script).

The AssetName is an immutable property to distinguish different assets within the same policy. It describes the token in a human-readable name up to 32 bytes.

> **_NOTE:_** different policies can use the same asset names for different tokens. Tokens that have the same asset ID have the property of being fungible with each other, and are not fungible with tokens that have a different asset ID.

### Mapping Definition

A mapping is a registry entry or a record. It associates  an identifier with a set of  human-readable attributes. As a user, you generate a mapping file, containing the mapping itself and the relevant cryptographic setup to validate the submission, and submit it to the registry.

## Steps for Submitting a Mapping File

This guide will take you through 3 main steps:
1. Getting all important keys related to your token,
2. Submitting JSON mapping file,
3. Creating a pull request.

### Get all Necessary Keys

The main idea of this step is to create policy key, policy script, generate policyid, choose asset name and convert to hex.

> **_NOTE:_** this article assumes that you already have created a token with associated policy script, policyID, singing key, etc. If you need to create a token, please follow the steps of [Minting A New Native Asset](https://developers.cardano.org/en/development-environments/native-tokens/working-with-multi-asset-tokens/) example.

### Prepare JSON Mapping File for Submission

In this step, you need to use the [cardano-metadata-submitter](https://github.com/input-output-hk/cardano-metadata-submitter) tool to prepare json mapping files for submission.  For this guide, we will consider the following native asset:
```
baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f.myassetname
```

#### Obtain Your Metadata Subject

```
$ echo -n "myassetname" | od -A n -t x1 | sed 's/ *//g'
6d7961737365746e616d65
Create Draft JSON File
cardano-metadata-submitter --init baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65
```

#### Add required fields

```
cardano-metadata-submitter baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 \
--name "My Gaming Token" \
--description "A currency for the Metaverse." \
--policy policy.json
```

#### Sign Metadata File

Sign your metadata file with the keys that you used to define the asset policy, this step will validate the original monetary script and generate the JSON file (not the draft anymore):
```
cardano-metadata-submitter baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 -a policy.skey
```

#### Finalize your Submission

```
cardano-metadata-submitter baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 --finalize
```
### Pull Request and Validation Process

The last step is to submit the metadata via sending a PR to the master repository but before that you need to add the metadata file (json), which you got in the previous step above, in a different branch within  the registry folder. It’s very important to wait for the validation process to finish, after your PR, before merging.

In general, you will submit the mapping file via Pull Requests to the [Mainnet](https://github.com/cardano-foundation/cardano-token-registry) or [Testnet](https://github.com/input-output-hk/metadata-registry-testnet) Github repository. Check [Wiki](https://github.com/cardano-foundation/goguen-metadata-registry/wiki) documentation for more information.


> **_NOTE:_** the validation process requires that all registry entries are well-formed and cryptographically linked to token creation (it validates that a registry entry is signed by the same keys used for generating the policyID). The merged changes can take up to 4 hours to have an effect on the metadata server.**

#### Clone and Fork

```
$ git clone git@github.com:cardano-foundation/cardano-token-registry.git
$ cd cardano-token-registry
$ git remote add submission git@github.com:<your-github-username>/cardano-token-registry
```

#### Add Metadata Entry to 'registry' Folder

```
$ cp /path-to-your-file/baa83...d65.json registry/
```

#### Create a Commit

```
$ git add registry/baa83...d65.json
$ git commit -m "Your Token Name"
$ git push submission HEAD
```
