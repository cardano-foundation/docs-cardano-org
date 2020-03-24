---
layout: default
title: HD wallets
permalink: /technical/hd-wallets/
group: technical
visible: true
language: en
---
<!-- Reviewed at 866fd6a29a15c503e54426f17b91bd8b0903c5dc -->

# HD wallets

Hierarchical Deterministic (HD) wallets allow users to derive keys from a
common seed making backup easier and allowing for new wallet features and privacy
improvements.

## How it works

Basically, you generate an initial secret key `SK₀` from a
random seed. Then you can derive child keys `SK₀-₀`, `SK₀-₁` from `SK₀`. From
these children, you can derive `SK₀-₀-₀`, `SK₀-₀-₁`, `SK₀-₁-₀` and so on
(derivations for a tree of arbitrary depth).

<!-- For subscripts and other symbols: https://help.ubuntu.com/community/ComposeKey -->

We distinguish two types of keys:

-   **Hardened**
-   **Non-hardened**

The only distinction here is that **hardened** keys allow only generation of
child secret keys from parent secret keys. Thus, to derive a child key for
a hardened key, you have to own the private key. **Non-hardened** keys allow one to
derive a child public key from a parent public key (without requiring access to the secret key).

Each child is assigned a 4-byte index `i`:

-   `i ≤ 2³¹ - 1` for **non-hardened** keys,
-   `i > 2³¹ - 1` for **hardened** keys.

## Properties:

1.  Metadata to reconstruct the tree is stored as part of the root address.

## Root Address format

We start with a `PublicKey` type [address](/cardano/addresses/) and add a new field for additional attributes.
The attribute indexed by `0` (**HD wallets attribute**) is used to store tree
data in the form of **derivation paths**. Each **derivation path** is
specified as a list of **derivation indices**. Each **derivation index** is 4-byte
unsigned int.

The resulting object is serialized and encrypted with the symmetric scheme
([ChaChaPoly1305](https://en.wikipedia.org/wiki/Salsa20#ChaCha_variant) algorithm) using the passphrase computed from the SHA-512 hash of the
root public key. This will not allow an adversary to map all child addresses on the chain to
their root as long as we do not actually store any funds on the root key (which
is not forced by consensus rules, rather by UI).

**Crucial point in wallet design:** root public keys are not used to actually store
money.

## Use cases

### Financial audit

An auditor requires only the hash of a root public key in order to view all
keys / addresses in the hierarchy.

### Payment server

_This is applicable for **non-hardened** keys only._

For a payment server to be able to derive subsequent addresses for receiving
payments, one of the following is required on the server:

-   Root public key

Or

-   Payload of:

    -   Public key `PK` of level `i`

    -   Hash of root public key

    -   Tree path for `PK`

### Wallet

For a wallet to operate over some subtree, one needs to provide either:

-   Root secret key

Or

-   Payload of:

    -   Secret key `SK` of level `i`

    -   Hash of root public key

    -   Tree path for `SK`

## Requirements

Let `A(K)` denote the address that holds information about keypair `K`. Let
`child(K, i)` denote the `i`-th child keypair of `K`. Let `tree(K)` denote the
tree of addresses for keypairs, derived from `K` (and having positive balance)
and held in **utxo**.

`a -> b` denotes `b` is derivable from `a`. `a -x b` denotes that `b` can not be derived from `a`:

    priv(K) -> pub(K)
    pub(K) -> A(K)
    pub(K) -x priv(K)
    A(K) -x pub(K)
    A(K) -x A(child(K, i))

For **hardened** keys:

    (priv(K), utxo) -> tree(K)
    pub(K) -x pub(child(K, i))
    priv(K) -> priv(child(K, i))

For **non-hardened** keys

    (pub(K), utxo) -> tree(K)
    pub(K) -> pub(child(K, i))
    priv(K) -> priv(child(K, i))

## Derivation Crypto Interface

### Notation:

-   `kp` denotes a private key with index `p`. Just an **Ed25519** private key.

-   `Kp` denotes public key with index `p`. Just an **Ed25519** public key.

-   `cp` denotes chain code with index `p`.

### Entropy

Bitcoin uses a 512-bit hash, but `kp` is only 256 bit. For this reason we need
to supply 512 bits of entropy, so we do not reduce hashing space.

-   Extended private key is a pair denoted as `(ki, ci)`.

-   Extended public key is a pair denoted as `(Ki, ci)`.

From application perspective, HD wallets (as defined in [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)) introduce following crypto primitives:

-   `CKDpriv :: ((kpar, cpar), i) → (ki, ci)`

    Computes a child extended private key from the parent extended private key.

-   `CKDpub :: ((Kpar, cpar), i) → (Ki, ci)`

    Computes a child extended public key from the parent extended public key.

# Daedalus HD wallets

This section describes how HD wallets are used. It is
split into two parts:

1.  Extension of wallet backend API to support HD wallet structure locally (as
    implemented in Bitcoin).

2.  Extension to blockchain handling to utilize new address attribute to keep HD
    structure of multiple wallet clients in sync.

## Local storage

### Old storage

The old wallet stored a simple list of addresses. Each address was associated with a name
and was derived from separate secret key (backed up by mnemonics and encrypted
with the spending password).

### New storage

Wallet storage is extended to store a list of **wallets**. Each wallet corresponds
to a single root secret key (backed up by mnemonics and encrypted with spending
password).

Each wallet contains a number of **accounts**.

Each account contains a number of **addresses** (i.e. an address is a key of the
2nd level in a HD tree).

This maps to a HD tree:

-   wallet set corresponds to key of 0-th level (*root*),

-   wallet corresponds to key of 1-th level (children of root),

-   address corresponds to key of 2-th level (grandchildren of root).

Funds are kept only on addresses.

When funds are spent from one or more addresses, a new one is generated
to receive the change (unspent coins) from the payment.

### Usability

A user is able to:

-   import/export an arbitrary number of **wallets**,

-   generate an arbitrary number of **accounts**,

-   assign names to **wallets** and **accounts**,

-   generate an arbitrary number of **addresses**,

-   change **wallet** spending password.

## Backup and restore

There are two ways of backing up a wallet:

-   **mnemonics**: 24 words which allow the wallet to later regenerate all required keypairs. Names will not be restored however.
-   Wallet backup file: will restore the whole wallet structure with names.

### Import

In both cases we have a secret root key which can be used to regenerate the wallet using the following procedure:

-   Root key is checked to be absent from local storage.

-   The **utxo set** is traversed to find all addresses with a non-zero balance
    corresponding to each derived keypair and add them to storage along with their
    parent wallets.

-   In case of file import, the structure that resulted from step 2 is additionally labeled with
    names (if they exist in the backup file).

### New transaction handling

When a new transaction becomes available (appears either in block or in the mempool),
it will be analyzed to see if it modifies outputs associated with addresses belonging to a wallet we own. If it does, the address and balance is shown in the
user interface.
