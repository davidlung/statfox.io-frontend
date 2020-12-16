export default {

    async initialize({commit}) {
        return await this.$axios.get('/api/v1/websites').then(async (res) => {
            await commit('SET_WEBSITES', res.data)
            return res
        })
    },

    // WEBSITES

    createWebsite({commit, dispatch}, data) {
        return this.$axios.post('/api/v1/websites', data).then( res => {
            commit('ADD_WEBSITE', res.data)
            return res
        })
    },

    deleteWebsite({commit, dispatch, state}, id) {
        return this.$axios.delete('/api/v1/websites/'+id).then( res => {
            commit('DELETE_WEBSITE', id)
            return res
        })
    },

    // STATISTIC

    loadStatistic({commit, state}, wid) {
        let cookieWid = this.$cookies.get('wid')

        if (wid === undefined) {
            if (state.statistic.data.websiteId) {
                wid = state.statistic.data.websiteId
            }else if (cookieWid && state.websites.find(w => w.id === cookieWid)) {
                wid = cookieWid
            }else if (state.websites.length) {
                wid = state.websites[0].id
            }else{
                return
            }
        }else{
            this.$cookies.set('wid', wid)
        }

        let starDate = new Date(state.statistic.dateRange.startDate),
            endDate = new Date(state.statistic.dateRange.endDate)

        let params = {
            wid: wid,
            from: this.$time.unixTime(starDate),
            to: this.$time.unixTime(endDate),
        }

        this.$cookies.set('dateRangeFrom', starDate.getTime())
        this.$cookies.set('dateRangeEnd', endDate.getTime())

        return this.$axios.get('/api/v1/statistic', {params}).then(res => {
            commit('SET_STATISTIC', res.data)
            return res
        }).catch(() => {

        })
    },

}
