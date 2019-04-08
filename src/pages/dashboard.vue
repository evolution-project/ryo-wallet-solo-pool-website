<template>
<q-page>
    <div class="q-pa-md">
        <div class="row gutter-sm">
            <div class="col">
                <div class="infoBox">
                    <div class="infoBoxContent">
                        <div class="text"><span>Estimated Solo Hashrate</span></div>
                        <div class="value"><span>{{ pool.stats.hashrate | hashrate }}</span></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="infoBox">
                    <div class="infoBoxContent">
                        <div class="text"><span>Blocks Found Every</span></div>
                        <div class="value"><span>{{ pool.stats.blockTime | mul1000 | time }}</span></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="infoBox">
                    <div class="infoBoxContent">
                        <div class="text"><span>Last Block Found</span></div>
                        <div class="value"><span>{{ pool.stats.lastBlock.timestamp | mul1000 | distanceInWords }}</span></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="infoBox">
                    <div class="infoBoxContent">
                        <div class="text"><span>Blocks Found</span></div>
                        <div class="value"><span>{{ pool.stats.blocksFound | commas }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row gutter-sm">
            <div class="col">
                <div class="infoBox">
                    <div class="infoBoxContent">
                        <div class="text"><span>Network Hashrate</span></div>
                        <div class="value"><span>{{ pool.network_stats.hashrate | hashrate }}</span></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="infoBox">
                    <div class="infoBoxContent">
                        <div class="text"><span>Network Difficulty</span></div>
                        <div class="value"><span>{{ pool.network_stats.diff | commas }}</span></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="infoBox">
                    <div class="infoBoxContent">
                        <div class="text"><span>Network Height</span></div>
                        <div class="value"><span>{{ pool.network_stats.lastBlock.height | commas }}</span></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="infoBox">
                    <div class="infoBoxContent">
                        <div class="text"><span>Solo Mining Fee</span></div>
                        <div class="value"><span>0%</span></div>
                    </div>
                </div>
            </div>
        </div>

    </div>


    <div class="q-pa-md">
        <h6 class="text-weight-light q-mt-xs q-mb-lg">Estimated Solo Mining Hashrate (30 days)</h6>
        <hashrate-chart :chart-data="solo_hashrate_data"></hashrate-chart>
    </div>

    <div class="q-pa-md">
        <h6 class="text-weight-light q-mt-xs q-mb-lg">Network Hashrate (30 days)</h6>
        <hashrate-chart :chart-data="network_hashrate_data"></hashrate-chart>
    </div>


</div>
</q-page>
</template>

<style>
</style>

<script>
import { mapState } from "vuex"
import { filters } from "../mixins/filters.js"
import HashrateChart from "../components/hashrate_chart"
export default {
    computed: {
        ...mapState({
            theme: state => state.gateway.app.config.appearance.theme,
            pool: state => state.gateway.pool,
        }),
        solo_hashrate_data: function() {
            let labels = []
            let data = {}

            Object.keys(this.pool.hashrate.solo).map(key => {
                labels.push(key*1000)
            })

            data = Object.values(this.pool.hashrate.solo)

            return {
                labels,
                datasets: [
                    {
                        data
                    }
                ]
            }
        },
        network_hashrate_data: function() {
            let labels = []
            let data = {}

            Object.keys(this.pool.hashrate.network).map(key => {
                labels.push(key*1000)
            })

            data = Object.values(this.pool.hashrate.network)

            return {
                labels,
                datasets: [
                    {
                        data
                    }
                ]
            }
        },
    },
    mixins: [filters],
    components: {
        HashrateChart
    }
}
</script>
