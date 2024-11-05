import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cart'
import CheckoutSteps from '../components/CheckoutSteps'

export default function Payment(props) {
    const cart = useSelector(state => state.cartReducer)
    const { shippingAddress } = cart

    if (!shippingAddress.address) {
        props.history.push("/shipping")
    }

    const [paymentMethod, setPaymentMetod] = useState("PayPal")

    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        props.history.push("/placeorder")
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Payment Method</h1>
                </div>
                <div>
                    <div>
                        <input name="paymentMethod" type="radio" id="paypal" value="PayPal" required checked={paymentMethod === "PayPal"} onChange={e => setPaymentMetod(e.target.value)} />
                        <label htmlFor="paypal">PayPal</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input name="paymentMethod" type="radio" id="stripe" value="Stripe" checked={paymentMethod === "Stripe"} required onChange={e => setPaymentMetod(e.target.value)} />
                        <label htmlFor="stripe">Stripe</label>
                    </div>
                </div>
                <div>
                    <button className="primary" type="submit">Continue</button>
                </div>
            </form>
        </div>
    )
}
