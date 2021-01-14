import Vue from 'vue'

export default function ({store}) {

    store.registerModule('auth', {

        namespaced: true,

        state: () => ({
            loggedIn: false,
            authenticity: null,
            user: null,
            refreshTimer: null,
        }),

        mutations: {

            SET_USER(state, user) {
                state.user = user
            },

            SET_LOGGED_IN(state, bool) {
                state.loggedIn = bool
            },

            SET_AUTHENTICITY_TOKEN(state, token) {
                state.authenticity = token
            },

            SET_REFRESH_TIMER(state, timer) {
                state.refreshTimer = timer
            },

            SET_EMAIL(state, email) {
                if (state.user && state.user.email !== email) {
                    Vue.set(state.user, 'email', email)
                    Vue.set(state.user, 'verified', false)
                }
            },

            SET_NAME(state, name) {
                state.user && Vue.set(state.user, 'fullName', name)
            },

            SET_VERIFIED(state) {
                state.user && Vue.set(state.user, 'verified', true)
            },

        },

        actions: {

            async nuxtServerInit({dispatch, commit, state}, {res, route, redirect, error, $axios}) {
                let accessToken = this.$cookies.get('auth.id')
                let authenticityToken = this.$cookies.get('auth.token')

                if (!accessToken) {
                    if (!['login', 'signup', 'verification-token', 'forgot', 'forgot-token', 'analytics-id'].includes(route.name)) {
                        console.log('User is not logged in, redirect to login page')
                        return redirect('/login?r='+route.path)
                    }
                    return
                }

                if (accessToken && ['login', 'signup', 'forgot', 'forgot-token'].includes(route.name)) {
                    console.log('User is logged in but visit a page for not logged in users, redirect to / page')
                    return redirect('/')
                }

                try {
                    let response = await $axios.get(process.env.JSIO_ENDPOINT_USER)
                    commit('SET_USER', response.data)
                    commit('SET_LOGGED_IN', true)
                    commit('SET_AUTHENTICITY_TOKEN', authenticityToken)
                } catch (err) {
                    try {
                        let response = await $axios.post(process.env.JSIO_ENDPOINT_REFRESH)
                        res.setHeader('set-cookie', response.headers['set-cookie'])
                        $axios.setHeader('cookie', response.headers['set-cookie'][0].split(';')[0])
                        try {
                            let resUser = await $axios.get(process.env.JSIO_ENDPOINT_USER)
                            commit('SET_USER', resUser.data)
                            commit('SET_LOGGED_IN', true)
                            commit('SET_AUTHENTICITY_TOKEN', authenticityToken)
                            this.$cookies.set('auth.exp', response.data['expires_at'])
                        } catch (e) {
                            let response = await dispatch('logout', false)
                            response && res.setHeader('set-cookie', response.headers['set-cookie'])
                            return response ? redirect('/login') : error({
                                statusCode: 500,
                                message: 'Unable to load authenticated user resource, please delete your cookies and retry.'
                            })
                        }
                    } catch (err) {
                        let response = await dispatch('logout', false)
                        response && res.setHeader('set-cookie', response.headers['set-cookie'])
                        return response ? redirect('/login') : error({
                            statusCode: 500,
                            message: 'The authentication service is currently not available, please try again later.'
                        })
                    }
                }
            },

            async nuxtClientInit({dispatch, state}) {
                let expiresAt = this.$cookies.get('auth.exp')
                if (state.loggedIn && expiresAt) {
                    dispatch('startRefreshTimer', expiresAt)
                }
            },

            login({commit, state, dispatch}, data) {
                return this.$axios.post(process.env.JSIO_ENDPOINT_LOGIN, data).then((resLogin) => {
                    return this.$axios.get(process.env.JSIO_ENDPOINT_USER).then(res => {
                        commit('SET_USER', res.data)
                        commit('SET_LOGGED_IN', true)
                        commit('SET_AUTHENTICITY_TOKEN', this.$cookies.get('auth.token')||null)
                        this.$cookies.set('auth.exp', resLogin.data['expires_at'])
                        dispatch('startRefreshTimer', resLogin.data['expires_in'])
                    })
                })
            },

            async logout({commit, state}, redirectLocation) {
                if (redirectLocation === undefined) {
                    redirectLocation = '/login'
                }

                try{
                    let res = await this.$axios.post(process.env.JSIO_ENDPOINT_LOGOUT)
                    return redirectLocation ? this.$router.push(redirectLocation) : res
                }
                catch(e) {
                    console.log(!e.response ? e:'Logout API response with error '+e.response.status)
                }
                finally {
                    state.refreshTimer && clearTimeout(state.refreshTimer)
                    commit('SET_LOGGED_IN', false)
                    commit('SET_REFRESH_TIMER', null)
                    commit('SET_AUTHENTICITY_TOKEN', null)
                    this.$cookies.remove('auth.exp')
                    this.$cookies.remove('auth.token')
                    this.$cookies.remove('auth.id')
                }

                return redirectLocation ? this.$router.push(redirectLocation) : null
            },

            refresh({dispatch, commit}) {
                return this.$axios.post(process.env.JSIO_ENDPOINT_REFRESH).then(res => {
                    this.$cookies.set('auth.exp', res.data['expires_at'])
                    dispatch('startRefreshTimer', res.data['expires_in'])
                    commit('SET_AUTHENTICITY_TOKEN', this.$cookies.get('auth.token'))
                }).catch(err => {
                    if (err.response === undefined) {
                        dispatch('startRefreshTimer', 10)
                        return Promise.reject(err)
                    }else{
                        dispatch('logout')
                        return Promise.reject(err)
                    }
                })
            },

            startRefreshTimer({dispatch, state, commit}, timeoutSeconds) {
                if (timeoutSeconds > 1500000000) {
                    timeoutSeconds = timeoutSeconds - Math.round((new Date()).getTime() / 1000)
                }
                state.refreshTimer && clearTimeout(state.refreshTimer)
                commit('SET_REFRESH_TIMER', setTimeout(() => {
                    dispatch('refresh')
                }, Math.max((timeoutSeconds - 5), 0) * 1000))
            },

        }
    })

}
