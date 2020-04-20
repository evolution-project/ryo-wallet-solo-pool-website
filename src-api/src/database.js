import { getBlock, decodeOutputs } from "./rpc"
import SQL from "better-sqlite3"

export class Database {
    constructor() {
        this.db = null
        this.stats = {}
        this.sqlitePath = "stats.sqlite"

        this.db = new SQL(this.sqlitePath)

        this.db.prepare("CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT) WITHOUT ROWID;").run()
        this.db.prepare("CREATE TABLE IF NOT EXISTS blocks(hash TEXT PRIMARY KEY, txid TEXT, height INTEGER, difficulty INTEGER, nonce INTEGER, reward INTEGER, timestamp DATETIME, version TEXT, status INTEGER, address TEXT) WITHOUT ROWID;").run()
        this.db.prepare("CREATE TABLE IF NOT EXISTS hashrate(timestamp DATETIME, hashes INTEGER);").run()
        this.db.prepare("CREATE TABLE IF NOT EXISTS network_blocks(height INTEGER PRIMARY KEY, difficulty INTEGER, timestamp DATETIME) WITHOUT ROWID;").run()
        this.db.prepare("CREATE TABLE IF NOT EXISTS network_hashrate(timestamp DATETIME, hashes INTEGER);").run()
        this.db.prepare("CREATE TABLE IF NOT EXISTS accounts(address TEXT PRIMARY KEY, viewkey TEXT, scan_height INTEGER) WITHOUT ROWID;").run()

        this.db.prepare("INSERT OR IGNORE INTO settings(key, value) VALUES('height', -1)").run()

        // RYoTqzy6zKKeP9UhkPWZpwMiAzV1cPE3vews8Q7vT4mKFMTqGPXBPNsWaKSu27ybqTNwqtqeKahkrBPmN1aEb4qEGKtgUPJvwhE
        // 7420b985d15942957cd1b2881701bf8cf32cd988a8f6b999b41ee7a99305fc06




        this.stmt = {

            begin: this.db.prepare("BEGIN"),
            commit: this.db.prepare("COMMIT"),
            rollback: this.db.prepare("ROLLBACK"),

            settings: this.db.prepare("SELECT * FROM settings"),
            settings_update: this.db.prepare("UPDATE settings SET value = :value WHERE key = :key"),

            accounts: this.db.prepare("SELECT * FROM accounts"),
            accounts_get: this.db.prepare("SELECT * FROM accounts WHERE address = :address AND viewkey = :viewkey"),
            accounts_add: this.db.prepare("INSERT OR IGNORE INTO accounts(address, viewkey, scan_height) VALUES(:address, :viewkey, 0)"),
            accounts_update: this.db.prepare("UPDATE accounts SET scan_height = :scan_height WHERE address = :address"),

            blocks: this.db.prepare("SELECT hash, txid, height, difficulty, nonce, reward, timestamp, version, status FROM blocks ORDER BY height desc"),
            blocks_status_0: this.db.prepare("SELECT * FROM blocks WHERE status = 0"),
            blocks_update: this.db.prepare("UPDATE blocks SET status = :status WHERE hash = :hash"),
            blocks_add: this.db.prepare("INSERT OR IGNORE INTO blocks(hash, txid, height, difficulty, nonce, reward, timestamp, version, status, address) VALUES(:hash, :txid, :height, :difficulty, :nonce, :reward, :timestamp, :version, :status, '')"),

            blocks_claimed: this.db.prepare("SELECT * FROM blocks WHERE address = :address ORDER BY height desc"),
            blocks_unclaimed: this.db.prepare("SELECT * FROM blocks WHERE address = '' ORDER BY height asc"),
            blocks_update_address: this.db.prepare("UPDATE blocks SET address = :address WHERE hash = :hash"),

            hashrate: this.db.prepare("SELECT * FROM hashrate"),
            hashrate_add: this.db.prepare("INSERT OR IGNORE INTO hashrate(timestamp, hashes) VALUES(:timestamp, :hashes)"),
            hashrate_calc: this.db.prepare("SELECT SUM(difficulty) as hashes FROM blocks WHERE timestamp BETWEEN :start_time AND :end_time"),
            hashrate_clean: this.db.prepare("DELETE FROM hashrate WHERE timestamp < :timestamp"),

            network_blocks: this.db.prepare("SELECT * FROM network_blocks ORDER BY height desc"),
            network_blocks_add: this.db.prepare("INSERT OR IGNORE INTO network_blocks(height, difficulty, timestamp) VALUES(:height, :difficulty, :timestamp)"),
            network_blocks_clean: this.db.prepare("DELETE FROM network_blocks WHERE timestamp < :timestamp"),

            network_hashrate: this.db.prepare("SELECT * FROM network_hashrate"),
            network_hashrate_add: this.db.prepare("INSERT OR IGNORE INTO network_hashrate(timestamp, hashes) VALUES(:timestamp, :hashes)"),
            network_hashrate_calc: this.db.prepare("SELECT SUM(difficulty) as hashes FROM network_blocks WHERE timestamp BETWEEN :start_time AND :end_time"),
            network_hashrate_clean: this.db.prepare("DELETE FROM network_hashrate WHERE timestamp < :timestamp"),

        }

    }

