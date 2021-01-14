export default function ({ store, redirect, route, res, req }) {

    if (process.server && !(route.query.embedded && route.query.sk && store.state.website.websites.find(w => w.shareKey === route.query.sk))) {
        res.setHeader('X-Frame-Options', 'deny')
    }

    if(!store.state.auth.loggedIn) {
        if(!['login', 'signup', 'verification-token', 'forgot', 'forgot-token', 'analytics-id'].includes(route.name)) {
            return redirect('/login?r='+route.path)
        }
    }
    else if(['login', 'signup', 'forgot'].includes(route.name)) {
        return redirect('/')
    }
}
