## Operational certificates

Stake pool operators must provide an operational certificate to verify that the pool has the authority to run. The certificate includes the operator's signature, and includes key information about the pool (addresses, keys, etc.)

Operational certificates represent the link between the operator's offline key and their operational key. A certificate's job is to check whether or not an operational key is valid, to prevent malicious interference. The certificate identifies the current operational key, and is signed by the offline key.

Certificates are generated with an issue counter number and included in the header of each block the node generates. This mechanism enables nodes to verify whether a certificate is current, or has already been superseded by a newer one. Certificates include a kes-period (start date), which indicates the time span within which the certificate is valid, before you need to create another one. See an example of an operational certificate generation here.

The counter becomes significant when an attacker has compromised the KES key, in which case the owner of the cold keys can create a new KES key and a new certificate with a higher issue number. If a node sees two blocks claiming to originate from the same cold key, but using different KES keys, the higher issue counter trumps the lower one.

Certificates are generated on the offline machine using the offline/cold keys, before being copied over to the node to validate the KES keys used to sign the blocks. You can see an example of a transaction containing certificates [here](https://github.com/input-output-hk/cardano-tutorials/blob/master/node-setup/node-op-cert.md).
