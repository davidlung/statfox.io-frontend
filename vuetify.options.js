import colors from 'vuetify/es5/util/colors'
import minifyTheme from 'minify-css-string'

export default {
    breakpoint: {},
    icons: {},
    lang: {},
    rtl: false,
    theme: {
        options: { minifyTheme },
        themes: {
            light: {
                primary: '#e47522',
                accent: colors.indigo.darken3,
                secondary: colors.lightGreen.darken2,
                info: colors.blue.lighten2,
                warning: colors.amber.base,
                error: colors.deepOrange.accent4,
                success: colors.green.accent3
            },
            dark: {
                primary: '#e47522',
                accent: colors.indigo.darken3,
                secondary: colors.lightGreen.darken2,
                info: colors.blue.lighten2,
                warning: colors.amber.base,
                error: colors.deepOrange.accent4,
                success: colors.green.accent3
            },
        }
    }
}
