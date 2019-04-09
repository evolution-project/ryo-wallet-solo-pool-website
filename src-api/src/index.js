import { regex_address, regex_viewkey } from "./utils"
import { getInfo, getBlock } from "./rpc"
import { Database } from "./database"

import ryo_utils_promise from "ryo-core-js/dist/ryo_utils"
import * as ryo_utils_nettype from "ryo-core-js/dist/ryo_utils_nettype"

const fastify = require("fastify")()
const database = new Database()

const config = require("../../config.json")
const api_port = config[config.network].api_port
const initial_start_height = config[config.network].start_height
const refresh_interval = config[config.network].refresh_interval * 1000


let stats = {}


let nettype = ryo_utils_nettype.network_type.MAINNET
if(config.network == "testnet") {
    nettype = ryo_utils_nettype.network_type.TESTNET
}

let core_bridge = false
ryo_utils_promise.then(_core_bridge => {
    core_bridge = _core_bridge
})


fastify.register(require("fastify-cors"), {
    origin: "*"
})

fastify.get("/", async (request, reply) => {
    return stats
})

fastify.get("/account/:address/:viewkey", async (request, reply) => {
    const { address, viewkey } = request.params
    try {
        if(!regex_address.test(address)) {
            console.log("Invalid address login")
            return { error: { message: "Invalid address" } }
        }
        if(!regex_viewkey.test(viewkey)) {
            console.log("Invalid viewkey login")
            return { error: { message: "Invalid viewkey" } }
        }

        let account = database.getUserAccount(address, viewkey)
        let blocks = []

        if(!account) {
            const decoded_address = core_bridge.decode_address(address, nettype)
            const sec_viewkey = core_bridge.secret_key_to_public_key(viewkey)
            if(sec_viewkey != decoded_address.view) {
                return { error: { message: "Viewkey does not match address" } }
            }

            database.createUserAccount(address, viewkey)

            account = { address, scan_height: 0 }

        } else {
            delete account.viewkey
            blocks = database.getUserBlocks(address)
        }

        return { account, blocks }


    } catch(error) {
        console.log(`Error with /account/ API ${error.message}`)
        return { error: { message: "Error fetching account" } }
    }

})

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function checkBlocks(start, end) {
    for(let i = start; i < end; i++) {
        try {
            const block = await getBlock(i)
            if(block.hasOwnProperty("error")) {
                throw block.error
            }


            const json = JSON.parse(block.result.json)

            const miner_extra = json.miner_tx.extra
            const is_solo_block = miner_extra.length == 36 && miner_extra[33] == 2 && miner_extra[34] == 1

            let block_header = block.result.block_header

            block_header.txid = block.result.miner_tx_hash
            block_header.reward = json.miner_tx.vout[0].amount

            database.addNetworkBlock(block_header)

            if(is_solo_block) {
                database.addBlock(block_header)
            }
        } catch(error) {
            console.log(error.message)
            return false
         }
    }
    return true
}

async function loop() {
    try {
        const settings = database.getSettings()

        const info = await getInfo()
        if(info.hasOwnProperty("error")) {
            console.log(info.error)
            await timeout(refresh_interval)
            return
        }

        let start_height = parseInt(settings.height)
        let end_height = parseInt(info.result.height)

        if(start_height == -1) {
            start_height = initial_start_height
        }

        end_height = Math.min(start_height + 360, end_height)

        if(start_height == end_height) {
            console.log("Collecting stats...")
            stats = await database.heartbeat()
            console.log("Collecting stats... done")
            database.cleanStats()
            await timeout(refresh_interval)
        } else {
            database.begin()
            console.log(`Scanning ${start_height} to ${end_height}`)

            const result = await checkBlocks(start_height, end_height)
            if(result) {
                database.commit()
                database.setSettings("height", end_height)
            } else {
                database.rollback()
            }
        }

    } catch(error) {
        console.log(error.message || error)
        await timeout(refresh_interval)
    }

}

(async function() {
    try {
        await fastify.listen(api_port)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch(error) {
        fastify.log.error(error)
        process.exit(1)
    }
    do {
        await loop()
    } while(true)
})()
