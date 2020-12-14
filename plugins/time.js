export default function (context, inject) {

    const time =  {

        now() {
            return Math.round((new Date()).getTime() / 1000)
        },

        unixTime(date) {
            return Math.round(date.getTime() / 1000)
        },

        dateString(timestamp) {
            return (new Date(timestamp*1000)).toLocaleDateString()
        },

        dateTimeString(timestamp) {
            return (new Date(timestamp*1000)).toLocaleString()
        },

        remaining(timestamp) {
            let remaining = timestamp - (Math.round((new Date()).getTime() / 1000)), unit = 's'

            if (remaining <= 60) {

            }

            else if (remaining <= 3600) {
                remaining = remaining/60
                unit = 'm'
            }

            else if (remaining <= 86400) {
                remaining = remaining/3600
                unit = 'h'
            }
            else {
                remaining = remaining/86400
                unit = 'd'
            }

            return Math.round(remaining)+unit
        }

    }

    inject('time', time)

}
