import request from "request-promise"

const config = require("../../config.json")
const daemon_url = config[config.network].daemon_url
const explorer_api_url = config[config.network].explorer_api_url


export async function getInfo() {
    let options = {
        uri: `${daemon_url}/json_rpc`,
        method: "POST",
        json: {
            jsonrpc: "2.0",
            method: "get_info"
        }
    }
    return await request(options)
}


export async function getBlock(height=0) {
    let options = {
        uri: `${daemon_url}/json_rpc`,
        method: "POST",
        json: {
            jsonrpc: "2.0",
            method: "get_block",
            params: {
                height
            }
        }
    }
    return await request(options)
}

export async function decodeOutputs(txid, address, viewkey) {
    let options = {
        uri: `${explorer_api_url}/outputs?txhash=${txid}&address=${address}&viewkey=${viewkey}&txprove=0`,
        json: true
    }
    return await request(options)
}
