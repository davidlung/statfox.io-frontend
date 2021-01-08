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
            dispatch('loadStatistic', res.data.id)
            this.$toast.success(this.app.i18n.t('toast.websites.created'))
            return res
        })
    },

    deleteWebsite({commit, dispatch, state}, id) {
        return this.$axios.delete('/api/v1/websites/'+id).then( res => {
            commit('DELETE_WEBSITE', id)
            if (id === state.statistic.data.websiteId && state.websites.length) {
                dispatch('loadStatistic', state.websites[0].id)
            }
            this.$toast.success(this.app.i18n.t('toast.websites.deleted'))
            return res
        })
    },

    renameWebsite({commit, dispatch, state}, {id, name}) {
        return this.$axios.patch('/api/v1/websites/'+id, {name}).then( res => {
            commit('RENAME_WEBSITE', {id, name})
            this.$toast.success(this.app.i18n.t('toast.websites.updated'))
            return res
        })
    },

    // STATISTIC

    async loadStatistic({commit, state, dispatch}, wid) {
        await dispatch('reloadStatistic', wid)
    },

    async initializeDateRange({commit}) {
        let start = new Date(), end = new Date()

        start.setDate(start.getDate()-7)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 59)

        if (this.$cookies.get('dateRangeFrom')) {
            start.setTime(this.$cookies.get('dateRangeFrom'))
            end.setTime(this.$cookies.get('dateRangeEnd'))
        }

        return await commit('SET_DATE_RANGE', {
            startDate: start.getTime(),
            endDate: end.getTime()
        })
    },

    reloadStatistic({commit, state, dispatch}, wid) {
        let cookieWid = this.$cookies.get('wid')

        if (wid === undefined) {
            if (state.statistic.data.websiteId && state.websites.find(w => w.id === state.statistic.data.websiteId)) {
                wid = state.statistic.data.websiteId
            }else if (cookieWid && state.websites.find(w => w.id === cookieWid)) {
                wid = cookieWid
            }else if (state.websites.length) {
                wid = state.websites[0].id
            }else{
                return
            }
        }else{
            this.$cookies.set('wid', wid, {
                expires: this.$time.dateFromTime(undefined, +86400*7)
            })
        }

        if (state.statistic.dateRange.startDate === null) {
            dispatch('initializeDateRange')
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
            this.$cookies.remove('wid')
        })
    },

    initStatPolling({state, dispatch}) {
        setInterval(() => {
            state.websites.length && dispatch('reloadStatistic')
        }, 30000)
    }

}
