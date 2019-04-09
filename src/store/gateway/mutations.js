const objectAssignDeep = require("object-assign-deep")

export const set_app_data = (state, data) => {
    state.app = objectAssignDeep.noMutate(state.app, data)
}
export const set_pool_data = (state, data) => {
    state.pool = objectAssignDeep.noMutate(state.pool, data)
}
export const set_worker_data = (state, data) => {
    state.worker = objectAssignDeep.noMutate(state.worker, data)
}
