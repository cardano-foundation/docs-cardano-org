---
layout: default
title: Addresses
permalink: /cardano/addresses/
group: cardano
language: en
---
<!-- Reviewed at a6a1cdf72c7e167a13f500c0679c01fe4cfa0ca8 -->

# Addresses in Cardano SL

To send and receive value, addresses are used in virtually all cryptocurrencies.
Cardano SL supports 3 main types of addresses:

1.  public key address,
2.  script address,
3.  redeem address.

Public key address is a normal address like in any other cryptocurrency. It is
a hashed public key. Read more about public key addresses [below](#public-key-addresses).

Script address is used in so-called "Pay to Script Hash" (P2SH) transactions.
It operates autonomously and acts somewhat like a bank deposit: you can send
money to it, but in order to redeem it you have to satisfy certain conditions,
determined by a script associated with the address. The address itself contains
the hash of the serialized script. Read more about P2SH [below](#pay-to-script-hash).

Redeem address is a special type of address for ADA redemption. Read more about redeem
addresses [below](#redeem-addresses).

Moreover, Cardano SL support `Unknown` address type as well. This type will allow us to use
custom types of addresses in the future.

## What Does an Address Look Like?

Addresses are `base58`-encoded bytestrings, for example:

```
Ae2tdPwUPEZKmwoy3AU3cXb5Chnasj6mvVNxV1H11997q3VW5ihbSfQwGpm
```

### Encoding

`base58` encoding is the same one as used in Bitcoin. It uses a 58-symbol alphabet
to encode data, hence the name. Here is the alphabet we are using:

```
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
```

It avoids both non-alphanumeric characters and letters which might look
ambiguous when printed (`0`, `O`, `I`, `l`); therefore it is suitable for human
users who enter the data manually, copying it from some visual source, and also
allows easy copy and paste by double-clicking which usually selects the whole
string.

## Public Key Addresses

As mentioned in the [Introduction](/introduction/#you-own-your-money), the wallets
you can see in the user interface are a convenient representation of the fact that
you own a secret key to spend money in this particular wallet. But how is such
spending verified by the network and how can you receive money from others? The
answer is that along with the secret key which is used to control the value in
your wallets, a public key is generated. This public component can be known by
anybody, hence the name.

A public key address contains the hash of this public key.

Public keys are also used for verifying your identity when you create a
transaction and other auxiliary purposes.

## Pay to Script Hash

The idea of Pay to Script Hash (P2SH) is to provide a lot of flexibility for
formulating complex rules for spending money. Instead of sending a transaction
to a public key address, we create a validator script that can take a so-called
redemption script as a parameter. To redeem funds, we pass the redemption script
to the validator and evaluate it. If it evaluates to `success`, money is sent as
specified by the redeemer. Otherwise nothing happens.

To quote Bitcoin Wiki,

> Using P2SH, you can send bitcoins to an address that is secured in various
> unusual ways without knowing anything about the details of how the security is
> set up. The recipient might need the signatures of several people to spend
> these bitcoins, or a password might be required, or the requirements could be
> completely unique.

## Redeem Addresses

Redeem addresses are Pay To PubKey Hash (P2PKH). Such an address contains the hash
of redeem public key, and this key is actually [Ed25519](http://ed25519.cr.yp.to/)
public key.

## Other Address Types

In the future, we may use the update system to introduce other address types. Please
[see more](/cardano/update-mechanism/#soft-fork-updates) on extending the system in
non-breaking fashion.

## Address Structure

Address consists of 3 parts:

*  address root,
*  address attributes,
*  address type.

We can imagine an address as a JSON-like structure, for example:

```
Address {
    addrRoot = AbstractHash e63175c654dfd93a9290342a067158dc0f57a1108ddbd8cace3839bd,
    addrAttributes = Attributes {
        data: AddrAttributes {
            aaPkDerivationPath = Nothing,
            aaStakeDistribution = BootstrapEraDistr
        } 
    },
    addrType = ATPubKey
}
```

`addrRoot` is the BLAKE2b-224 hash of the tuple made from `addrType`, `addrSpendingData` and `addrAttributes`.

`addrSpendingData` is a special value which is bound to an address and must be revealed in order to spend coins belonging to
this address. For example, for public key address this value contains the public key. In this case, it is impossible to change
address attributes without knowing of the public key because if the attributes have been changed the whole address becomes
invalid.

`addrAttributes` include important attributes of each address: derivation path and stake distribution.

For more info about derivation path please read [HD Wallets in Cardano SL](https://cardanodocs.com/technical/hd-wallets/) chapter.

For more info about stake distribution please read [Transactions in Cardano SL](https://cardanodocs.com/cardano/transactions/#stake-distribution)
chapter.

Value of `addrType` corresponds to address type as was mentioned above, in this example it is a public key address.

### Length

Addresses may have different lengths depending on address type and additional data in it.

For example, this address

```
Ae2tdPwUPEZKmwoy3AU3cXb5Chnasj6mvVNxV1H11997q3VW5ihbSfQwGpm
```

and this one

```
4swhHtxKapQbj3TZEipgtp7NQzcRWDYqCxXYoPQWjGyHmhxS1w1TjUEszCQT1sQucGwmPQMYdv1FYs3d51KgoubviPBf
```

are both public key addresses.