    begin() {
        this.stmt.begin.run()
    }
    commit() {
        this.stmt.commit.run()
    }
    rollback() {
        this.stmt.rollback.run()
    }

    getSettings() {
        let settings = {}
        for(const setting of this.stmt.settings.all()) {
            settings[setting.key] = setting.value
        }
        return settings
    }

    setSettings(key, value) {
        this.stmt.settings_update.run({ key, value })
    }

    async heartbeat() {
        const dateNow = Date.now() / 1000

        await this.unlockBlocks()
        await this.detectUserBlocks()

        const blocks = this.getBlocks()
        const network_blocks = this.getNetworkBlocks()
        const hashrate = this.getHashrates()
        const hashrate_current = hashrate.solo[Object.keys(hashrate.solo).pop()]

        let stats = {
            hashrate: 0,
            lastBlock: {
                timestamp: null,
                height: null,
            },
            blocksFound: 0,
            blockTime: null,
        }

        let network_stats = {
            diff: 0,
            hashrate: 0,
            lastBlock: {
                timestamp: null,
                height: null,
            }
        }

        if(network_blocks.length) {
            const last_network_block = network_blocks[0]
            network_stats = {
                diff: last_network_block.difficulty,
                hashrate: Math.floor(last_network_block.difficulty / 120),
                lastBlock: {
                    timestamp: last_network_block.timestamp,
                    height: last_network_block.height,
                }
            }
        }

        if(blocks.length) {
            const last_solo_block = blocks[0]
            stats = {
                hashrate: hashrate_current,
                lastBlock: {
                    timestamp: last_solo_block.timestamp,
                    height: last_solo_block.height,
                },
                blocksFound: blocks.length,
                blockTime: null,
            }
            if(hashrate_current != 0) {
                stats.blockTime = Math.floor(120 * network_stats.hashrate / hashrate_current)
            }
        }

        return {
            stats,
            network_stats,
            blocks,
            hashrate,
        }

    }

    async unlockBlocks() {
        const blocks = this.stmt.blocks_status_0.all()
        for(const block of blocks) {
            try {
                const data = await getBlock(block.height)
                if(data.hasOwnProperty("error")) {
                    throw data.error
                }
                if(data.result.block_header.hash != block.hash) {
                    console.log(`Block ${block.height} orphaned`)
                    this.stmt.blocks_update.run({ status: 1, hash: block.hash })
                }
                if(data.result.block_header.depth > 18) {
                    console.log(`Block ${block.height} unlocked`)
                    this.stmt.blocks_update.run({ status: 2, hash: block.hash })
                }
            } catch(error) {
                console.log(`Failed to get block ${block.height}`)
            }
        }
    }

