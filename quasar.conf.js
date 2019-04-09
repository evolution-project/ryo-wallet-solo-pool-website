module.exports = function (ctx) {
    return {
        plugins: [
            "axios",
	    "vuelidate",
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
                "QField",
                "QInput",
                "QCheckbox",
                "QTooltip",
                "QTable",
                "QTh",
                "QTr",
                "QTd",
                "QTableColumns",
                "QInnerLoading",
                "QSpinner"
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
