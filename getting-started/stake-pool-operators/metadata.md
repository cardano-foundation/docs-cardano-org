## Stake pool metadata

In addition to posting a registration certificate to the blockchain, setting up a stake pool for delegation also involves the provision of metadata, (additional information about the pool).

The registration certificate contains all the necessary information for the execution of the protocol (public key hashes, cost, margin, relays, and pledge), and also contains a hash of the metadata.

If metadata is provided, the end users' wallet will display the stake pool. If metadata is not supplied, the stake pool is considered private, and will not be displayed in a user's wallet.

### Public stake pools

If the registration certificate sent by stake pool operators contains metadata, the stake pool is considered to be public. 

Referring to, or pointing to metadata in the stake pool certificate is optional. The certificate might contain a URL of up to 64 bytes in length that points to a JSON object with the following content:

- A ticker of 3-5 characters, for a compact display of stake pools in a wallet.
- Title/name of up to 50 characters.
- Short textual description
- URL to a homepage with additional information about the pool (optional).

These are important considerations to note about the metadata:

- Metadata information is encoded in UTF-8, and will never exceed 512 bytes 
- The content hash of the JSON object referenced in the URL (if present), should match the content hash in the registration certificate. If there is a mismatch, the pool will not be displayed in a wallet.
- For the wallet to display the pool, the following conditions must be met: the registration certificate must refer to the metadata, the metadata must be valid and have the - correct content hash, and be available at the URL. It must be possible to get the metadata and validate it. If this process fails, the wallet will not show the pool.

If a stake pool operator changes the metadata, they must post a new stake pool registration certificate with the new content hash.

### Metadata proxy servers

Wallets do not retrieve metadata from each stake pool at every individual URL, as this could lead to malicious exploitation. For instance, third parties could slow down wallet communication by intentionally delaying the server's response time. To avoid this scenario, metadata uses proxy servers that query the URL included in the registration certificate, and cache the metadata using the pool's sks as key. Wallets will simply query these proxy servers to retrieve the metadata for the pools it needs to display, instead of sending a request to each of the pool's metadata URLs. If the content hash listed on the certificate does not match the content hash of the cached metadata, the cache will be invalidated.

Proxy servers provide an additional level of security by filtering malicious entries. For example, it is possible to embed malicious content in the metadata, typically in the link to the stake pool's homepage. If a pool hosts dangerous or illegal content, maintainers of a metadata proxy server can filter that entry and not provide it to wallets. This is a clear advantage over writing the metadata directly to the chain, where there would be no way to protect wallet users from visiting malicious sites directly from their wallet.

While proxy servers do offer effective protection against malicious interference, they could become a point of centralisation. To avoid this, we will provide third parties (stake pools, community members, etc.) with code and binaries so they can run their own proxy servers and prevent centralization.

### Interacting with stake pool metadata

Stake pool operators should follow these steps to register their stake pool's metadata:

1. Build a JSON file for the stake pool metadata:

```
        {
  
          "name": "mypool",
          "description": "My stake pool",
          "ticker": "POOL1",
          "homepage": "https://mystakepool.com"
  
        }
```

Note: The metadata must be hosted in a URL that is maintained by the stake pool operator. This could be their own personal website, a GitHub raw gist file, etc. The URL cannot be longer than 64 bytes long.

2. Use the node CLI to register or re-register the stake pool on the blockchain.

The registration information **must** include:

- Relay information
- Metadata URL
- Metadata hash
- Cost parameters

      cardano-cli shelley stake-pool registration-certificate
       --metadata-url  https://mystakepool.com/mypool.json  \  
       --metadata-hash \ 
      f97a632341f642f5ac1e15bd182d0c9599c3767230aa9bfb48b120f1c30538eb \  
      --pool-relay-port 3001 --pool-relay-ipv4 76.54.23.45 \
       ...
       
 3. Obtain the stake pool ID
  
 Use this code to obtain the stake pool id and obtain all the information required to register the pool in the SMASH database:
  
        cardano-cli shelley stake-pool id --verification-key-file pool.vkey
        > <poolid>
        
**Note**: You can check if the on-chain registration was succeeded by using this code:

      cardano-cli shelley query ledger-state --testnet-magic 42 
      | jq '._delegationState._pstate._pParams.<poolid>'
      
4. Submit a PR [here](https://github.com/input-output-hk/cardano-ops/blob/master/topologies/ff-peers.nix) to add your pool's data.

Note that you will need to provide your IP address or host name, and port.

```
      {
         operator = "name";
         poolId = "<poolid>";
         metadataUrl = "https://yourpool.com/pool.json"
         meatadataHash = "yourpoolhash";
         addr = "relay.kevinspool.org";
         port = 3001;
      }
```

**Important**: Registering your IP address with IOHK will make it "public", so please follow good security practices by running firewalls and other online security methods.
