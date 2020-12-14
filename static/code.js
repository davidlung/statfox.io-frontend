window.NONAME = function () {

    var target = "http://app-dev.jsonserver.io/api/v1/capture",
        scriptTag = document.currentScript
            || document.querySelector('script[src*="code.js"][wid]')
            || document.querySelector("script[data-wid]")
            || document.querySelector("script[wid]"),
        wid = scriptTag.getAttribute("data-wid") || scriptTag.getAttribute("wid"),
        referrer = document.referrer,
        sent = false

    function registerHistoryTrack() {
        var pushState, replaceState;
        void 0 !== history && (pushState = history.pushState, history.pushState = function () {
            var ret = pushState.apply(history, arguments);
            return window.dispatchEvent(new Event("pushstate")), window.dispatchEvent(new Event("track")), ret
        }, replaceState = history.replaceState, history.replaceState = function () {
            var ret = replaceState.apply(history, arguments);
            return window.dispatchEvent(new Event("replacestate")), window.dispatchEvent(new Event("track")), ret
        }, window.addEventListener("popstate", function () {
            window.dispatchEvent(new Event("track"))
        }), window.addEventListener("track", function(){
                track()
        }))
    }

    function registerHashTrack() {
        window.addEventListener("hashchange", track)
    }

    registerHistoryTrack() && registerHashTrack()

    function track() {
        window.NONAME.track()
    }

    function encodeParams(params) {
        return "?" + Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
        }).join("&")
    }

    function canTrack() {
        var prerender = "visibilityState" in document && "prerender" === document.visibilityState,
            clientSideBot = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent)

        return !(prerender || clientSideBot)
    }

    setTimeout(function(){
        !sent && window.NONAME.track()
    }, 100)

    return {
        track: function () {
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

            this.send(params)
        },
        send: function (params) {
            if (canTrack() && referrer !== location.href) {
                var img = document.createElement("img")
                img.setAttribute("alt", "")
                img.style.position = "absolute"
                img.src = target + encodeParams(params)
                img.addEventListener("load", function () {
                    img.parentNode.removeChild(img)
                })
                document.body.appendChild(img)
                referrer = location.href
            }
        },
        beacon: function (params) {
            if (canTrack() && navigator.sendBeacon !== undefined) {
                navigator.sendBeacon(target + encodeParams(params))
            }
        },
    }

}();
