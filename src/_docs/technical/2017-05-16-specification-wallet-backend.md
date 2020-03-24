---
layout: default
title: Formal specification for a Cardano wallet
permalink: /technical/formal-specification-for-a-cardano-wallet/
group: technical
visible: true
language: en
---
# Formal specification for a Cardano wallet

This document is a formal specification of a wallet for Cardano (or any UTxO-based cryptocurrency). The purpose is to help understand some of the subtleties and give a reasonable starting point for tests and implementations.

To the best of our knowledge, no other existing cryptocurrency wallet comes with such a formal specification. We have therefore attempted to formalise the core functionality of the existing wallet and let our knowledge of the difficulties with the current implementation be a guide in deciding which aspects of the wallet needed more careful thought. We also state and (partially) prove various properties of the wallet models we develop, not only to prove its correctness but also to try and capture our intuitions about what a cryptocurrency wallet is, exactly.

<a href="/files/formal-specification-of-the-cardano-wallet.pdf" target="_blank"><img src="/img/formal-specification-of-the-cardano-wallet4.jpg" alt="" /></a>
