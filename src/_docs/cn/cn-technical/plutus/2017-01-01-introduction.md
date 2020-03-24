---
layout: default
title: 介绍
permalink: /technical/plutus/introduction/cn/
group: cn-technical-plutus
language: cn
---
<!-- Reviewed at f766612fb6c75b941cbe3c2d9c2db17dd2dc9bd3 -->

# Plutus 介绍

Plutus 是用于在 Cardano 中定义智能合约的严格类型的纯函数式编程语言。语法相当像 Haskell，但与 Haskell 不同的是， (TODO)


## 声明数据类型

在 Plutus 中，为定义一个数据类型，我们给出类型的名称，然后是任何类型参数，然后是一系列的构造参数 - 就像 Haskell 中的那样，每个构造函数都有其参数的类型。

所以，例如， Peano 的数字的类型被定义为

    data Nat = { Zero | Suc Nat }

而二叉树被定义为

    data Tree a = { Leaf | Branch (Tree a) a (Tree a) }

`Tree` 类型的结构接受一个参数 `a`。它有两个构造函数构造的值，`Leaf` 没有参数，并且 `Branch` 有三个子树，一个左子树 `Tree a`，类型是 `a`，一个右子树，`Tree a`。

我们可以用 `case` 结构来查看数据，如下所示：


    case t of {
      Leaf -> ... ;
      Branch l x r -> ...
    }

## 声明值

要声明一个新的值（不管它是否是函数），我们提供它的类型，然后指定它的值。例如，要定义自然数的加法，我们可以使用下面的递归定义 `case`：


    add : Nat -> Nat -> Nat {
      add = \m n ->
        case m of {
          Zero -> n ;
          Suc m' -> Suc (add m' n)
        }
    }

我们也可以像 Haskell 中那样使用模式匹配，这使得这样的函数定义更加优雅：

    add : Nat -> Nat -> Nat {
      add Zero n = n ;
      add (Suc m) n = Suc (add m n)
    }

## 智能合约计算

Plutus 在智能合约计算专用语言中有一个重要类型：类型构造函数 `Comp`，它带有一个类型参数。创建值最简单的方法是使用两个计算构造函数 `success`，`M` 值使用类型 `A`（任何 `A` 的选择），并生成一个 `Comp A` 代表成功的返回 `M` 的智能合约类型计算结果。你也可以构造一个返回错误的 `Comp A` 类型，表明一个失败的计算结果。

同样可以使用 `do` 符号将智能合约计算连接在一起。给定一个 `Comp A` 类型的 `A`，以及有着变量 `x` 的类型 `A`，我们可以形成 `do { x <- M ; N }` 运行计算 `M`，绑定它的返回值 `X`，然后运行计算 `N`。如果这个 `M` 计算结果是 `failure`，那么这个失败就会被这个 `do` 结构传播，整个事务就被计算为 `failure`。

这对于构建只能合约的验证器脚本非常有用。这么做的标准方式是要求一个 `Comp A` 类型的赎回程序和一个 `A -> Comp B` 类型的验证程序，然后组成一个 `do { x <- redeemer ; validator x }` 类型的验证程序。该 `redeemer` 运行时的时候，不管 `validator` 需要什么数据都返回给它，`validator` 都会运行。

## 更详细的概述

Plutus 部分的其他章节提供了对 Plutus 的语法，类型和程序的更详细的概述，包括内置的类型和功能，在深入编写程序前应该阅读。还有一个演示文件，展示了一些常用函数的实现，一遍可以更好地理解该语言的使用。

