## Getting started with Rosetta ##
The Rosetta API is made up of two core components; the [Data API](https://www.rosetta-api.org/docs/data_api_introduction.html) and the [Construction API](https://www.rosetta-api.org/docs/construction_api_introduction.html). Together, these APIs allow you to read and write to blockchains in a standard format over a standard communication protocol. The specifications for these APIs can be found in the [rosetta-specifications repository](https://github.com/coinbase/rosetta-specifications).

For full details, read the [Rosetta API specification](https://www.rosetta-api.org/docs/1.4.4/welcome.html). For an overview of the interactions, view the [Flow of Operations](https://www.rosetta-api.org/docs/1.4.4/construction_api_introduction.html#flow-of-operations).

### Developer Examples ###
This section outlines some examples that you can test out as a developer who wants to use Rosetta. However, we advise that you should exercise caution if testing these on mainnet.

Sample code for the typical Rosetta use cases:
- [Sending transactions](https://github.com/input-output-hk/cardano-rosetta/tree/master/examples#transaction-sending)
- [Staking key registration and delegation](https://github.com/input-output-hk/cardano-rosetta/tree/master/examples#staking-key-registration-and-delegation)
- [Withdrawals](https://github.com/input-output-hk/cardano-rosetta/tree/master/examples#withdrawals)
- [Sending transactions with single multi assets](https://github.com/input-output-hk/cardano-rosetta/tree/master/examples#sending-transactions-with-single-multi-assets)

### Exchange Examples ###
This section provides some endpoint examples of how exchanges can use Rosetta for their integration needs:
- [To get address from public key](https://docs.cardano.org/en/latest/rosetta/get-started-rosetta.html#to-get-address-from-public-key)
- [To determine transaction size](https://docs.cardano.org/en/latest/rosetta/get-started-rosetta.html#to-determine-transaction-size)

#### To get address from public key ####
/construction/derive

**Request:**

```
{
    "network_identifier": {
        "blockchain": "cardano",
        "network": "testnet"
    },
    "public_key": {
        "hex_bytes": "22ae46272bffe077cecc46e1494d790d4ad453ae1c4228aa0c2e9671dcb16341",
        "curve_type": "edwards25519"
    },
    "metadata": {}
}
```


**Response:**

```
{
    "address": 
    "addr_test1vzx9ztw59gzp7txrhs4z03u2sfzx8y49vxn3vchzasplx3cwph08p"
}
```
#### To determine transaction size ####
/construction/preprocess

**Request:**

```
{
    "network_identifier": {
        "blockchain": "cardano",
        "network": "testnet"
    },
    "operations": [
        {
            "operation_identifier": {
                "index": 0
            },
            "type": "input",
            "status": "",
            "account": {
                "address": "addr_test1vzx9ztw59gzp7txrhs4z03u2sfzx8y49vxn3vchzasplx3cwph08p"
            },
            "amount": {
                "value": "-999968487129",
                "currency": {
                    "symbol": "ADA",
                    "decimals": 6
                }
            },
            "coin_change": {
                "coin_identifier": {
                    "identifier": "8f0e1bb31ff09a8dcc8a1b13d6ccb8f873f8d94b17bb7236c62e2d9d63d5426b:0"
                },
                "coin_action": "coin_spent"
            },
            "metadata": {
                "tokenBundle": [
                    {
                        "policyId": "2bbd69730ab71f9c3825aef68d01400fc7c7f8270ed34082528b17a6",
                        "tokens": [
                            {
                                "value": "1",
                                "currency": {
                                    "symbol": "31",
                                    "decimals": 0,
                                    "metadata": {
                                        "policyId": "2bbd69730ab71f9c3825aef68d01400fc7c7f8270ed34082528b17a6"
                                    }
                                }
                            },
                            {
                                "value": "1",
                                "currency": {
                                    "symbol": "32",
                                    "decimals": 0,
                                    "metadata": {
                                        "policyId": "2bbd69730ab71f9c3825aef68d01400fc7c7f8270ed34082528b17a6"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "operation_identifier": {
                "index": 1
            },
            "type": "output",
            "status": "",
            "account": {
                "address": "addr_test1vrpxrjmr5rk43ace43g2hnmxzguegns3vpqc8phx7tcu8wsgmynq6"
            },
            "amount": {
                "value": "999968106116",
                "currency": {
                    "symbol": "ADA",
                    "decimals": 6
                }
            },
            "metadata": {
                "tokenBundle": [
                    {
                        "policyId": "2bbd69730ab71f9c3825aef68d01400fc7c7f8270ed34082528b17a6",
                        "tokens": [
                            {
                                "value": "1",
                                "currency": {
                                    "symbol": "31",
                                    "decimals": 0,
                                    "metadata": {
                                        "policyId": "2bbd69730ab71f9c3825aef68d01400fc7c7f8270ed34082528b17a6"
                                    }
                                }
                            },
                            {
                                "value": "1",
                                "currency": {
                                    "symbol": "32",
                                    "decimals": 0,
                                    "metadata": {
                                        "policyId": "2bbd69730ab71f9c3825aef68d01400fc7c7f8270ed34082528b17a6"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    ]
}

}
```

**Response:**

```
{
   "options": {
        "relative_ttl": 1000,
        "transaction_size": 235
    }
}
```
#### Get any information required to construct a transaction for a specific network ####
/construction/metadata

**Request:**

```
{
    "network_identifier": {
        "blockchain": "cardano",
        "network": "testnet"
    },
    "options": {
        "relative_ttl": 1000,
        "transaction_size": 235
    },
    "public_keys": [
        {
            "hex_bytes": "22ae46272bffe077cecc46e1494d790d4ad453ae1c4228aa0c2e9671dcb16344",
            "curve_type": "edwards25519"
        }
    ]
}

```
**Response:**

```
{
    "metadata": {
        "ttl": "20416653"
    },
    "suggested_fee": [
        {
            "value": "165897",
            "currency": {
                "symbol": "ADA",
                "decimals": 6
            }
        }
    ]
}

```
