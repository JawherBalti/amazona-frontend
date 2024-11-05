import React, { useEffect } from 'react'
import { addToCart, removeFromCart } from '../actions/cart'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import MessageBox from '../components/MessageBox';

export default function Cart(props) {
    const productId = props.match.params.id
    const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1
    const cart = useSelector(state => state.cartReducer)

    const dispatch = useDispatch()
    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkOutHandler = () => {
        props.history.push('/signin?redirect=shipping')
    }
    return (
        <div className="row top">
            <div className="col-2">
                <h1>Shopping Cart</h1>
                {cart.cartItems.length === 0 ? <MessageBox>
                    Cart is Empty
                </MessageBox> : (
                    <ul>
                        {cart.cartItems.map(item => (
                            <li key={item.product}>
                                <div className="row">
                                    <div>
                                        <img src={item.image} alt={item.name} className="small" />
                                    </div>
                                    <div className="min-30">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                    <div>
                                        <select value={item.qty} onChange={e => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                            {[...Array(item.countInStock).keys()].map(x =>
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div>${item.price}</div>
                                    <div>
                                        <button type="button" onClick={() => removeFromCartHandler(item.product)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className="col-1 total">
                <div className="card card-body ">
                    <ul>
                        <li>
                            <h2>Number of items: {cart.cartItems.reduce((acc, curr) => acc + curr.qty, 0)}. Total: ${cart.cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0)}</h2>
                        </li>
                        <li>
                            <button type="button" onClick={checkOutHandler} className="primary block" disabled={cart.cartItems.length === 0}>
                                Proceed to Payment
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
