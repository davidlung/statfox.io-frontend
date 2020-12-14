export default function ({ store, redirect, route }) {

    if(!store.state.auth.loggedIn) {
        if(!['login', 'signup', 'verification-token', 'forgot', 'forgot-token'].includes(route.name)) {
            return redirect('/login?r='+route.path)
        }
    }
    else if(['login', 'signup', 'forgot'].includes(route.name)) {
        return redirect('/')
    }
}