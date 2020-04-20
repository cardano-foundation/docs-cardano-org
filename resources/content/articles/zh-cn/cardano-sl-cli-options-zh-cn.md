---
title: 卡尔达诺结算层命令行选项
parent: technical-details
order: 2
redirects:
  - /technical/cli-options/
---

## 卡尔达诺结算层命令行选项

这份文档描述了卡尔达诺结算层的所有可执行文件以及所有相应的命令行参数。


### cardano-node

~~~
Cardano SL node.

Usage: cardano-node [--version] [--db-path FILEPATH] [--rebuild-db]
                    [--genesis-secret INT] [--keyfile FILEPATH]
                    [--backup-phrase PHRASE] [--topology FILEPATH]
                    [--kademlia FILEPATH] [--node-id NODE_ID]
                    [--default-port PORT] [--policies FILEPATH]
                    [--address IP:PORT] [--listen IP:PORT] [--json-log FILEPATH]
                    [--log-config FILEPATH] [--logs-prefix FILEPATH]
                    [--report-server URI] [--update-server URI]
                    [--configuration-file FILEPATH] [--configuration-key TEXT]
                    [--system-start TIMESTAMP] [--configuration-seed INTEGER]
                    [--update-latest-path FILEPATH] [--update-with-package]
                    [--no-ntp] [--route53-health-check IP:PORT] [--metrics]
                    [--ekg-server IP:PORT] [--statsd-server IP:PORT]
                    [--statsd-interval MILLISECONDS] [--statsd-debug BOOL]
                    [--statsd-prefix TEXT] [--statsd-suffix TEXT]
                    [--dump-genesis-data-to ARG] [--web] [--web-port PORT]
                    [--tlscert FILEPATH] [--tlskey FILEPATH] [--tlsca FILEPATH]
                    [--wallet-address IP:PORT] [--wallet-db-path ARG]
                    [--wallet-rebuild-db]
                    [--wallet-acid-cleanup-interval MINUTES] [--wallet-debug]
                    [--flush-wallet-db]
  Cardano SL main server node w/ wallet.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --db-path FILEPATH       Path to directory with all DBs used by the node. If
                           specified path doesn’t exist, a directory will be
                           created.
  --rebuild-db             If node's database already exists, discard its
                           contents and create a new one from scratch.
  --genesis-secret INT     Used genesis secret key index.
  --keyfile FILEPATH       Path to file with secret key (we use it for
                           Daedalus).
  --backup-phrase PHRASE   12-word phrase to recover the wallet. Words should be
                           separated by spaces.
  --topology FILEPATH      Path to a YAML file containing the network topology
  --kademlia FILEPATH      Path to a YAML file containing the kademlia
                           configuration
  --node-id NODE_ID        Identifier for this node within the network
  --default-port PORT      Port number for IP address to node ID translation
  --policies FILEPATH      Path to a YAML file containing the network policies
  --address IP:PORT        IP and port of external address. Please make sure
                           these IP and port (on which node is running) are
                           accessible otherwise proper work of CSL isn't
                           guaranteed. 0.0.0.0 is not accepted as a valid host.
  --listen IP:PORT         IP and port on which to bind and listen. Please make
                           sure these IP and port are accessible, otherwise
                           proper work of CSL isn't guaranteed.
  --json-log FILEPATH      Path to JSON log file.
  --log-config FILEPATH    Path to logger configuration.
  --logs-prefix FILEPATH   Prefix to logger output path.
  --report-server URI      Reporting server to send crash/error logs on.
  --update-server URI      Server to download updates from.
  --configuration-file FILEPATH
                           Path to a yaml configuration file
  --configuration-key TEXT Key within the configuration file to use
  --system-start TIMESTAMP System start time. Format - seconds since Unix Epoch.
  --configuration-seed INTEGER
                           Seed for genesis generation. Overrides one from
                           configuration file.
  --update-latest-path FILEPATH
                           Path to update installer file, which should be
                           downloaded by Update System.
  --update-with-package    Enable updating via installer.
  --no-ntp                 Whether to use real NTP servers to synchronise time
                           or rely on local time
  --route53-health-check IP:PORT
                           Host and port for the Route53 DNS health check.
  --metrics                Enable metrics (EKG, statsd)
  --ekg-server IP:PORT     Host and port for the EKG server
  --statsd-server IP:PORT  Host and port for the statsd server
  --statsd-interval MILLISECONDS
                           Polling interval for statsd (milliseconds)
  --statsd-debug BOOL      Enable statsd debug mode
  --statsd-prefix TEXT     Prefix for statsd
  --statsd-suffix TEXT     Suffix for statsd
  --dump-genesis-data-to ARG
                           Dump genesis data in canonical JSON format to this
                           file.
  --web                    Activate web API (it’s not linked with a wallet web
                           API).
  --web-port PORT          Port for web API. (default: 8080)
  --tlscert FILEPATH       Path to file with TLS certificate
  --tlskey FILEPATH        Path to file with TLS key
  --tlsca FILEPATH         Path to file with TLS certificate authority
  --wallet-address IP:PORT IP and port for backend wallet
                           API. (default: ("127.0.0.1",8090))
  --wallet-db-path ARG     Path to the wallet's database.
  --wallet-rebuild-db      If wallet's database already exists, discard its
                           contents and create a new one from scratch.
  --wallet-acid-cleanup-interval MINUTES
                           Interval on which to execute wallet cleanup action
                           (create checkpoint and archive and cleanup archive
                           partially)
  --wallet-debug           Run wallet with debug params (e.g. include all the
                           genesis keys in the set of secret keys).
  --flush-wallet-db        Flushes all blockchain-recoverable data from DB
                           (everything excluding wallets/accounts/addresses,
                           metadata)

