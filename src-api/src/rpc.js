import request from "request-promise"

const daemon_path = "http://127.0.0.1:12211"

export async function getInfo() {
    let options = {
        uri: `${daemon_path}/json_rpc`,
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
        uri: `${daemon_path}/json_rpc`,
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
