import request from "request-promise"

const config = require("../../config.json")
const daemon_url = config[config.network].daemon_url

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