Command example:

  stack exec -- cardano-node                                             \
    --db-path node-db0                                                   \
    --rebuild-db                                                         \
    --keyfile secrets/secret-1.key                                       \
    --kademlia-id a_P8zb6fNP7I2H54FtGuhqxaMDAwMDAwMDAwMDAwMDA=           \
    --address 127.0.0.1:3000                                             \
    --listen 127.0.0.1:3000                                              \
    --kademlia-address 127.0.0.1:3000                                    \
    --json-log=/tmp/logs/2017-05-22_181224/node0.json                    \
    --logs-prefix /tmp/logs/2017-05-22_181224                            \
    --log-config /tmp/logs/2017-05-22_181224/conf/node0.log.yaml         \
    --kademlia-dump-path /tmp/logs/2017-05-22_181224/dump/kademlia0.dump \
    --system-start 1495462345

~~~

## cardano-keygen

~~~
Tool to generate keyfiles-related data

Usage: cardano-keygen [--version] COMMAND [--configuration-file FILEPATH]
                      [--configuration-key TEXT] [--system-start TIMESTAMP]
                      [--configuration-seed INTEGER]

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --configuration-file FILEPATH
                           Path to a yaml configuration file
  --configuration-key TEXT Key within the configuration file to use
  --system-start TIMESTAMP System start time. Format - seconds since Unix Epoch.
  --configuration-seed INTEGER
                           Seed for genesis generation. Overrides one from
                           configuration file.

Available commands:
  rearrange                Rearrange keyfiles.
  generate-key             Generate keyfile.
  generate-vss             Generate VSS certificate.
  read-key                 Dump keyfile contents.
  generate-avvm-seeds      Generate avvm seeds with public keys.
  generate-keys-by-spec    Generate secret keys and avvm seed by
                           genesis-spec.yaml
  dump-genesis-data        Dump genesis data (as per configuration) in json
                           format
~~~

## cardano-explorer-swagger

~~~
Cardano SL Explorer web API docs generator.

Usage: cardano-explorer-swagger [--version]
  Generate Swagger specification for Explorer web API.

Available options:
  -h,--help                Show this help text
  --version                Show version.

