# How to Submit Mappings to the Cardano Token Registry

### Native Asset Identification

An asset is uniquely identified by an **assetID**. The **assetID** is the concatenation of the following:
* PolicyID
* AssetName.

The **PolicyID** is a unique identifier associated with a minting policy. It is computed by applying a hash function, BLAKE2S with 224-bit digest, to the policy itself (either a monetary script or a Plutus script).

The **AssetName** is an immutable property to distinguish different assets within the same policy. It describes the token in a human-readable name up to 32 bytes (50 characters).

> **_NOTE:_** different policies can use the same asset names for different tokens. Tokens that have the same asset ID have the property of being fungible with each other, and are not fungible with tokens that have a different asset ID.

### Mapping Definition

A mapping is an association of an identifier with a set of human-readable attributes. As a user, you generate a mapping file, containing the mapping itself and the relevant cryptographic setup validating that both the user submitting the mapping and the issuer of that token are the same person. That file can then be sent out to a registry for review and inclusion.

## Adding to the Registry

1. Gather associated keys related to your token
2. Generate a mapping file
3. Creating the pull request

### Get all Necessary Keys

The main idea of this step is to create policy key, policy script, generate **PolicyID**, choose **AssetName** and convert to hex.

> **_NOTE:_** This article assumes you already have created a token with associated policy script, **PolicyID**, private key which you used to sign, etc. If you need to create a token, please follow the steps of [Minting A New Native Asset](https://developers.cardano.org/en/development-environments/native-tokens/working-with-multi-asset-tokens/) example.

### Prepare JSON Mapping File for Submission

Use the [cardano-metadata-submitter](https://github.com/input-output-hk/cardano-metadata-submitter) tool to prepare a json mapping file for submission.

Creating a mapping file is effectively bundling a set of requirements as outlined by a schema that is expected where you, the user, add human-readable content to a token you’ve minted, such as

* Name - REQUIRED - What is your token name? Non unique / Doesn’t have to be the same as the **AssetName**.
* Ticker - Optional - Non unique, limit 4 characters.
* Unit - Optional -  What is the actual unit for the token if not singular.
* URL - Optional - Site to be associated with that token
* Logo - Optional  - Associated logo to be picked up by the wallets displaying your token
* Description - REQUIRED -  A bit more about your token.

This  can be done manually if you can compile the crypto primitives but is easier done via the use of a helper tool: the metadata-submitter tool. Let’s see how what this would look like through an example:

We already have the following native asset:
```
baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f.myassetname
```

1. Through a terminal, we extract the subject (to be used a key in the mapping)
```
$ echo -n "myassetname" | od -A n -t x1 | sed 's/ *//g'
6d7961737365746e616d65
```

2. From here we Initiate a draft file: it will be slowly amended with the content we add
```
cardano-metadata-submitter --init baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65
```
3. We add the required fields
```
cardano-metadata-submitter baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 \
--name "My Gaming Token" \
--description "A currency for the Metaverse." \
--policy policy.json
```
4. Sign the file!
This is important as the signature will be used and compared with the signature from the asset policy forging script. This step validates the original monetary script and generates a signed JSON file (not a draft anymore):
```
This is important as the signature will be used and compared with the signature from the asset policy forging script. This step validates the original monetary script and generates a signed JSON file (not a draft anymore):
```
5. Finalize your Submission
```
cardano-metadata-submitter baa836fef09cb35e180fce4b55ded152907af1e2c840ed5218776f2f6d7961737365746e616d65 --finalize
```


You’re now ready to submit your mapping file -  you’ve linked your token to some extra data that can be included in a registry, and signed it to confirm you’re allowed to.

### Pull Request and Validation Process

The last step is to actually submit the mapping to the registry.  This is done by  submitting a PR to the Foundation’s Registry repository.

Please see below for general steps, check the [Wiki](https://github.com/cardano-foundation/goguen-metadata-registry/wiki) for FAQs or more information.

1. Clone and Fork the repo
```
$ git clone git@github.com:cardano-foundation/cardano-token-registry.git
$ cd cardano-token-registry
$ git remote add submission git@github.com:<your-github-username>/cardano-token-registry
```

2. Add the mapping to /mapping Folder
```
$ cp /path-to-your-file/baa83...d65.json registry/
```

3. Commit to the repo
```
$ git add registry/baa83...d65.json
$ git commit -m "Your Token Name"
$ git push submission HEAD
```
> **_NOTE:_** From here you will see your PR show up in github - Foundation registry operators will review it for well formedness, proper content and to see how it fared with the automated tests - it might be that you are asked to modify some items, that it gets rejected - or even merged! You’ll be notified through Github/email and can add to the comments or see what is happening. The wiki should help guide you through the specific steps - do ask or raise issues in the repository if you get stuck: we’re here to help!
