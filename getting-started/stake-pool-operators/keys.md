## About the stake pool operator keys

It is the responsibility of the operator to manage both the hot (online), and cold (offline) keys for the pool. Cold keys must be secure and should not reside on a device that has internet connectivity. It is recommended that you have multiple backups of your cold keys.

The keys that you need as a stake pool operator are:

* stake pool cold key
* stake pool hot key (KES key)
* stake pool VRF key

The KES key, or hot key as mentioned above, is a node operational key that authenticates who you are. You specify the validity of the KES key using the start time and key period parameters and this KES key needs to be updated every 90 days. The VRF key is a signing verification key and is stored within the operational certificate. You can read more information on these crypto scheme keys in the Shelley ledger specification