This program runs during 'cardano-sl' building on Travis CI. Generated file
'explorer-web-api-swagger.json' will be used to produce HTML documentation. This
documentation will be published at cardanodocs.com using
'update-explorer-web-api-docs.sh'.
~~~

## cardano-node-simple

~~~
Cardano SL node.

Usage: cardano-node-simple [--version] [--db-path FILEPATH] [--rebuild-db]
                           [--genesis-secret INT] [--keyfile FILEPATH]
                           [--backup-phrase PHRASE] [--topology FILEPATH]
                           [--kademlia FILEPATH] [--node-id NODE_ID]
                           [--default-port PORT] [--policies FILEPATH]
                           [--address IP:PORT] [--listen IP:PORT]
                           [--json-log FILEPATH] [--log-config FILEPATH]
                           [--logs-prefix FILEPATH] [--report-server URI]
                           [--update-server URI] [--configuration-file FILEPATH]
                           [--configuration-key TEXT] [--system-start TIMESTAMP]
                           [--configuration-seed INTEGER]
                           [--update-latest-path FILEPATH]
                           [--update-with-package] [--no-ntp]
                           [--route53-health-check IP:PORT] [--metrics]
                           [--ekg-server IP:PORT] [--statsd-server IP:PORT]
                           [--statsd-interval MILLISECONDS]
                           [--statsd-debug BOOL] [--statsd-prefix TEXT]
                           [--statsd-suffix TEXT] [--dump-genesis-data-to ARG]
                           [--behavior FILE]
  Cardano SL main server node.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --db-path FILEPATH       Path to directory with all DBs used by the node. If
                           specified path doesn’t exist, a directory will be
                           created.
  --rebuild-db             If node's database already exists, discard its
                           contents and create a new one from scratch.
  --genesis-secret INT     Used genesis secret key index.
  --keyfile FILEPATH       Path to file with secret key (we use it for
                           Daedalus).
  --backup-phrase PHRASE   12-word phrase to recover the wallet. Words should be
                           separated by spaces.
  --topology FILEPATH      Path to a YAML file containing the network topology
  --kademlia FILEPATH      Path to a YAML file containing the kademlia
                           configuration
  --node-id NODE_ID        Identifier for this node within the network
  --default-port PORT      Port number for IP address to node ID translation
  --policies FILEPATH      Path to a YAML file containing the network policies
  --address IP:PORT        IP and port of external address. Please make sure
                           these IP and port (on which node is running) are
                           accessible otherwise proper work of CSL isn't
                           guaranteed. 0.0.0.0 is not accepted as a valid host.
  --listen IP:PORT         IP and port on which to bind and listen. Please make
                           sure these IP and port are accessible, otherwise
                           proper work of CSL isn't guaranteed.
  --json-log FILEPATH      Path to JSON log file.
  --log-config FILEPATH    Path to logger configuration.
  --logs-prefix FILEPATH   Prefix to logger output path.
  --report-server URI      Reporting server to send crash/error logs on.
  --update-server URI      Server to download updates from.
  --configuration-file FILEPATH
                           Path to a yaml configuration file
  --configuration-key TEXT Key within the configuration file to use
  --system-start TIMESTAMP System start time. Format - seconds since Unix Epoch.
  --configuration-seed INTEGER
                           Seed for genesis generation. Overrides one from
                           configuration file.
  --update-latest-path FILEPATH
                           Path to update installer file, which should be
                           downloaded by Update System.
  --update-with-package    Enable updating via installer.
  --no-ntp                 Whether to use real NTP servers to synchronise time
                           or rely on local time
  --route53-health-check IP:PORT
                           Host and port for the Route53 DNS health check.
  --metrics                Enable metrics (EKG, statsd)
  --ekg-server IP:PORT     Host and port for the EKG server
  --statsd-server IP:PORT  Host and port for the statsd server
  --statsd-interval MILLISECONDS
                           Polling interval for statsd (milliseconds)
  --statsd-debug BOOL      Enable statsd debug mode
  --statsd-prefix TEXT     Prefix for statsd
  --statsd-suffix TEXT     Suffix for statsd
  --dump-genesis-data-to ARG
                           Dump genesis data in canonical JSON format to this
                           file.
  --behavior FILE          Path to the behavior config

