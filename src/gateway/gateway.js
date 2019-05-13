import { openURL, AddressbarColor, Notify, LocalStorage } from "quasar"
import { Howl, Howler } from "howler"
import axios from "axios"

const config = require("../../config.json")
const explorer_url = config[config.network].explorer_url
const api_url = config[config.network].api_url

export class Gateway {

    constructor(app, router) {

        this.app = app
        this.router = router

        AddressbarColor.set("#63c9f3")

        this.dingSound = new Howl({
            src: ["/statics/ding.mp3"]
        })

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
                if(this.myBlocks.includes(block.hash)) {
                    this.dingSound.play()
                    Notify.create({
                        type: "positive",
                        timeout: 2000,
                        message: `You found block at height ${block.height}`
                    })
                } else {
                    Notify.create({
                        type: "positive",
                        timeout: 2000,
                        message: `Solo miner found block at height ${block.height}`
                    })
                }
            }
            numBlocks = blocks.length
        })

        this.wallet = LocalStorage.has("wallet") ? LocalStorage.get.item("wallet") : {}
        this.myBlocks = []

    }

    getStats() {
        axios.get(`${api_url}/`).then(response => {
            if(response.status == 200 && response.hasOwnProperty("data")) {
                const response_stats = response.data
                if(this.wallet.hasOwnProperty("address") && this.wallet.hasOwnProperty("viewkey")) {
                    const { address, viewkey } = this.wallet
                    axios.get(`${api_url}/account/${address}/${viewkey}`).then(response => {
                        if(response.status == 200 && response.hasOwnProperty("data")) {
                            if(response.data.error) {
                                this.send("core", "show_notification", {
                                    type: "negative",
                                    message: response.data.error.message
                                })
                                this.app.store.commit("gateway/set_worker_data", { status: 0 })
                            } else {
                                this.myBlocks = response.data.blocks.map(block => block.hash)
                                this.app.store.commit("gateway/set_worker_data", {
                                    ...response.data,
                                    quick_blocks: this.myBlocks,
                                    status: 0
                                })
                            }
                        }
                        this.app.store.commit("gateway/set_pool_data", response_stats)
                    }).catch(error => {
                        this.app.store.commit("gateway/set_worker_data", { status: 0 })
                        this.app.store.commit("gateway/set_pool_data", response_stats)
                        console.log(`API error - ${api_url}`)
                        console.log(error)
                    })
                } else {
                    this.app.store.commit("gateway/set_pool_data", response_stats)
                }
            }
        }).catch(error => {
            this.app.store.commit("gateway/set_worker_data", { status: 0 })
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

            case "unset_wallet":
                if(LocalStorage.has("wallet")) {
                    LocalStorage.remove("wallet")
                }
                this.wallet = {}
                this.myBlocks = []
                this.app.store.commit("gateway/set_worker_data", {
                    status: 0,
                    account: {
                        address: "",
                        scan_height: 0,
                    },
                    blocks: [],
                    quick_blocks: [],
                })

                break

            case "set_wallet":
                if(params.save) {
                    LocalStorage.set("wallet", params)
                }
                this.wallet = params
                this.getStats()

                break

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
