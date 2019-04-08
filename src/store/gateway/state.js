export default {
    app: {
        config: {
            appearance: {
                theme: "light"
            },
        },
    },
    pool: {
        stats: {
            hashrate: 0,
            blockTime: 0,
            lastBlock: {
                height: 0,
                timestamp: 0,
            },
        },
        network_stats: {
            diff: 0,
            hashrate: 0,
            lastBlock: {
                height: 0,
                timestamp: 0,
            },
        },
        hashrate: {
            solo: {},
            network: {}
        },
        blocks: [],
    }
}
