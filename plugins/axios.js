import { uuid } from 'vue-uuid'

export default function ({$axios, store}) {

    $axios.defaults.xsrfCookieName = 'auth.token'
    $axios.defaults.xsrfHeaderName = 'X-Authenticity'

    $axios.onRequest(config => {
        config.headers['X-Request-ID'] = uuid.v4()
    })

    $axios.onError(error => {

        if (!error.response || error.response.status !== 401 || store.state.auth.loggedIn === false) {
            return Promise.reject(error);
        }

        if (error.config._retry === undefined) {
            error.config._retry = true;
            return store.dispatch('auth/refresh').then(res => {
                return $axios.request(error.config);
            });
        }

        return Promise.reject(error);
    });

}
