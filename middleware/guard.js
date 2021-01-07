export default function ({ store, redirect, route, res, req }) {

    if (process.server && !(route.query.embedded && route.query.pwk && store.state.website.websites.find(w => w.apiKey === route.query.pwk))) {
        res.setHeader('X-Frame-Options', 'deny')
    }

    if(!store.state.auth.loggedIn) {
        if(!['login', 'signup', 'verification-token', 'forgot', 'forgot-token'].includes(route.name)) {
            return redirect('/login?r='+route.path)
        }
    }
    else if(['login', 'signup', 'forgot'].includes(route.name)) {
        return redirect('/')
    }
}
