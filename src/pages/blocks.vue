<template>
<q-page>
    <div class="q-pa-md">

        <h6 class="text-weight-light q-mt-xs q-mb-md">Blocks Found</h6>

        <BlockTable :blocks="pool.blocks" />

    </div>
</q-page>
</template>

<style>
</style>

<script>
import { mapState } from "vuex"
import BlockTable from "../components/block_table"
export default {
    computed: {
        ...mapState({
            theme: state => state.gateway.app.config.appearance.theme,
            pool: state => state.gateway.pool,
        }),
    },
    components: {
        BlockTable
    }
}
</script>
