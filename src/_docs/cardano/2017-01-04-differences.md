---
layout: default
title: Differences Between Paper and the Implementation
permalink: /cardano/differences/
group: cardano
visible: true
language: en
---
<!-- Reviewed at c4c45ce9a7a8f4aa6d88a32829755196a017f6a1 -->

# Differences Between the Ouroboros Protocol Paper and the Implementation

The goal of this document is to outline the ways in which the Cardano SL
implementation differs from the specifications presented in the *Ouroboros*
protocol [paper](/glossary/#paper) and to clarify any outstanding questions 
after reading the paper.

This document is divided into four parts:

1.  *Clarifications* - clarifies any details that are not specified in the
    paper, but are important for practical implementations.
2.  *Modifications* - outlines elements that are specified in the paper, but are
    implemented differently in Cardano SL.
3.  *Added features* - briefly outlines new features which are not described
    in the paper, but have been implemented in Cardano SL.
4.  *Omissions* - lists topics described in the paper but are not yet implemented into
    Cardano SL.

# Clarifications
This section outlines any topics that require clarifications. 

## Time, Slots, and Synchrony

In a basic model of the protocol time is divided into discrete units called
*slots*. However, there are no details on how to obtain the current time value securely
and with enough precision.

In Cardano SL, the current time value is obtained from a user's computer system time value.

We also have a feature to notify users if their system time is incorrect
(we compare it with the time value that is obtained from NTP servers). This feature is planned for a future release.

## Coin Tossing and Verifiable Secret Sharing

The paper suggests PVSS (Publicly Verifiable Secret Sharing) scheme by Schoenmakers for Cardano SL. However,
currently Cardano SL uses ["SCRAPE: Scalable Randomness Attested by
Public Entities"](https://eprint.iacr.org/2017/216.pdf) PVSS scheme.

One of the challenges while using a VSS (Verifiable Secret Sharing) scheme is associating the
public key used for signing with the public key used for the VSS scheme
(`VssPublicKey`). This is solved by introducing `VssCertificate`s. This
certificate is a signature given by a signing key for a pair consisting of
`VssPublicKey` and the epoch until which this certificate is valid. Initially,
all stakeholders with stake enough for participation in randomness generation
hold certificates. When a new stakeholder with enough stake appears, or when an
existing certificate expires, a new certificate should be generated and
submitted to the network. `VssCertificate`s are stored in blocks.

PVSS scheme uses share verification information which also
includes a commitment to the secret. It is also used as a commitment in
the protocol. The PVSS scheme has been implemented over the elliptic curve
secp256r1. Please refer to [PVSS implementation in Cardano
SL](/technical/pvss/) for more details.

## Block Generation Time

In the paper, they do not state explicitly when a slot leader should
generate a new block and send it to the network: it can be done at the beginning
of a slot, at the end of a slot, in the middle of a slot, etc. In Cardano SL
there is a special constant called "network diameter" which approximates maximal time
necessary to broadcast a block to all nodes in the network. For example, if network
diameter is 3, then block is generated and announced 3 seconds before the end of a slot.

## Stake Delegation

Delegation scheme, as described in the paper, does not explicitly state whether proxy
signing certificates should be stored within the blockchain (though there is a
suggestion to store the revocation list in the blockchain). Without storing
proxy signing certificates in the blockchain it is barely possible to consider
delegated stake in checking eligibility threshold. On the other hand, if all
certificates are stored in the blockchain, it may lead to a blockchain bloat
when a big portion of blocks will be occupied by proxy certificates. Submitting
a certificate is free, so adversaries can generate as many certificates as they
want.

There are two types of delegation in Cardano SL: heavyweight and lightweight.
There is a threshold on stake that one has to posses in order to participate in
heavyweight delegation. Proxy signing certificates from heavyweight delegation
are stored within the blockchain. On the contrary, lightweight delegation is
available for everybody, but certificates are not stored within the blockchain
and are not considered when checking eligibility threshold. As the paper suggests,
*delegation-by-proxy* scheme is used.

Please read about [Stake Delegation in Cardano SL](/technical/delegation/) for
implementation details.

# Modifications

## Leader Selection Process

In the paper, Leader Selection Process is described as flipping a
`(1 - p₁) … (1 - pⱼ₋₁) pⱼ`-biased coin to see whether the `j`-th stakeholder is
selected as the leader of the given slot. Here `pⱼ` is probability of selecting the `j`-th
stakeholder.

In Cardano SL, it is implemented in a slightly different way. `R` random
numbers in a range `[0 .. totalCoins]` are generated, where `R` is a number of
slots in an epoch. Stakeholders occupy different subsegments on this range,
proportional to their stakes. This way, each random number maps into stakeholder.
Also, as the paper suggests, a short (32-bits) seed is used for initializing PRG
instead of using `n ⌈log λ⌉` random bits.

Please read about [Leader Selection in Cardano SL](/technical/leader-selection/)
for implementation details.

## Commitments, openings, shares sending

Time of sending is randomized within a small interval. It is done to avoid network
overload when all coin-tossing participants send their data at the same time.
This interval is chosen to be small enough for protocol to remain secure. If
this data is sent too late and there are many adversaries leading last few slots
of a certain phase, it can happen that data will not be included into the block.

## Multishares

In the paper, each stakeholder is presented as exactly one participant of the
underlying VSS scheme. However, it is natural that a stakeholder with more stake
is more important than a stakeholder with less stake with regards to secret
sharing. For instance, if three honest stakeholders control 60% of stake in
total (each of them controls 20%) and there are 40 adversary stakeholders each
having 1% of stake, then the adversary has full control over secret sharing.

To overcome this problem, a number of shares for each stakeholder proportional
to their stake is generated in Cardano SL.

## Randomness Generation Failure

The paper does not cover the situation when commitments cannot be recovered.
However, a practical implementation should account for such scenarios.
Cardano SL implementation uses a seed consisting of all zeroes if there are no
commitments that could be recovered.

# Added Features

## Update System

See the article on [update system](/cardano/update-mechanism/).

## Security of P2P

See the article on [P2P implementation and
hardening](/technical/protocols/p2p/).

# Omissions

The sections on *Input Endorsers* and *Incentive Structure* are not implemented
yet. Those sections are to be implemented together with the pending research on
Side-chains and released within the Side-chains release.
