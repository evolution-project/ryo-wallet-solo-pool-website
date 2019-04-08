module.exports = function (ctx) {
    return {
        plugins: [
            "axios",
            "gateway"
        ],
        css: [
            "app.styl"
        ],
        extras: [
            ctx.theme.mat ? "roboto-font" : null,
            "material-icons"
        ],
        supportIE: true,
        build: {
            scopeHoisting: true,
            vueRouterMode: "history",
            extendWebpack (cfg) {
            }
        },
        devServer: {
            open: true
        },
        framework: {
            components: [
                "QLayout",
                "QLayoutHeader",
                "QLayoutDrawer",
                "QPageContainer",
                "QPage",
                "QToolbar",
                "QToolbarTitle",
                "QBtn",
                "QIcon",
                "QList",
                "QListHeader",
                "QItem",
                "QItemMain",
                "QItemSide",
                "QItemTile",
                "QModal",
                "QModalLayout",
                "QTooltip",
                "QTable",
                "QTh",
                "QTr",
                "QTd",
                "QTableColumns"
            ],
            directives: [
                "Ripple"
            ],
            plugins: [
                "Notify",
                "LocalStorage",
                "AddressbarColor"
            ]
        },
        animations: [],
    }
}