Command example:

  stack exec -- cardano-node                                             \
    --db-path node-db0                                                   \
    --rebuild-db                                                         \
    --keyfile secrets/secret-1.key                                       \
    --kademlia-id a_P8zb6fNP7I2H54FtGuhqxaMDAwMDAwMDAwMDAwMDA=           \
    --address 127.0.0.1:3000                                             \
    --listen 127.0.0.1:3000                                              \
    --kademlia-address 127.0.0.1:3000                                    \
    --json-log=/tmp/logs/2017-05-22_181224/node0.json                    \
    --logs-prefix /tmp/logs/2017-05-22_181224                            \
    --log-config /tmp/logs/2017-05-22_181224/conf/node0.log.yaml         \
    --kademlia-dump-path /tmp/logs/2017-05-22_181224/dump/kademlia0.dump \
    --system-start 1495462345

~~~

## cardano-launcher

~~~
Tool to launch Cardano SL.

Usage: cardano-launcher [--version] --node PATH [-n ARG]
                        [--node-log-config PATH] [--node-log-path PATH]
                        [--wallet PATH] [-w ARG] --updater PATH [-u ARG]
                        [--update-archive PATH] [--updater-windows-runner PATH]
                        --node-timeout SEC [--report-server URL]
                        [--configuration-file FILEPATH]
                        [--configuration-key TEXT] [--system-start TIMESTAMP]
                        [--configuration-seed INTEGER]

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --node PATH              Path to the node executable.
  -n ARG                   An argument to be passed to the node.
  --node-log-config PATH   Path to log config that will be used by the node.
  --node-log-path PATH     File where node stdout/err will be redirected (def:
                           temp file).
  --wallet PATH            Path to the wallet executable.
  -w ARG                   An argument to be passed to the wallet.
  --updater PATH           Path to the updater executable.
  -u ARG                   An argument to be passed to the updater.
  --update-archive PATH    Path to the update archive, it will be passed to the
                           updater.
  --updater-windows-runner PATH
                           Path to write the Windows batch file executing
                           updater
  --node-timeout SEC       How much to wait for the node to exit before killing
                           it.
  --report-server URL      Where to send logs in case of failure.
  --configuration-file FILEPATH
                           Path to a yaml configuration file
  --configuration-key TEXT Key within the configuration file to use
  --system-start TIMESTAMP System start time. Format - seconds since Unix Epoch.
  --configuration-seed INTEGER
                           Seed for genesis generation. Overrides one from
                           configuration file.

Command example:

  stack exec -- cardano-launcher                                   \
    --node binaries_v000/cardano-node                              \
    --node-log-config scripts/log-templates/update-log-config.yaml \
    -n "--update-server"                                           \
    -n "http://localhost:3001"                                     \
    -n "--update-latest-path"                                      \
    -n "updateDownloaded.tar"                                      \
    -n "--listen"                                                  \
    -n "127.0.0.1:3004"                                            \
    -n "--kademlia-id"                                             \
    -n "a_P8zb6fNP7I2H54FtGuhqxaMDAwMDAwMDAwMDAwMDA="              \
    -n "--flat-distr"                                              \
    -n "(3,100000)"                                                \
    -n "--rebuild-db"                                              \
    -n "--wallet"                                                  \
    -n "--web-port"                                                \
    -n 8080                                                        \
    -n "--wallet-rebuild-db"                                       \
    --updater cardano-updater                                      \
    -u "dir"                                                       \
    -u "binaries_v000"                                             \
    --node-timeout 5                                               \
    --update-archive updateDownloaded.tar

~~~

## cardano-block-gen

~~~
Cardano SL blockchain generator

