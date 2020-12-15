import cred from './auth-client.json'

require('dotenv').config()
let env = process.env

export default {
    ssr: true,

    head: {
        titleTemplate: '%s - Analytics.io',
        title: 'Analytics.io',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: env.npm_package_description || ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ],
        script: [
            {src: '/code.js', wid: 'ab9d24dfbb1c129be3cf695322bab901', defer: true}
        ]
    },

    loading: false,

    css: [
        '~/static/css/main.css'
    ],

    plugins: [
        '~/plugins/auth.js',
        '~/plugins/v-mask.js',
        '~/plugins/date-picker.js',
        '~/plugins/toast.js',
        '~/plugins/axios',
        '~/plugins/pending',
        '~/plugins/error',
        '~/plugins/time',
        '~/plugins/stripe',
        '~/plugins/init.client.js',
        '~/plugins/scriptLoader.js'
    ],

    buildModules: [
        '@nuxtjs/vuetify',
    ],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        '@nuxtjs/recaptcha',
        '@nuxtjs/pwa',
        'cookie-universal-nuxt',
        'nuxt-i18n',
    ],

    i18n: {
        locales: [
            { code: 'en', iso: 'en-US', file: 'en.js' },
            { code: 'de', iso: 'de-DE', file: 'de.js' },
        ],
        defaultLocale: 'de',
        lazy: true,
        strategy: 'no_prefix',
        langDir: 'locales/',
        detectBrowserLanguage: {
            alwaysRedirect: false,
            fallbackLocale: 'en',
            onlyOnRoot: false,
            useCookie: true,
            cookieCrossOrigin: false,
            cookieDomain: null,
            cookieKey: 'i18n_redirected',
            cookieSecure: false
        },
        vueI18n: {
            fallbackLocale: 'en',
            messages: {
                en: {
                    welcome: 'Welcome'
                },
                fr: {
                    welcome: 'Bienvenue'
                },
                es: {
                    welcome: 'Bienvenido'
                }
            }
        }
    },

    recaptcha: {
        hideBadge: false,
        siteKey: '6Lcd1wcaAAAAANgNMjEUMqVIAvZzw-J9Zdf0YlJ4',
        version: 2,
        size: 'normal'
    },

    router: {
        middleware: ['guard']
    },

    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        treeShake: true,
        optionsPath: './vuetify.options.js'
    },

    // build: {
    //     extractCSS: true,
    //     optimization: {
    //         minimize: true,
    //         splitChunks: {
    //             chunks: 'all',
    //             cacheGroups: {
    //                 styles: {
    //                     name: 'styles',
    //                     test: /\.(css|vue)$/, // <-- This line is causing error
    //                     chunks: 'all',
    //                     enforce: true
    //                 },
    //                 vendors: {
    //                     test: /[\\/]node_modules[\\/]/i,
    //                     chunks: "all"
    //                 },
    //                 commons: {
    //                     name: "commons",
    //                     chunks: "initial",
    //                     minChunks: 2
    //                 }
    //             }
    //         },
    //
    //     },
    //     extend(config, ctx) {
    //     }
    // },

    axios: {
        browserBaseURL: env.BASE_BROWSER_URL||'',
        credentials: true,
        https: false,
        proxy: true
    },

    proxy: {
        '/!api/': {
            target: env.BASE_API_URL||'',
            secure: false,
            pathRewrite: {
                '^/!api':'/api'
            }
        },
        '/api/': {
            target: env.BASE_API_URL||'',
            secure: false,
            pathRewrite: {
                '^/api':'/api/io.statfox.app'
            }
        },
        '/auth/': {
            target: env.BASE_API_URL||'',
            secure: false,
            auth: cred.clientId+':'+cred.secret,
            pathRewrite: {
                '^/auth/login':'/auth/token',
                '^/auth/logout':'/auth/revoke',
                '^/auth/refresh':'/auth/token/refresh',
                '^/auth/signup':'/api/io.statfox.app/v1/signup'
            }
        },
    },

    env: {
        BASE_BROWSER_URL : env.BASE_BROWSER_URL,
        BASE_API_URL     : env.BASE_API_URL,
        ENV_IS_STAGING   : env.ENV_IS_STAGING,
        STRIPE_KEY       : env.STRIPE_KEY,

        JSIO_ENDPOINT_LOGIN   : '/auth/login',
        JSIO_ENDPOINT_LOGOUT  : '/auth/logout',
        JSIO_ENDPOINT_REFRESH : '/auth/refresh',
        JSIO_ENDPOINT_USER    : '/!api/v1/me',
    },

    publicRuntimeConfig: {
        ENV_IS_STAGING: env.ENV_IS_STAGING||false,
        STRIPE_KEY: env.STRIPE_KEY,
        DOMAIN: 'statfox.io',
        BRAND: 'StatFox',
        BRAND_ALT_1: 'STATFOX',
        BRAND_ALT_2: 'StatFox',
        BRAND_ALT_3: 'StatFox.io',
    }
}
