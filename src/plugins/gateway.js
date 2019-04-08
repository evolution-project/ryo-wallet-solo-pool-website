import { Gateway } from "src/gateway/gateway"

export default ({ app, router, store, Vue }) => {
    Vue.prototype.$gateway = new Gateway(app, router)
}