Usage: cardano-block-gen [--version] --blocks INT --nodes INT
                         [--generated-db FILEPATH] [--append] [--seed INT]
                         [--tx-count (INT,INT)] [--tx-max-outs INT]
  It generates database of node, corresponding to some correct blockchain

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --blocks INT             Length of blockchain.
  --nodes INT              Number of nodes.
  --generated-db FILEPATH  Location of generated database.
  --append                 If database already exists, append to it.
  --seed INT               Custom seed to generate blocks.
  --tx-count (INT,INT)     Tx count range.
  --tx-max-outs INT        Max number of outputs in tx

Command example:

  stack exec -- cardano-block-gen           \
    --blocks 5000                           \
    --nodes 3                               \
    --coins 100                             \
    --generated-db /path/to/existed/db      \
    --seed 123                              \
    --append

~~~

## cardano-report-server

~~~
CardanoSL report server

Usage: cardano-report-server [-p|--port INTEGER] [--logsdir FILEPATH]
                             [--severity SEVERITY] [--size-limit BYTES]
                             [--version]
  CardanoSL reporting server daemon

Available options:
  -p,--port INTEGER        Port server is running on
  --logsdir FILEPATH       Directory server will be saving logs in
  --severity SEVERITY      Logging severity
  --size-limit BYTES       Maximum body size allowed (will send 413 responses if
                           bigger)
  -h,--help                Show this help text
  --version                Show version
~~~

## cardano-dht-keygen

~~~
Generator of random key for Kademlia DHT.

Usage: cardano-dht-keygen [--version] (-n|--nonce STRING)
  Generated key will be print to stdout.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  -n,--nonce STRING        14-characters string.
~~~

## cardano-explorer-mock

~~~
Cardano SL Explorer web mock.

Usage: cardano-explorer-mock [--version]
  Run mock for Explorer web API.

Available options:
  -h,--help                Show this help text
  --version                Show version.

This program returns just the mocked data. It doesn't call any CSL functions and
doesn't interact with it. It just implements the API and returns simeple test
data.
~~~

## cardano-addr-convert

~~~
Tool to convert vending addresses into testnet addresses.

Usage: cardano-addr-convert [--version] [-a|--address STRING]
  Produce public key and write it in stdout.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  -a,--address STRING      Address to convert. It must be in base64(url) format.

Command example:

  stack exec -- cardano-addr-convert -a 2HF83bvYCTzoCbVta6t64W8rFEnvnkJbIUFoT5tOyoU=

Output example:

  3mhNKjfhaCT13DjcQ9eMK4VHfZrFxmyXq8SjVPRtz7SWfP

You can also run it without arguments to switch to interactive mode.
In this case each entered vending address is echoed with a testnet address.

~~~

## cardano-blockchain-analyser

~~~
Cardano SL blockchain generator

Usage: cardano-blockchain-analyser --db FILEPATH ([-k] | [-m] | [-g] | [-a] |
                                   [-b]) [--print-mode [human|csv|table]]
                                   [-i|--incremental] [--log-config FILEPATH]
                                   [--logs-prefix FILEPATH]
                                   [--report-server URI] [--update-server URI]
                                   [--configuration-file FILEPATH]
                                   [--configuration-key TEXT]
                                   [--system-start TIMESTAMP]
                                   [--configuration-seed INTEGER]
  Analyse a blockchain and spit out useful metrics.

Available options:
  -h,--help                Show this help text
  --db FILEPATH            Location of the database where the blockchain is
                           stored.
  -k                       Display block counts in kilobytes (KB).
  -m                       Display block counts in megabytes (MB).
  -g                       Display block counts in gigabytes (GB).
  -a                       Display block counts using an adaptive multiplier.
  -b                       Display block counts in bytes (B).
  --print-mode [human|csv|table]
                           Select the desidered rendering mode, one between
                           'human', 'csv' or 'table'.
  -i,--incremental         Run in incremental mode. In this mode, table output
                           will be disabled and rendered as a .csv, as is not
                           possible to generate nice-looking tables whilst
                           reading the blockchain one block at time. You almost
                           always want to be using this mode for huge
                           blockchains, as it's much more memory efficient.
  --log-config FILEPATH    Path to logger configuration.
  --logs-prefix FILEPATH   Prefix to logger output path.
  --report-server URI      Reporting server to send crash/error logs on.
  --update-server URI      Server to download updates from.
  --configuration-file FILEPATH
                           Path to a yaml configuration file
  --configuration-key TEXT Key within the configuration file to use
  --system-start TIMESTAMP System start time. Format - seconds since Unix Epoch.
  --configuration-seed INTEGER
                           Seed for genesis generation. Overrides one from
                           configuration file.

