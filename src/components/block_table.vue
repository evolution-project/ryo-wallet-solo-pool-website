<template>
<div>
<q-table
    class="blockTable"
    row-key="hash"
    :data="blocks"
    :columns="cols_blocks"
    selection="none"
    :dark="theme=='dark'"
    :rows-per-page-options="pagination_blocks_options"
    :pagination.sync="pagination_blocks"
    dense
    >
    <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer" @click.native="showBlockDetails(props.row)">
        <q-td key="status" :props="props">
            <template v-if="props.row.status == 0">
                <q-icon name="lock" />
                <q-tooltip anchor="center right" self="center left" :offset="[5, 0]">
                    Pending ({{ props.row.height + 60 - pool.network_stats.lastBlock.height }} to go)
                </q-tooltip>
            </template>
            <template v-if="props.row.status == 1">
                <q-icon class="iconOrphaned" name="close" />
                <q-tooltip anchor="center right" self="center left" :offset="[5, 0]">
                    Orphaned
                </q-tooltip>
            </template>
            <template v-if="props.row.status == 2">
                <q-icon name="check" />
                <q-tooltip anchor="center right" self="center left" :offset="[5, 0]">
                    Confirmed
                </q-tooltip>
            </template>
        </q-td>
        <q-td key="hash" :props="props" auto-width>
            <div class="monospace ellipsis text-weight-bold">{{ props.row.hash }}</div>
        </q-td>
        <q-td key="height" :props="props">{{ props.row.height }}</q-td>
        <q-td key="timestamp" :props="props">
            <div class="ellipsis">{{ props.row.timestamp | mul1000 | date }}</div>
        </q-td>
        <q-td key="reward" :props="props">
            <template v-if="props.row.reward == -1">
                <q-icon name="access_time" /> Waiting...
            </template>
            <template v-else>
                <FormatRyo :amount="props.row.reward" />
            </template>
        </q-td>
        <q-td key="version" :props="props">
            <div>{{ props.row.version }}</div>
        </q-td>
    </q-tr>
</q-table>


<q-modal maximized v-model="modals.block">

    <q-modal-layout>
        <q-toolbar slot="header" color="dark" inverted>
            <q-btn flat round dense @click="modals.block = false" icon="reply" />
            <q-toolbar-title>
                Block {{ block.height }}
            </q-toolbar-title>
            <q-btn color="primary" @click="openExplorer(block.hash)" label="View on explorer" />
        </q-toolbar>


        <div class="q-px-md q-pb-md poolDashboard">

            <div class="row gutter-sm q-mt-none">
                <div class="col">
                    <div class="infoBox" style="height: 105px">
                        <div class="infoBoxContent">
                            <div class="text"><span>Mined To</span></div>
                            <div class="value">
                                <q-item class="q-px-none">
                                    <q-item-side>
                                        <div class="identicon"></div>
                                    </q-item-side>
                                    <q-item-main>
                                        <q-item-tile label>Anonymous</q-item-tile>
                                        <q-item-tile sublabel>Solo mined blocks are never associated with a Ryo address</q-item-tile>
                                    </q-item-main>
                                </q-item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row gutter-sm q-mt-xs">
            </div>

            <div class="row gutter-sm q-mt-xs">
                <div class="col">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text">Block Height<span></span></div>
                            <div class="value">{{ block.height | commas }}<span></span></div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text">Block Difficulty<span></span></div>
                            <div class="value">{{ block.difficulty | commas }}<span></span></div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Block Reward</span></div>
                            <div class="value">
                                <span>
                                    <template v-if="block.reward == -1">
                                        <q-icon name="access_time" /> Waiting...
                                    </template>
                                    <template v-else>
                                        <FormatRyo :amount="block.reward" />
                                    </template>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row gutter-sm q-mt-xs">
                <div class="col">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Block Status</span></div>
                            <div class="value">
                                <span v-if="block.status == 0">
                                    Pending
                                </span>
                                <span v-if="block.status == 1">
                                    Orphaned
                                </span>
                                <span v-if="block.status == 2">
                                    Confirmed
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Unlock Time</span></div>
                            <div class="value">
                                <span v-if="block.status == 0">
                                    {{ block.height + 60 - pool.network_stats.lastBlock.height }} to go
                                </span>
                                <span v-if="block.status == 1">
                                    N/A
                                </span>
                                <span v-if="block.status == 2">
                                    N/A
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Time Found</span></div>
                            <div class="value"><span>{{ block.timestamp | mul1000 | date }}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row gutter-sm q-mt-xs">
                <div class="col">
                    <div class="infoBox">
                        <div class="infoBoxContent">
                            <div class="text"><span>Block Hash</span></div>
                            <div class="value monospace ellipsis"><small>{{ block.hash }}</small></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </q-modal-layout>
</q-modal>
</div>
</template>

<script>
import { mapState } from "vuex"
import { filters } from "../mixins/filters.js"
import FormatRyo from "../components/format_ryo"
export default {
    name: "BlockTable",
    props: {
        blocks: {
            default: []
        },
        extended: {
            default: true
        }
    },
    computed: {
        ...mapState({
            theme: state => state.gateway.app.config.appearance.theme,
            pool: state => state.gateway.pool,
        }),
    },
    methods: {
        showBlockDetails(block) {
            this.block = block
            this.modals.block = true
        },
        openExplorer(hash) {
            this.$gateway.send("core", "open_explorer", {type: "block", id: hash})
        },
    },
    created() {
        if(!this.extended) {
            this.pagination_blocks_options = [15]
            this.pagination_blocks.rowsPerPage = 15
        }
    },

    data () {
        return {
            modals: {
                block: false
            },
            block: {
                hash: "",
                height: 0,
                reward: 0,
                timestamp: 0,
                difficulty: 1,
                status: 0,
                version: ""
            },
            cols_blocks: [
                {
                    name: "status",
                    field: "status",
                    label: "",
                    sortable: false,
                    style: "width: 24px"
                },
                {
                    required: true,
                    name: "hash",
                    field: "hash",
                    label: "Block Hash",
                    align: "left",
                    sortable: false
                },
                {
                    name: "height",
                    field: "height",
                    label: "Height",
                    sortable: true,
                    style: "width: 100px"
                },
                {
                    name: "timestamp",
                    field: "timestamp",
                    label: "Time Found",
                    sortable: true,
                    style: "width: 180px"
                },
                {
                    name: "reward",
                    field: "reward",
                    label: "Reward",
                    sortable: true,
                    style: "width: 100px"
                },
                {
                    name: "version",
                    field: "version",
                    label: "Version",
                    sortable: true,
                    style: "width: 70px"
                },
            ],
            pagination_blocks: {
                sortBy: "height",
                descending: true,
                page: 1,
                rowsPerPage: 25
            },
            pagination_blocks_options: [25, 50, 100]
        }
    },
    mixins: [filters],
    components: {
        FormatRyo
    }
}
</script>

<style>
</style>
