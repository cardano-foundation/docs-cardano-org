## Public stake pools

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
