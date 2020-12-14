import presets from './../error.js'

export default function (context, inject) {

    const error = err => {

        if (!err.response) {
            console.error(err)
            return
        }

        const status = err.response.status

        if(status < 500 && err.response.data.error !== undefined) {
            const reason = err.response.data.error.reason

            if(presets[status] !== undefined && presets[status][reason] !== undefined) {
                context.$toast.error(presets[status][reason].message)
                return
            }

            context.$toast.error(err.response.data.error.message)
            return
        }

        context.$toast.error(
            'Sorry, something went wrong with this action. Please try again later or contact the support.'
        )

    }

    inject('error', error)

}
