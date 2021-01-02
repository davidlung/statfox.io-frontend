window.statfox = function () {

    function encodeParams(params) {
        return "?" + Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
        }).join("&")
    }

    function canTrack() {
        var rgx = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i
        return !((document.visibilityState||null) === "prerender" || rgx.test(navigator.userAgent))
    }

    var sfurl = "http://app-dev.statfox.io/api/v1/capture",
        visitedAt = new Date().getTime(),
        scriptTag = document.currentScript
            || document.querySelector("script[data-wid]")
            || document.querySelector("script[wid]"),
        wid = scriptTag.getAttribute("data-wid") || scriptTag.getAttribute("wid"),
        referrer = document.referrer,
        tracked = false,
        spaSent = false,
        spaHistory = true,
        spaHash = true,
        api = {
        sendImg: function(params) {
            var img = document.createElement("img")
            img.setAttribute("alt", "")
            img.style.position = "absolute"
            img.src = sfurl + encodeParams(params)
            img.addEventListener("load", function () {
                img.parentNode.removeChild(img)
            })
            document.body.appendChild(img)
        },
        sendBeacon: function (params) {
            if (navigator.sendBeacon !== undefined) {
                navigator.sendBeacon(sfurl + encodeParams(params))
            }
        },
        trackSPAView: function () {
            visitedAt = new Date().getTime()
            spaSent = true
            this.trackView()
        },
        trackView: function () {
            if (canTrack() && referrer !== location.href) {
                tracked = true
                setTimeout(function(){

                    var params = {
                        wid: wid,
                        hst: location.hostname,
                        ptl: document.title,
                        pth: window.location.pathname,
                        ref: referrer,
                        res: (window.screen.width||document.documentElement.clientWidth||document.body.clientWidth)
                            + 'x'
                            + (window.screen.height||document.documentElement.clientHeight||document.body.clientHeight),
                    }

                    if (window.JSON && window.location.href.indexOf('utm_source=')>-1) {
                        var qs = window.location.href.split('?')[1]
                        var qo = JSON.parse('{"'+decodeURI(qs.replace(/&/g, "\",\"").replace(/=/g,"\":\""))+'"}')
                        params['utms'] = qo.utm_source||''
                        params['utmm'] = qo.utm_medium||''
                        params['utmc'] = qo.utm_campaign||''
                        params['utmt'] = qo.utm_term||''
                    }

                    this.sendImg(params)
                    referrer = location.href
                }.bind(this), 500)
            }
        },
        trackTime: function () {
            var params = {
                wid: wid,
                hst: location.hostname,
                ptl: document.title,
                pth: window.location.pathname,
                vat: Math.round(visitedAt/1000),
                dur: Math.round(((new Date().getTime()) - visitedAt)/1000)
            }

            tracked && this.sendBeacon(params)
        },
    }

    window.addEventListener('beforeunload', () => {
        api.trackTime()
    }, false)

    if (window.history && spaHistory) {
        var pushState = history.pushState, replaceState = history.replaceState

        history.pushState = function () {
            window.dispatchEvent(new Event("sf__SPA_before"))
            var result = pushState.apply(history, arguments)
            window.dispatchEvent(new Event("pushstate"))
            window.dispatchEvent(new Event("sf__SPA_after"))
            return result
        }

        history.replaceState = function () {
            window.dispatchEvent(new Event("sf__SPA_before"))
            var result = replaceState.apply(history, arguments)
            window.dispatchEvent(new Event("replacestate"))
            window.dispatchEvent(new Event("sf__SPA_after"))
            return result
        }

        window.addEventListener("popstate", function () {
            visitedAt = new Date().getTime()
            api.trackSPAView()
        })

        window.addEventListener("sf__SPA_before", function(){
            api.trackTime()
        })

        window.addEventListener("sf__SPA_after", function(){
            api.trackSPAView()
        })
    }

    if (spaHash) {
        window.addEventListener("hashchange", api.trackSPAView)
    }

    setTimeout(function(){
        !spaSent && api.trackView()
    }, 500)

    return api
}();
