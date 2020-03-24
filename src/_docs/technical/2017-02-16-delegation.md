---
layout: default
title: Stake Delegation in Cardano SL
permalink: /technical/delegation/
group: technical
visible: true
language: en
---
<!-- Reviewed at c23493d7a33a82d559d5bd9d289486795cf6592f -->

# Stake Delegation in Cardano SL

This chapter describes implementation details of the stake delegation process.

As described earlier, stakeholders selected as slot leaders must be online in
order to generate new blocks. However, such a situation can be unattractive,
because a majority of elected stakeholders must participate in the Coin Tossing
protocol for refreshing randomness (crucial attribute of the slot leader
election process). If there are a lot of elected stakeholders, this can put a
strain on the stakeholders and the network, since it might require broadcasting
and storing a large number of commitments and shares.

Delegation feature allows stakeholders called _issuers_ `I1...In` to transfer their
"committee participation" to some _delegates_ `D1...Dm`. These delegates will represent
stakeholders `S1...Sn` in the [Coin Tossing protocol](https://github.com/input-output-hk/cardano-sl/blob/4bd49d6b852e778c52c60a384a47681acec02d22/src/Pos/Ssc/GodTossing.hs). In this case the actual
number of nodes participating in the Coin Tossing protocol can be much lower,
see [paper](/glossary/#paper), page 38.

Moreover, delegates are able not only to generate new blocks or taking part in [MPC/SSC](/technical/leader-selection/#follow-the-satoshi), but also to vote in the [Update system](/cardano/update-mechanism/).

## Schema

The slot leader can transfer its right to generate a new block to the delegate. To do
it, the slot-leader uses a *delegation-by-proxy* scheme: the slot leader generates [a proxy
signing key](https://github.com/input-output-hk/cardano-sl/blob/4378a616654ff47faf828ef51ab2f455fa53d3a3/core/Pos/Crypto/SignTag.hs#L33), or PSK, and the delegate will use it [to
sign](https://github.com/input-output-hk/cardano-sl/blob/ed6db6c8a44489e2919cd0e01582f638f4ad9b72/src/Pos/Delegation/Listeners.hs#L65)
messages to authenticate a block. There are two kinds of PSKs, heavyweight and
lightweight (see below).

Specifically, the stakeholder forms a special certificate specifying the delegates
identity via its public key. So later the delegate can sign messages within the
valid message space by providing signatures for these messages under its own
public key along with the signed certificate.

This is the format of a [proxy
signature](https://github.com/input-output-hk/cardano-sl/blob/d01d392d49db8a25e17749173ec9bce057911191/core/Pos/Crypto/Signing.hs#L256).
It includes:

1.  proxy secret key,
2.  signature.

The proxy secret key includes:

1.  omega value,
2.  issuer's public key,
3.  delegate's public key,
4.  proxy certificate.

Omega (or ω) is a special value from the [paper](/glossary/#paper). In our
implementation, it is a [pair of epochs'
identifiers](https://github.com/input-output-hk/cardano-sl/blob/f374a970dadef0fe62cf69e8b9a6b8cc606b5c7d/core/Pos/Core/Types.hs#L235). These identifiers define the delegation validity period: the produced block is
valid if its epoch index is inside this range.

[Proxy certificate](https://github.com/input-output-hk/cardano-sl/blob/d01d392d49db8a25e17749173ec9bce057911191/core/Pos/Crypto/Signing.hs#L209)
is a [signature](https://github.com/input-output-hk/cardano-crypto/blob/84f8c358463bbf6bb09168aac5ad990faa9d310a/src/Cardano/Crypto/Wallet.hs#L74)
of omega and delegate's public key.

## Heavyweight Delegation

Heavyweight delegation is using stake threshold `T`. It means that stakeholder
has to posses not less than `T` in order to participate in heavyweight
delegation. The value of this threshold is defined in the [configuration file](https://github.com/input-output-hk/cardano-sl/blob/42f413b65eeacb59d0b439d04073edcc5adc2656/lib/configuration.yaml#L224). Thus, the value of threshold for Mainnet is 0.03% of
the total stake. This value can be changed by update system.

Proxy signing certificates from heavyweight delegation are stored within the blockchain.
Please note that issuer can post only one certificate per one epoch.

Please note that heavyweight delegation has transitive relation. Thus, if `A` delegates to `B`
and after that `B` delegates to `C` then `C`'s delegated stake is equal to the sum `A + B`, not
just `B`.

### Expiration

Heavyweight delegation certificates expire in the beginning of every epoch if
stakeholder does not pass threshold `T` anymore. This is made to prevent delegation
pool bloat attacks where user commits a certificate and moves all his money (above threshold)
to another account, and then repeats the operation.

## Lightweight Delegation

**WARNING: Currently, lightweight delegation is disabled and will be reworked in [Shelley release](https://cardanoroadmap.com/),
so information below can be outdated.**

In contrast to heavyweight delegation, lightweight delegation doesn't require
that delegate posses `T`-or-more stake. So lightweight delegation is available
for any node. But proxy signing certificates for lightweight delegation are not
stored in the blockchain, so lightweight delegation certificate must be broadcasted
to reach delegate.

Later lightweight PSK can be
[verified](https://github.com/input-output-hk/cardano-sl/blob/42f413b65eeacb59d0b439d04073edcc5adc2656/lib/src/Pos/Delegation/Logic/Mempool.hs#L309)
given issuer's public key, signature and message itself.

Please note that the rule "only one certificate per epoch" doesn't apply to lightweight delegation.
Since lightweight delegation certificates are not stored in the blockchain it's possible to issue
a lot of lightweight certificates per epoch and blockchain won't be bloated.

### Confirmation of proxy signature delivery

The delegate should take the proxy signing key he has and make a signature of PSK using
PSK and delegate's key. If the signature is correct, then it was done by the delegate
(guaranteed by the PSK scheme).

## Why Two Delegations?

You can think of heavyweight and lightweight delegations as of strong and weak delegations correspondingly.

Heavyweight certificates are stored in the blockchain, so delegated stake may participate in MPC
by being added to the stake of delegate. So delegate by many heavyweight delegations may accumulate
enough stake to pass eligibility threshold. Moreover, heavyweight delegates can participate in voting
for Cardano SL updates.

On the contrary, stake for lightweight delegation won't be counted in delegate's MPC-related stake. So
lightweight delegation can be used for block generation only.

## Revocation Certificate

Revocation certificate is a special certificate that issuer creates to revoke delegation.
Both heavyweight and lightweight delegation can be revoked, but not in the same way.

The revocation certificate is the same as standard PSK where issuer and delegate are the same
(in other words, issuer delegates to himself).

To revoke lightweight delegation issuer sends revocation certificate to the network and
_asks_ to revoke delegation, but it cannot _enforce_ this revocation, since lightweight PSKs
are not the part of the blockchain. So theoretically lightweight delegate can ignore revocation
certificate, and in this case it will remain a delegate until its delegation certificate expires.
But such a situation won't compromise the blockchain.

Revocation of heavyweight delegation is handled other way. Since proxy signing certificates
from heavyweight delegation are stored within the blockchain, revocation certificate will be
committed in the blockchain as well. In this case the node removes heavyweight delegation
certificate which was issued before revocation certificate. But there are three important notes
about it:

1.  If the committed heavyweight delegation certificate is in the node's memory pool, and revocation
    certificate was committed as well, the delegation certificate will be removed from the memory pool.
    Obviously, in this case delegation certificate will never be added to the blockchain.
2.  If a user commits heavyweight delegation certificate and _after that_ he loses its money, he still
    can revoke that delegation, even if by that time he does not have enough money (i.e. amount of money
    he has is less than threshold `T` mentioned above).
3.  Although an issuer can post only one certificate in the current epoch, he _can_ revoke his heavyweight
    delegation in the same epoch.