Command example:

  cardano-blockchain-analyser --db /path/to/existing/db

~~~

## cardano-auxx

~~~
CLI-based utilities (auxx).

Usage: cardano-auxx [--version] COMMAND [--db-path FILEPATH] [--rebuild-db]
                    [--genesis-secret INT] [--keyfile FILEPATH]
                    [--backup-phrase PHRASE] [--topology FILEPATH]
                    [--kademlia FILEPATH] [--node-id NODE_ID]
                    [--default-port PORT] [--policies FILEPATH]
                    [--address IP:PORT] [--listen IP:PORT] [--json-log FILEPATH]
                    [--log-config FILEPATH] [--logs-prefix FILEPATH]
                    [--report-server URI] [--update-server URI]
                    [--configuration-file FILEPATH] [--configuration-key TEXT]
                    [--system-start TIMESTAMP] [--configuration-seed INTEGER]
                    [--update-latest-path FILEPATH] [--update-with-package]
                    [--no-ntp] [--route53-health-check IP:PORT] [--metrics]
                    [--ekg-server IP:PORT] [--statsd-server IP:PORT]
                    [--statsd-interval MILLISECONDS] [--statsd-debug BOOL]
                    [--statsd-prefix TEXT] [--statsd-suffix TEXT]
                    [--dump-genesis-data-to ARG] [--peer HOST:PORT]
                    [--node-enabled]
  Cardano SL CLI utilities.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --db-path FILEPATH       Path to directory with all DBs used by the node. If
                           specified path doesn’t exist, a directory will be
                           created.
  --rebuild-db             If node's database already exists, discard its
                           contents and create a new one from scratch.
  --genesis-secret INT     Used genesis secret key index.
  --keyfile FILEPATH       Path to file with secret key (we use it for
                           Daedalus).
  --backup-phrase PHRASE   12-word phrase to recover the wallet. Words should be
                           separated by spaces.
  --topology FILEPATH      Path to a YAML file containing the network topology
  --kademlia FILEPATH      Path to a YAML file containing the kademlia
                           configuration
  --node-id NODE_ID        Identifier for this node within the network
  --default-port PORT      Port number for IP address to node ID translation
  --policies FILEPATH      Path to a YAML file containing the network policies
  --address IP:PORT        IP and port of external address. Please make sure
                           these IP and port (on which node is running) are
                           accessible otherwise proper work of CSL isn't
                           guaranteed. 0.0.0.0 is not accepted as a valid host.
  --listen IP:PORT         IP and port on which to bind and listen. Please make
                           sure these IP and port are accessible, otherwise
                           proper work of CSL isn't guaranteed.
  --json-log FILEPATH      Path to JSON log file.
  --log-config FILEPATH    Path to logger configuration.
  --logs-prefix FILEPATH   Prefix to logger output path.
  --report-server URI      Reporting server to send crash/error logs on.
  --update-server URI      Server to download updates from.
  --configuration-file FILEPATH
                           Path to a yaml configuration file
  --configuration-key TEXT Key within the configuration file to use
  --system-start TIMESTAMP System start time. Format - seconds since Unix Epoch.
  --configuration-seed INTEGER
                           Seed for genesis generation. Overrides one from
                           configuration file.
  --update-latest-path FILEPATH
                           Path to update installer file, which should be
                           downloaded by Update System.
  --update-with-package    Enable updating via installer.
  --no-ntp                 Whether to use real NTP servers to synchronise time
                           or rely on local time
  --route53-health-check IP:PORT
                           Host and port for the Route53 DNS health check.
  --metrics                Enable metrics (EKG, statsd)
  --ekg-server IP:PORT     Host and port for the EKG server
  --statsd-server IP:PORT  Host and port for the statsd server
  --statsd-interval MILLISECONDS
                           Polling interval for statsd (milliseconds)
  --statsd-debug BOOL      Enable statsd debug mode
  --statsd-prefix TEXT     Prefix for statsd
  --statsd-suffix TEXT     Suffix for statsd
  --dump-genesis-data-to ARG
                           Dump genesis data in canonical JSON format to this
                           file.
  --peer HOST:PORT         Address of a peer.
  --node-enabled           Run auxx as a plugin for the node, as opposed to
                           running it standalone (default: standalone).

