<template>
<q-page>
    <div class="q-pa-md getting-started">
        <h6 class="text-weight-light q-mt-xs q-mb-md">Getting Started</h6>

        <p>Solo mining with Evolution Electron is an easy process. First, download and install <a href="https://github.com/evolution-project/evolution-electron-wallet/releases/latest" target="_blank">Evolution Electron</a> version 1.1.0 or higher.</p>

        <p><strong>Important:</strong> You must use either the Local+Remote or Local Only daemon type and have a fully synced blockchain.</p>
        <p><strong>Important:</strong> Make sure you are hashing the correct algo, RandomARQ, when mining to the solo pool. Shares will not be validated and incorrect algo will result in rejected blocks.</p>

        <h6 id="help" class="text-weight-light q-mt q-mb-md">Getting Help</h6>
        <p>If you have any questions about solo mining with Atom, join one of our social media platforms:</p>

        <p>
            <a target="_blank" href="https://twitter.com/Evolution_EvoX">Twitter</a> |
    <!--        <a target="_blank" href="https://chat.arqma.com">Discord</a>    -->
        </p>

        
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
            color="primary"
            fab
            v-back-to-top.animate="{offset: 500, duration: 200}"
            class="animate-pop"
            >
            <q-icon name="keyboard_arrow_up" />
        </q-btn>
    </q-page-sticky>
</q-page>
</template>

<style>
</style>

<script>
import { scroll } from "quasar"
const { getScrollTarget, setScrollPosition } = scroll
export default {
    methods: {
        scrollTo (e) {
            const href = e.target.href.split("#").pop()
            const ele = document.getElementById(href)
            const target = getScrollTarget(ele)
            const offset = ele.offsetTop - ele.scrollHeight
            const duration = 100
            setScrollPosition(target, offset, duration)
        }
    }
}
</script>
