---
layout: default
title: Introduction
permalink: /technical/plutus/introduction/
group: technical-plutus
language: en
---
<!-- Reviewed at f766612fb6c75b941cbe3c2d9c2db17dd2dc9bd3 -->

# Plutus Introduction

Plutus is a strictly typed pure functional programming language used for
defining smart contracts in Cardano. The syntax is fairly Haskell-like, but
unlike Haskell, the language is eagerly evaluated.

## Declaring Data Types

In Plutus, to define a data type, we give the name of the type, then any type
parameters, together with a list of constructor alternatives — like in Haskell.
Each constructor alternative has the types of its arguments.

So, for instance, the type of Peano numerals would be defined as

    data Nat = { Zero | Suc Nat }

whereas binary trees would be defined as

    data Tree a = { Leaf | Branch (Tree a) a (Tree a) }

The type constructor `Tree` takes one parameter, `a`. It's inhabited by values
constructed by two constructors, `Leaf`, which has no arguments, and `Branch`,
which has three arguments, a left subtree of type `Tree a`, a value of type `a`,
and a right subtree of type `Tree a`.

We can inspect data using the `case` construct, like so:

    case t of {
      Leaf -> ... ;
      Branch l x r -> ...
    }

## Declaring Values

To declare a new value (whether it's a function or not), we provide its type,
and then specify its value. For instance, to define addition for natural
numbers, we can give a recursive definition using `case`:

    add : Nat -> Nat -> Nat {
      add = \m n ->
        case m of {
          Zero -> n ;
          Suc m' -> Suc (add m' n)
        }
    }

We can also use pattern matching equations in the same way as in Haskell, which
makes the definition of functions like this much more elegant:

    add : Nat -> Nat -> Nat {
      add Zero n = n ;
      add (Suc m) n = Suc (add m n)
    }

## Smart Contract Computations

Plutus has one important type built into the language specific for smart
contract computations: the type constructor `Comp`, which takes one type
parameter. The simplest way to make values is with the two computation
constructors `success`, which takes a value `M` with type `A` (for any choice of
`A`) and produces a computation of type `Comp A` which represents a successful
smart contract computation that returns `M`. You can also build a value of type
`Comp A` with just `failure`, which represents a failed computation.

It's also possible to chain smart contract computations together using `do`
notation. Given a term `M` of the type `Comp A`, and a term `N` of type `Comp B`
with a free variable `x` of type `A`, we can form `do { x <- M ; N }` which runs
the computation `M`, binds its returned value to `x`, then runs the computation
`N`. If the term `M` computes to `failure`, then the failure is propagated by
the `do` construct and the whole thing computes to `failure`.

This is most useful for building validator scripts for smart contracts. The
standard way of doing this is by asking for a redeemer program of type `Comp A`
and a validator program of type `A -> Comp B`, which then are composed to form
`do { x <- redeemer ; validator x }`. The `redeemer` program is run, returning
whatever data `validator` needs, and then that data is given to `validator` 
which is then run.

## More Detailed Overview

The other chapters in Plutus section provide a more detailed overview of the
grammar, types, and programs of Plutus, including the built-in types and
functionality, and should be read before diving into writing programs. There's
also a demo file, showing the implementation of a number of common functions, to
give a good sense of the use of the language.