Available commands:
  repl                     Run REPL in console to evaluate the commands.
  cmd                      Execute a list of predefined commands.

Command example:

  stack exec -- cardano-auxx                                     \
    --db-path run/auxx-db                                        \
    --rebuild-db                                                 \
    --json-log=/tmp/logs/2017-05-22_181224/node0.json            \
    --logs-prefix /tmp/logs/2017-05-22_181224                    \
    --log-config /tmp/logs/2017-05-22_181224/conf/node0.log.yaml \
    --system-start 1495462345                                    \
    --peer 127.0.0.1:3001                                        \
    repl

~~~

## cardano-cli-docs

~~~
Tool to generate CLI-docs for Cardano SL executable files.

Usage: cardano-cli-docs [--version] --bin-dir PATH
  Generate Markdown chapter for cardanodocs.com.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --bin-dir PATH           Path to the directory with Cardano SL executable
                           files.

Assumed that this program will run on Travis CI. Produced file
'cardano-cli-docs.md' will be renamed in a chapter and pushed in cardanodocs.com
repository.
~~~

## cardano-genupdate

~~~
Cardano SL updates generator.

Usage: cardano-genupdate [--version] --old PATH --new PATH (-o|--output PATH)

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --old PATH               Path to directory with old program.
  --new PATH               Path to directory with new program.
  -o,--output PATH         Path to output .tar-file with diff.

Command example:

  stack exec -- cardano-genupdate --old /tmp/app-v000 --new /tmp/app-v001 -o /tmp/app-update.tar

Both directories must have equal file structure (e.g. they must contain the same
files in the same subdirectories correspondingly), otherwise 'cardano-genupdate' will fail.

Please note that 'cardano-genupdate' uses 'bsdiff' program, so make sure 'bsdiff' is available in the PATH.

~~~

## cardano-explorer

~~~
Cardano SL explorer.

Usage: cardano-explorer [--version] [--db-path FILEPATH] [--rebuild-db]
                        [--genesis-secret INT] [--keyfile FILEPATH]
                        [--backup-phrase PHRASE] [--topology FILEPATH]
                        [--kademlia FILEPATH] [--node-id NODE_ID]
                        [--default-port PORT] [--policies FILEPATH]
                        [--address IP:PORT] [--listen IP:PORT]
                        [--json-log FILEPATH] [--log-config FILEPATH]
                        [--logs-prefix FILEPATH] [--report-server URI]
                        [--update-server URI] [--configuration-file FILEPATH]
                        [--configuration-key TEXT] [--system-start TIMESTAMP]
                        [--configuration-seed INTEGER]
                        [--update-latest-path FILEPATH] [--update-with-package]
                        [--no-ntp] [--route53-health-check IP:PORT] [--metrics]
                        [--ekg-server IP:PORT] [--statsd-server IP:PORT]
                        [--statsd-interval MILLISECONDS] [--statsd-debug BOOL]
                        [--statsd-prefix TEXT] [--statsd-suffix TEXT]
                        [--dump-genesis-data-to ARG] [--web-port PORT]
                        [--notifier-port PORT]
  Cardano SL main server node w/ explorer.

