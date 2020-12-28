export default function (context, inject) {

    const time =  {

        dateFromTime(timestamp, diff) {
            let date = new Date()
            date.setTime((timestamp||Math.round((new Date()).getTime() / 1000))*1000 + (diff?diff*1000:0))
            return date
        },

        now(diff) {
            return (Math.round((new Date()).getTime() / 1000)) + (diff?diff*1000:0)
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
