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
- [Get address from public key](https://docs.cardano.org/en/latest/rosetta/get-started-rosetta.html#to-get-address-from-public-key)
- [Determine transaction size](https://docs.cardano.org/en/latest/rosetta/get-started-rosetta.html#to-determine-transaction-size)
- [Get any information required to construct a transaction for a specific network](https://docs.cardano.org/en/latest/rosetta/get-started-rosetta.html#get-any-information-required-to-construct-a-transaction-for-a-specific-network)
- [Create unsigned transaction](https://docs.cardano.org/en/latest/rosetta/get-started-rosetta.html#confirm-correctness-of-unsigned-tx-body)

#### Get address from public key ####
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
#### Determine transaction size ####
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
#### Create unsigned transaction ####
/construction/payloads

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
    ],
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
**Response:**

```
{
    "unsigned_transaction": "8279010a613430303831383235383230386630653162623331666630396138646363386131623133643663636238663837336638643934623137626237323336633632653264396436336435343236623030303138313832353831643630633236316362363361306564353866373139616335306162636636363132333939343465313136303431383338366536663266316333626138323162303030303030653864326265363638346131353831633262626436393733306162373166396333383235616566363864303134303066633763376638323730656433343038323532386231376136613234313331303134313332303130323161303030356430353530333161303133373838386481a7746f7065726174696f6e5f6964656e746966696572a165696e64657800647479706565696e7075746673746174757360676163636f756e74a16761646472657373783f616464725f7465737431767a78397a74773539677a70377478726873347a3033753273667a783879343976786e337663687a6173706c78336377706830387066616d6f756e74a26576616c75656d2d3939393936383438373132396863757272656e6379a26673796d626f6c6341444168646563696d616c73066b636f696e5f6368616e6765a26f636f696e5f6964656e746966696572a16a6964656e7469666965727842386630653162623331666630396138646363386131623133643663636238663837336638643934623137626237323336633632653264396436336435343236623a306b636f696e5f616374696f6e6a636f696e5f7370656e74686d65746164617461a16b746f6b656e42756e646c6581a268706f6c69637949647838326262643639373330616237316639633338323561656636386430313430306663376337663832373065643334303832353238623137613666746f6b656e7382a26576616c756561316863757272656e6379a36673796d626f6c62333168646563696d616c7300686d65746164617461a168706f6c696379496478383262626436393733306162373166396333383235616566363864303134303066633763376638323730656433343038323532386231376136a26576616c756561316863757272656e6379a36673796d626f6c62333268646563696d616c7300686d65746164617461a168706f6c696379496478383262626436393733306162373166396333383235616566363864303134303066633763376638323730656433343038323532386231376136",
    "payloads": [
        {
            "address": "addr_test1vzx9ztw59gzp7txrhs4z03u2sfzx8y49vxn3vchzasplx3cwph08p",
            "hex_bytes": "6dd67acae1ad818eab971f27cc20bd6e030cf9783b32b0052d6d98bb13792b30",
            "signature_type": "ed25519"
        }
    ]
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

#### Confirm correctness of unsigned tx body ####
/construction/parse

**Request:**

```
{
    "network_identifier": {
        "blockchain": "cardano",
        "network": "testnet"
    },
        "signed": false,
    "transaction": "8279010a613430303831383235383230386630653162623331666630396138646363386131623133643663636238663837336638643934623137626237323336633632653264396436336435343236623030303138313832353831643630633236316362363361306564353866373139616335306162636636363132333939343465313136303431383338366536663266316333626138323162303030303030653864326265363638346131353831633262626436393733306162373166396333383235616566363864303134303066633763376638323730656433343038323532386231376136613234313331303134313332303130323161303030356430353530333161303133373838386481a7746f7065726174696f6e5f6964656e746966696572a165696e64657800647479706565696e7075746673746174757360676163636f756e74a16761646472657373783f616464725f7465737431767a78397a74773539677a70377478726873347a3033753273667a783879343976786e337663687a6173706c78336377706830387066616d6f756e74a26576616c75656d2d3939393936383438373132396863757272656e6379a26673796d626f6c6341444168646563696d616c73066b636f696e5f6368616e6765a26f636f696e5f6964656e746966696572a16a6964656e7469666965727842386630653162623331666630396138646363386131623133643663636238663837336638643934623137626237323336633632653264396436336435343236623a306b636f696e5f616374696f6e6a636f696e5f7370656e74686d65746164617461a16b746f6b656e42756e646c6581a268706f6c69637949647838326262643639373330616237316639633338323561656636386430313430306663376337663832373065643334303832353238623137613666746f6b656e7382a26576616c756561316863757272656e6379a36673796d626f6c62333168646563696d616c7300686d65746164617461a168706f6c696379496478383262626436393733306162373166396333383235616566363864303134303066633763376638323730656433343038323532386231376136a26576616c756561316863757272656e6379a36673796d626f6c62333268646563696d616c7300686d65746164617461a168706f6c696379496478383262626436393733306162373166396333383235616566363864303134303066633763376638323730656433343038323532386231376136"
}

```
**Response:**

(Response matches preprocess payload)

Locally sign payloads[0].hex_bytes from previous/payloads response to use in next request.

