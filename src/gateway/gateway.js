import { openURL, AddressbarColor, Notify, LocalStorage } from "quasar"
import axios from "axios"

const config = require("../../config.json")
const explorer_url = config[config.network].explorer_url
const api_url = config[config.network].api_url

export class Gateway {

    constructor(app, router) {

        this.app = app
        this.router = router

        AddressbarColor.set("#63c9f3")

        const theme = LocalStorage.has("theme") ? LocalStorage.get.item("theme") : "dark"
        this.app.store.commit("gateway/set_app_data", {
            config: {
                appearance: {
                    theme
                }
            }
        })
        this.app.store.watch( state => state.gateway.app.config.appearance.theme, (theme) => {
            LocalStorage.set("theme", theme)
        })


        const refreshInterval = 120
        setInterval(() => this.getStats(), refreshInterval * 1000)
        this.getStats()

        let numBlocks = null
        this.app.store.watch( state => state.gateway.pool.blocks, (blocks) => {
            if(numBlocks != null && blocks.length != numBlocks) {
                const block = blocks[0]
                Notify.create({
                    type: "positive",
                    timeout: 2000,
                    message: `Solo miner found block at height ${block.height}`
                })
            }
            numBlocks = blocks.length
        })

    }

    getStats() {
        axios.get(api_url).then(response => {
            if(response.status == 200 && response.hasOwnProperty("data")) {
                this.app.store.commit("gateway/set_pool_data", response.data)
            }
        }).catch(error => {
            console.log(`API error - ${api_url}`)
            console.log(error)
        })
    }

    send(module, method, data={}) {
        let message = {
            module,
            method,
            data
        }
        this.handle(message)
    }

    handle(message) {

        let params = message.data

        switch (message.method) {

            case "show_notification":
                let notification = {
                    type: "positive",
                    timeout: 1000,
                    message: ""
                }
                Notify.create(Object.assign(notification, params))
                break

            case "open_explorer":
                if(params.type == "tx") {
                    openURL(`${explorer_url}/tx/${params.id}`)
                } else if(params.type == "block") {
                    openURL(`${explorer_url}/block/${params.id}`)
                }
                break

            case "open_url":
                openURL(params.url)
                break

        }
    }
}
