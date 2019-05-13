<template>
<q-page>
    <div class="q-pa-md getting-started">
        <h6 class="text-weight-light q-mt-xs q-mb-md">Getting Started</h6>

        <p>Solo mining with Ryo Wallet Atom is an easy process. First, download and install <a href="https://github.com/ryo-currency/ryo-wallet/releases/latest" target="_blank">Ryo Wallet Atom</a> version 1.3.1 or higher.</p>

        <p><strong>Important:</strong> You must use either the Local+Remote or Local Only daemon type and have a fully synced blockchain.</p>
        <p><strong>Important:</strong> Make sure you are hashing the correct algo, Cryptonight-GPU, when mining to the solo pool. Shares will not be validated and incorrect algo will result in rejected blocks.</p>

        <h6 class="text-weight-light q-mt q-mb-md">Quick Start</h6>
        <p>
            <ul>
                <li><a @click.prevent="scrollTo" href="#create-new-wallet">Create a new Wallet</a></li>
                <li><a @click.prevent="scrollTo" href="#open-solo-pool">Open Solo Pool Dashboard</a></li>
                <li><a @click.prevent="scrollTo" href="#configure-solo-pool">Configure Solo Pool</a></li>
                <li><a @click.prevent="scrollTo" href="#advanced-network">Advanced Network Settings</a></li>
                <li><a @click.prevent="scrollTo" href="#privately-share-hashrate">Privately Sharing Your Hashrate</a></li>
                <li><a @click.prevent="scrollTo" href="#vardiff">Variable Difficulty Settings</a></li>
                <li><a @click.prevent="scrollTo" href="#connecting-miners">Connecting Your Miners</a></li>
                <li><a @click.prevent="scrollTo" href="#mined-blocks">Viewing Mined Blocks</a></li>
                <li><a @click.prevent="scrollTo" href="#help">Getting Help</a></li>
            </ul>
        </p>

        <h6 id="create-new-wallet" class="text-weight-light q-mt q-mb-md">Create a new Wallet</h6>

        <p>If you have not ever used Ryo Wallet Atom, create a new wallet. If you already have a wallet, you can skip this step. While not necessary, it is recommended to use a dedicated wallet for solo mining. In case you choose to use the worker statistics option on this webpage, you will need to send your viewkey to this server.</p>

        <p><img src="/statics/screenshots/01-welcome.png" /></p>
        <p><img src="/statics/screenshots/02-create-wallet.png" /></p>
        <p><img src="/statics/screenshots/03-confirm-wallet.png" /></p>

        <h6 id="open-solo-pool" class="text-weight-light q-mt q-mb-md">Open Solo Pool Dashboard</h6>
        <p>After creating your wallet for mining, use the menu icon in the top left and select "Solo Mining".</p>
        <p><img src="/statics/screenshots/04-solo-mining.png" /></p>

        <h6 id="configure-solo-pool" class="text-weight-light q-mt q-mb-md">Configure Solo Pool</h6>
        <p>Once your blockchain is synced, you can configure the pool for solo mining. Select "Enable Solo Mining" and select the address you want your mining rewards to go to. Press "Apply settings" and your solo pool will start.</p>
        <p><img src="/statics/screenshots/05-dashboard.png" /></p>

        <h6 id="advanced-network" class="text-weight-light q-mt q-mb-md">Advanced Network Settings</h6>
        <p>By default, the solo pool will only allow connections from the machine you are running it on. If you want to mine from other computers within your network, choose "Local network only" in the Bind IP option. If you want to be able to mine from outside your network, choose "All interfaces" and set up port forwarding on your router. You can also change the port that the pool will listen to, default is port 3333.</p>

        <h6 id="privately-share-hashrate" class="text-weight-light q-mt q-mb-md">Privately Sharing Your Hashrate</h6>
        <p>If this option is enabled, the solo pool will construct blocks in such a way that can be detected by this webpage. No private information will be sent to a central server, and an outside observer will not be able to detect <em>who</em> mined the block, only that some solo miner mined it. It is recommended that you choose this option, but it is disabled by default. Enabling this option allows the network to determine how much "unknown" hashrate is actually solo miners. With this option enabled you will also be able to use the "Worker Statistics" feature on this webpage.</p>
        <p><img src="/statics/screenshots/06-private-share.png" /></p>


        <h6 id="vardiff" class="text-weight-light q-mt q-mb-md">Variable Difficulty Settings</h6>
        <p>This is an advanced option that allows you to control the difficulty of work sent to your miners. The default options will work for all miners, but advanced users may tweak them specifically for their rigs. These settings will have no effect on how often you find blocks.</p>
        <p><img src="/statics/screenshots/07-vardiff.png" /></p>


        <h6 id="connecting-miners" class="text-weight-light q-mt q-mb-md">Connecting Your Miners</h6>
        <p>Now that your solo pool is configured, you must point your miners to Atom. Click on the "Workers" tab in Atom, and at the bottom will be an example config for xmr-stak. The only required change is to switch the pool host to the IP address of your machine. Start your mining software and it should connect to the solo pool and start submitting shares.</p>
        <p><img src="/statics/screenshots/08-xmr-stak.png" /></p>
        <p><img src="/statics/screenshots/08-xmr-stak-console.png" /></p>
        <p><img src="/statics/screenshots/09-worker-stats.png" /></p>


        <h6 id="mined-blocks" class="text-weight-light q-mt q-mb-md">Viewing Mined Blocks</h6>
        <p>When your miners find a block, a notification will show up. You can view block details by clicking on the block's row in the Blocks tab of Atom. The network requires 60 confirmations of newly mined blocks before the coins unlock. Occasionally, one of the blocks you mine will be orphaned, which means that another pool found a block at the same time you did, and your reward is invalid.</p>
        <p><img src="/statics/screenshots/10-blocks.png" /></p>
        <p><img src="/statics/screenshots/11-block-detail.png" /></p>

        <h6 id="help" class="text-weight-light q-mt q-mb-md">Getting Help</h6>
        <p>If you have any questions about solo mining with Atom, join one of our social media platforms:</p>

        <p>
            <a target="_blank" href="https://t.me/ryocurrency">Telegram</a> |
            <a target="_blank" href="https://www.reddit.com/r/ryocurrency/">Reddit</a> |
            <a target="_blank" href="https://discord.gg/GFQmFtx">Discord</a>
        </p>

        <p>If you need help with xmr-stak, join the <a target="_blank" href="https://www.reddit.com/r/XmrStak/wiki/index">xmr-stak support subreddit.</a></p>


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
