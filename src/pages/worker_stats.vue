<template>
<q-page>
    <div class="q-pa-md">
        <h6 class="text-weight-light q-mt-xs q-mb-md">Worker Statistics</h6>

        <div v-if="worker.account.address == ''">

            <p>Enter your public Ryo address and private viewkey and we will scan the solo-mined blocks to check which ones are yours. You will be able to see your estimated hashrate, total amount mined, including pending and unlocked funds. You may select "Remember me" in order to save your address and viewkey to the local browser storage.</p>

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

            <h6 class="text-weight-light q-mb-md">Blocks Found</h6>

            <BlockTable :blocks="worker.blocks" :extended="false" />

        </div>


        <h6 class="text-weight-light q-mb-md">Debug</h6>
        <pre>{{ worker }}</pre>


    </div>
</q-page>
</template>

<style>
</style>

<script>
import { required, numeric } from "vuelidate/lib/validators"
import { privkey, address } from "src/validators/common"
import { mapState } from "vuex"
import BlockTable from "../components/block_table"
import Identicon from "../components/identicon"
export default {
    computed: {
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
    components: {
        BlockTable,
        Identicon
    }
}
</script>
