<template>
<q-page>
    <div class="q-pa-md">
        <h6 class="text-weight-light q-mt-xs q-mb-md">Worker Statistics</h6>

        <div v-if="worker.account.address == ''">

            <p>Enter your public Ryo address and private viewkey and we will scan the solo-mined blocks to check which ones are yours. You will be able to see your estimated hashrate, total amount mined, including pending and unlocked funds. You may select "Remember me" in order to save your address and viewkey to the local browser storage.</p>

            <p><strong>Important:</strong> This feature only works if you have selected "Privately Share Hashrate" in Atom.</p>

            <p><strong>Important:</strong> Your viewkey will be sent to the server.</p>

            <q-field>
                <q-input
                    v-model="wallet.address"
                    float-label="Wallet address"
                    @blur="$v.wallet.address.$touch"
                    :error="$v.wallet.address.$error"
                    :dark="theme=='dark'"
                    />
            </q-field>

            <q-field>
                <q-input
                    v-model="wallet.viewkey"
                    float-label="Private viewkey"
                    @blur="$v.wallet.viewkey.$touch"
                    :error="$v.wallet.viewkey.$error"
                    :dark="theme=='dark'"
                    />
            </q-field>

            <div class="row q-mt-lg gutter-x-md items-center">
                <div class="col-auto">
                    <q-field>
                        <q-btn color="primary" @click="check_stats" label="Check stats" />
                    </q-field>
                </div>
                <div class="col">
                    <q-field>
                        <q-checkbox v-model="wallet.save" label="Remember me" :dark="theme=='dark'" />
                    </q-field>
                </div>
            </div>

            <q-inner-loading :visible="worker.status != 0" :dark="theme=='dark'">
                <q-spinner color="primary" :size="30" />
            </q-inner-loading>

        </div>
        <div v-else>

            <div class="row gutter-x-sm items-center">
                <div class="col-auto">
                    <Identicon :address="worker.account.address" ref="identicon" />
                </div>
                <div class="col">
                    <div class="monospace ellipsis">
                        {{ worker.account.address }}
                    </div>
                </div>
                <div class="col-auto" v-if="worker.account.scan_height < pool.stats.lastBlock.height">
                    <small>
                        <q-spinner color="primary" :size="10" /> Loading... This may take a few minutes.
                    </small>
                </div>
                <div class="col-auto">
                    <q-btn flat size="sm" label="forget this address" @click="clear_stats" />
                </div>
            </div>

            <div class="row gutter-sm q-mt-md">
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Estimated Solo Hashrate</span></div>
                            <div class="value"><span>{{ current_hashrate | hashrate }}</span></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Blocks Found Every</span></div>
                            <div class="value"><span>{{ block_time | time }}</span></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Last Block Found</span></div>
                            <div class="value"><span>{{ last_block_timestamp }}</span></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Blocks Found</span></div>
                            <div class="value"><span>{{ worker.blocks.length | commas }}</span></div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Total Rewards</span></div>
                            <div class="value"><FormatRyo :amount="block_stats.total_rewards" /></span></div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Unlocked Rewards</span></div>
                            <div class="value"><FormatRyo :amount="block_stats.unlocked_rewards" /></span></div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Locked Rewards</span></div>
                            <div class="value"><FormatRyo :amount="block_stats.locked_rewards" /></span></div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-md-3">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Orphaned Blocks</span></div>
                            <div class="value">{{ block_stats.orphaned | commas }}</span></div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="q-pa-md">
                <h6 class="text-weight-light q-mt-xs q-mb-lg">Estimated Solo Mining Hashrate (30 days)</h6>
                <hashrate-chart :chart-data="hashrate_data"></hashrate-chart>
            </div>

            <h6 class="text-weight-light q-mb-md">Blocks Found</h6>
            <BlockTable :blocks="worker.blocks" :extended="false" />

        </div>

    </div>
</q-page>
</template>

<style>
</style>

<script>
import { required, numeric } from "vuelidate/lib/validators"
import { privkey, address } from "src/validators/common"
import { mapState } from "vuex"
import { filters } from "../mixins/filters.js"
import BlockTable from "../components/block_table"
import FormatRyo from "../components/format_ryo"
import Identicon from "../components/identicon"
import HashrateChart from "../components/hashrate_chart"
export default {
    computed: {
        block_stats() {
            let data = {
                total_rewards: 0,
                unlocked_rewards: 0,
                locked_rewards: 0,
                orphaned: 0
            }
            for(const block of this.worker.blocks) {
                let reward = block.reward == -1 ? 0 : block.reward
                switch(block.status) {
                    case 0:
                        data.total_rewards += reward
                        data.locked_rewards += reward
                        break
                    case 1:
                        data.orphaned++
                        break
                    case 2:
                        data.total_rewards += reward
                        data.unlocked_rewards += reward
                        break
                }
            }
            return data
        },
        last_block_timestamp() {
            if(this.worker.blocks.length) {
                return this.$options.filters.distanceInWords(this.$options.filters.mul1000(this.worker.blocks[0].timestamp))
            }
        },
        current_hashrate() {
            return this.hashrate_data.datasets[0].data[this.hashrate_data.datasets[0].data.length - 1]
        },
        block_time() {
            if(this.current_hashrate === 0) {
                return null
            }
            return Math.round(1000 * 240 * this.pool.network_stats.hashrate / this.current_hashrate)
        },
        hashrate_data() {
            const dateNow = Date.now() / 1000

            let labels = []
            let data = []

            const start_of_one_hour = dateNow - (dateNow % (60 * 60))
            for(let j = start_of_one_hour - 30 * 24 * 60 * 60; j <= start_of_one_hour; j += 60 * 60) {
                labels.push(1000 * j)

                const k = j - 7 * 24 * 60 * 60

                let val = 0
                for(const block of this.worker.blocks) {
                    if(k < block.timestamp && block.timestamp < j) {
                        val += block.difficulty
                    }
                }
                val = Math.round(val / (j - k))
                data.push(val)
            }

            return {
                labels,
                datasets: [
                    {
                        data
                    }
                ]
            }
        },
        ...mapState({
            theme: state => state.gateway.app.config.appearance.theme,
            pool: state => state.gateway.pool,
            worker: state => state.gateway.worker,
        }),
    },
    validations: {
        wallet: {
            address: { required, address },
            viewkey: { required, privkey },
        }
    },
    data () {
        return {
            stats: false,
            loading: false,
            wallet: {
                save: false,
                address: "",
                viewkey: ""
            }
        }
    },
    methods: {
        check_stats() {
            this.$v.wallet.$touch()

            if(this.$v.wallet.address.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: "Invalid public address"
                })
                return
            }

            if(this.$v.wallet.viewkey.$error) {
                this.$q.notify({
                    type: "negative",
                    timeout: 1000,
                    message: "Invalid private viewkey"
                })
                return
            }

            this.worker.status = 1

            this.$gateway.send("core", "set_wallet", this.wallet)
        },

        clear_stats() {
            this.$gateway.send("core", "unset_wallet")
        }

    },
    mixins: [filters],
    components: {
        FormatRyo,
        HashrateChart,
        BlockTable,
        Identicon
    }
}
</script>
