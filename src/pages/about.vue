<template>
<q-page>
    <div class="q-pa-md">
        <h6 class="text-weight-light q-mt-xs q-mb-md">Debug</h6>
        <pre>{{ worker }}</pre>
    </div>
</q-page>
</template>

<style>
</style>

<script>
import { mapState } from "vuex"
export default {
    computed: {
        ...mapState({
            theme: state => state.gateway.app.config.appearance.theme,
            pool: state => state.gateway.pool,
            worker: state => state.gateway.worker,
        }),
    }
}
</script>
