import { AddressbarColor, Notify, LocalStorage } from "quasar"
import axios from "axios"

export class Gateway {

    constructor(app, router) {

        this.apiEndpoint = "http://localhost:8117"

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
        axios.get(this.apiEndpoint).then(response => {
            if(response.status == 200 && response.hasOwnProperty("data")) {
                this.app.store.commit("gateway/set_pool_data", response.data)
            }
        }).catch(error => {
            console.log(`API error - ${this.apiEndpoint}`)
            console.log(error)
        })
    }

}
