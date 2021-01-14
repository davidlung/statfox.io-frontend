import Vue from 'vue'

export default {

    // WEBSITES

    SET_WEBSITES(state, websites) {
        Vue.set(state, 'websites', websites)
    },

    ADD_WEBSITE(state, website) {
        state.websites.push(website)
    },

    DELETE_WEBSITE(state, id) {
        Vue.delete(state.websites, state.websites.indexOf(state.websites.find(w => w.id === id)))
    },

    RENAME_WEBSITE(state, {id, name}) {
        let website = state.websites.find(w => w.id === id)
        website && Vue.set(website, 'name', name)
    },

    CHANGE_SHARE_STATE(state, {id, shared}) {
        let website = state.websites.find(w => w.id === id)
        website && Vue.set(website, 'isShared', !!shared)
    },

    SET_SHARE_KEY(state, {id, shareKey}) {
        let website = state.websites.find(w => w.id === id)
        website && Vue.set(website, 'shareKey', shareKey)
    },

    // STATISTIC

    SET_STATISTIC(state, statistic) {
        Vue.set(state.statistic, 'data', statistic)
    },

    SET_DATE_RANGE(state, dateRange) {
        Vue.set(state.statistic, 'dateRange', dateRange)
    },

}
