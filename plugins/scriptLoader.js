export default function (context, inject) {

    const loader = ({src, defer, async}) => {

        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = src
            script.defer = defer || true
            script.async = async || true

            const el = document.getElementsByTagName('script')[0]
            el.parentNode.insertBefore(script, el)

            script.addEventListener('load', () => {
                resolve(script)
            })

            script.addEventListener('error', () => {
                reject(script)
            })
        })

    }

    inject('scriptLoader', loader)
}