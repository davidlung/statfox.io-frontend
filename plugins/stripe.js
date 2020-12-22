import {loadStripe} from "@stripe/stripe-js";

export default function (context, inject) {

    let client = null

    const stripe = async () => {

        if(client === null) {
            client = await loadStripe(context.$config.STRIPE_KEY)
        }

        return client
    }

    inject('stripe', stripe)

}
