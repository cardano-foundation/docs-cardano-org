## Public stake pools and metadata management

If the registration certificate that is sent by a stake pool operator contains metadata, the stake pool is considered to be public.

Referring to, or pointing to metadata, in the stake pool certificate is optional. The certificate might contain a URL of up to 64 bytes in length that points to a JSON object with the following content:

* a ticker of 3-5 characters, for a compact display of stake pools in a wallet.
* title/name of up to 50 characters.
* short textual description
* URL to a homepage with additional information about the pool (optional).

These are important considerations to note about the metadata:

* metadata information is encoded in UTF-8, and will never exceed 512 bytes
* the content hash of the JSON object referenced in the URL (if present), should match the content hash in the registration certificate. If there is a mismatch, the pool will not be displayed in a wallet.
* for the wallet to display the pool, the following conditions must be met - the registration certificate must refer to the metadata, the metadata must be valid and have the correct content hash, and be available at the URL. It must be possible to get the metadata and validate it. If this process fails, the wallet will not display the pool.
* if a stake pool operator changes the metadata, they must post a new stake pool registration certificate with the new content hash.

### Metadata proxy servers

Wallets do not retrieve metadata from each stake pool at every individual URL, as this could lead to malicious exploitation. For instance, third parties could slow down wallet communication by intentionally delaying the server's response time. To avoid this scenario, metadata uses proxy servers that query the URL included in the registration certificate, and cache the metadata using the pool's secret key. Wallets will simply query these proxy servers to retrieve the metadata for the pools it needs to display, instead of sending a request to each of the pool’s metadata URLs. If the content hash listed on the certificate does not match the content hash of the cached metadata, the cache will be invalidated.

Proxy servers provide an additional level of security by filtering malicious entries. For example, it is possible to embed malicious content in the metadata, typically in the link to the stake pool’s homepage. If a pool hosts dangerous or illegal content, maintainers of a metadata proxy server can filter that entry and not provide it to wallets. This is a clear advantage over writing the metadata directly to the chain, where there would be no way to protect wallet users from visiting malicious sites directly from their wallet.

While proxy servers do offer effective protection against malicious interference, they could become a point of centralisation. To avoid this, we will provide third parties (stake pools, community members, etc.) with code and binaries so they can run their own proxy servers and prevent centralization.