Available options:
  -h,--help                Show this help text
  --version                Show version.
  --db-path FILEPATH       Path to directory with all DBs used by the node. If
                           specified path doesn’t exist, a directory will be
                           created.
  --rebuild-db             If node's database already exists, discard its
                           contents and create a new one from scratch.
  --genesis-secret INT     Used genesis secret key index.
  --keyfile FILEPATH       Path to file with secret key (we use it for
                           Daedalus).
  --backup-phrase PHRASE   12-word phrase to recover the wallet. Words should be
                           separated by spaces.
  --topology FILEPATH      Path to a YAML file containing the network topology
  --kademlia FILEPATH      Path to a YAML file containing the kademlia
                           configuration
  --node-id NODE_ID        Identifier for this node within the network
  --default-port PORT      Port number for IP address to node ID translation
  --policies FILEPATH      Path to a YAML file containing the network policies
  --address IP:PORT        IP and port of external address. Please make sure
                           these IP and port (on which node is running) are
                           accessible otherwise proper work of CSL isn't
                           guaranteed. 0.0.0.0 is not accepted as a valid host.
  --listen IP:PORT         IP and port on which to bind and listen. Please make
                           sure these IP and port are accessible, otherwise
                           proper work of CSL isn't guaranteed.
  --json-log FILEPATH      Path to JSON log file.
  --log-config FILEPATH    Path to logger configuration.
  --logs-prefix FILEPATH   Prefix to logger output path.
  --report-server URI      Reporting server to send crash/error logs on.
  --update-server URI      Server to download updates from.
  --configuration-file FILEPATH
                           Path to a yaml configuration file
  --configuration-key TEXT Key within the configuration file to use
  --system-start TIMESTAMP System start time. Format - seconds since Unix Epoch.
  --configuration-seed INTEGER
                           Seed for genesis generation. Overrides one from
                           configuration file.
  --update-latest-path FILEPATH
                           Path to update installer file, which should be
                           downloaded by Update System.
  --update-with-package    Enable updating via installer.
  --no-ntp                 Whether to use real NTP servers to synchronise time
                           or rely on local time
  --route53-health-check IP:PORT
                           Host and port for the Route53 DNS health check.
  --metrics                Enable metrics (EKG, statsd)
  --ekg-server IP:PORT     Host and port for the EKG server
  --statsd-server IP:PORT  Host and port for the statsd server
  --statsd-interval MILLISECONDS
                           Polling interval for statsd (milliseconds)
  --statsd-debug BOOL      Enable statsd debug mode
  --statsd-prefix TEXT     Prefix for statsd
  --statsd-suffix TEXT     Suffix for statsd
  --dump-genesis-data-to ARG
                           Dump genesis data in canonical JSON format to this
                           file.
  --web-port PORT          Port for web API. (default: 8100)
  --notifier-port PORT     Port for update notifier, the socket.io
                           backend. (default: 8110)

~~~

## cardano-swagger

~~~
Cardano SL Wallet web API docs generator.

Usage: cardano-swagger [--version]
  Generate Swagger specification for Wallet web API.

Available options:
  -h,--help                Show this help text
  --version                Show version.

This program runs during 'cardano-sl' building on Travis CI. Generated file
'wallet-web-api-swagger.json' will be used to produce HTML documentation. This
documentation will be published at cardanodocs.com using
'update_wallet_web_api_docs.sh'.
~~~

## cardano-post-mortem

~~~
cardano-post-mortem

Usage: cardano-post-mortem COMMAND
  analyzes the json logs from several directories or focusses on a single
  transaction

Available options:
  -h,--help                Show this help text

Available commands:
  overview                 analyzes the json logs from LOGDIRS...
  focus                    analyzes transaction FOCUS in log folder LOGDIR
  txrelay                  analyzes transaction relays in the json logs from
                           LOGDIRS...
  throughput               analyzes transaction throughput and waiting time per
                           time windows TXWINDOW and WAITWINDOW in the json logs
                           from LOGDIRS...
~~~