    async detectUserBlocks() {
        const accounts = this.getAccounts()
        const blocks = this.stmt.blocks_unclaimed.all()
        for(const block of blocks) {
            const { hash, txid, height } = block
            for(const account of accounts) {
                const { address, viewkey, scan_height } = account
                if(scan_height >= height) {
                    continue
                }
                console.log(`Checking block ${height} for user ${address.substring(0,10)}`)
                try {
                    const data = await decodeOutputs(txid, address, viewkey)
                    if(data.status == "error") {
                        throw data.message
                    }
                    if(data.data.outputs[0].match) {
                        console.log(`Output match block ${height} for user ${address.substring(0,10)}`)
                        this.stmt.blocks_update_address.run({ address, hash })
                        break
                    }
                } catch(error) {
                    console.log(`Failed to contact explorer ${txid} - ${error}`)
                    continue
                }
            }
            for(const account of accounts) {
                const { address } = account
                const scan_height = Math.max(account.scan_height, height)
                this.stmt.accounts_update.run({ address, scan_height })
            }
        }
    }

    createUserAccount(address, viewkey) {
        this.stmt.accounts_add.run({ address, viewkey })
    }

    getUserAccount(address, viewkey) {
        return this.stmt.accounts_get.get({ address, viewkey })
    }

    getUserBlocks(address) {
        const blocks = this.stmt.blocks_claimed.all({ address })
        return blocks
    }

    getAccounts() {
        return this.stmt.accounts.all()
    }

    getBlocks() {
        return this.stmt.blocks.all()
    }

    getNetworkBlocks() {
        return this.stmt.network_blocks.all()
    }

    cleanStats() {
        const dateNow = Date.now() / 1000
        const one_day = dateNow - 24 * 60 * 60
        const thirty_day = dateNow - 30 * 24 * 60 * 60
        this.stmt.hashrate_clean.run({ timestamp: thirty_day })
        this.stmt.network_hashrate_clean.run({ timestamp: thirty_day })
        this.stmt.network_blocks_clean.run({ timestamp: one_day })
    }

    getHashrates() {
        const dateNow = Date.now() / 1000

        let graphs = {
            solo: {},
            network: {}
        }

        // Initialize empty graph
        const start_of_one_hour = dateNow - (dateNow % (60 * 60))
        for(let j = start_of_one_hour - 30 * 24 * 60 * 60; j <= start_of_one_hour; j += 60 * 60) {
            graphs.solo[j] = 0
            graphs.network[j] = 0
        }

        // fetch stats from db
        for(const h of this.stmt.hashrate.all()) {
            if(h.timestamp) {
                graphs.solo[h.timestamp] = h.hashes
            }
        }
        for(const h of this.stmt.network_hashrate.all()) {
            if(h.timestamp) {
                graphs.network[h.timestamp] = h.hashes
            }
        }

        // calculate empty points
        for(const timestamp in graphs.solo) {
            if(graphs.solo[timestamp] == 0) {
                const hashes = this.calcHashrate(24 * 60 * 60, timestamp, false)
                this.stmt.hashrate_add.run({ timestamp, hashes })
                graphs.solo[timestamp] = hashes
            }
        }
        for(const timestamp in graphs.network) {
            if(graphs.network[timestamp] == 0) {
                const hashes = this.calcHashrate(60 * 60, timestamp, true)
                this.stmt.network_hashrate_add.run({ timestamp, hashes })
                graphs.network[timestamp] = hashes
            }
        }

        return graphs
    }

    calcHashrate(n_time = 86400, end_time = false, network = false) {
        if(!end_time) {
            end_time = Date.now() / 1000
        }
        end_time = parseInt(end_time)
        const start_time = end_time - n_time

        let hashes
        if(network) {
            hashes = this.stmt.network_hashrate_calc.get({ start_time, end_time }).hashes
        } else {
            hashes = this.stmt.hashrate_calc.get({ start_time, end_time }).hashes
        }
        if(hashes == null) {
            hashes = 0
        }


        return Math.round(100 * hashes / n_time) / 100
    }

    addNetworkBlock(block_header) {
        const { height, difficulty, timestamp } = block_header
        this.stmt.network_blocks_add.run({
            height,
            difficulty,
            timestamp
        })
    }

    addBlock(block_header) {
        const { hash, txid, height, difficulty, nonce, reward, timestamp, major_version, minor_version } = block_header
        this.stmt.blocks_add.run({
            hash,
            txid,
            height,
            difficulty,
            nonce,
            reward,
            timestamp,
            version: `${major_version}.${minor_version}`,
            status: 0
        })
    }
}
