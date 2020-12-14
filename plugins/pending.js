import Vue from "vue";

export default function ({store}) {

    store.registerModule('pending', {
        namespaced: true,
        state: () => {
            let state = {}
            Object.keys(store._actions).forEach(ns => {
                let temp = state, parts = ns.split('/'), count = parts.length
                parts.forEach((p, i) => (temp = temp[p] || (temp[p] = i+1>=count?false:{})))
            })
            return state
        },
        mutations: {
            START(state, ns) {
                let parts = ns.split('/'), action = parts.pop()
                Vue.set(parts.reduce((o,k)=>o[k], state), action, true)
            },
            END(state, ns) {
                let parts = ns.split('/'), action = parts.pop()
                Vue.set(parts.reduce((o,k)=>o[k], state), action, false)
            },
        }
    })

    store.subscribeAction({
        before: (a) => store.commit('pending/START', a.type),
        after: (a) => store.commit('pending/END', a.type),
        error: (a) => store.commit('pending/END', a.type),
    })

}
