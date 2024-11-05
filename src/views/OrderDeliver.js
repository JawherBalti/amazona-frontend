import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsOrder, deliverOrder } from '../actions/order'
import axios from 'axios';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../actions/types';

export default function Order(props) {
    const orderId = props.match.params.id
    const orderDetails = useSelector(state => state.orderDetailsReducer)
    const { order, loading, error } = orderDetails

    const [sdkReady, setSdkReady] = useState(false)

    const orderDeliver = useSelector(state => state.orderDeliverReducer)
    const { error: errorDeliver, success: successDeliver, loading: loadingDeliver } = orderDeliver

    const dispatch = useDispatch()
    useEffect(() => {
        const addPayPalScript = async () => {
            const { data } = await axios.get('/api/config/paypal');
            const sb = "sb"
            const notdata = ""
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${sb}`; //should be data instead of sb but for some reason data does not work!!!!
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };

        if (!order || successDeliver || (order && order._id !== orderId)) {
            dispatch({ type: ORDER_PAY_RESET }) // to prevent infinite loop (page keeps reloading)
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(detailsOrder(orderId))
        } else {
            if (!order.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }
    }, [dispatch, order, orderId, successDeliver])

    const deliverOrderHandler = () => {
        dispatch(deliverOrder(orderId))
    }

    return loading ? (<LoadingBox></LoadingBox>) :
        error ? (<MessageBox variant="danger">{error}</MessageBox>)
            : (
                <div>
                    <h1>Order ID: {order._id}</h1>
                    <div className="row top">
                        <div className="col-2">
                            <ul>
                                <li>
                                    <div className="card card-body">
                                        <h2>Shipping</h2>
                                        <p>
                                            <strong>Name:</strong> {order.shippingAddress.name} <br />
                                            <strong>Address:</strong> {order.shippingAddress.address},
                                            {order.shippingAddress.postalCode},
                                            {order.shippingAddress.city},
                                            {order.shippingAddress.country}
                                        </p>
                                        {
                                            loadingDeliver ? <LoadingBox></LoadingBox> : 
                                            errorDeliver ? <MessageBox variant="danger">{errorDeliver}</MessageBox> :
                                            order.isDelivered ?
                                                <MessageBox variant="success">Delivered at: {order.deliveredAt.substring(0, 10)}</MessageBox> :
                                                <MessageBox variant="danger">Not delivered</MessageBox>
                                        }
                                    </div>
                                </li>
                                <li>
                                    <div className="card card-body">
                                        <h2>Payment</h2>
                                        <p>
                                            <strong>Method:</strong> {order.paymentMethod} <br />
                                        </p>
                                        {
                                            order.isPaid ?
                                                <MessageBox variant="success">Paid at: {order.paidAt.substring(0, 10)}</MessageBox> :
                                                <MessageBox variant="danger">Not paid</MessageBox>
                                        }
                                    </div>
                                </li>
                                <li>
                                    <div className="card card-body">
                                        <h2>Order Items</h2>
                                        <ul>
                                            {order.orderItems.map(item => (
                                                <li key={item.product}>
                                                    <div className="row">
                                                        <div>
                                                            <img src={item.image} alt={item.name} className="small" />
                                                        </div>
                                                        <div className="min-30">
                                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                        </div>
                                                        <div>{item.qty} x ${item.price} = ${item.qty * item.price}</div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-1">
                            <div className="card card-body">
                                <ul>
                                    <li>
                                        <h2>Order Summary</h2>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div>Items:</div>
                                            <div>${order.itemsPrice.toFixed(2)}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div>Shipping:</div>
                                            <div>${order.shippingPrice.toFixed(2)}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div>Tax:</div>
                                            <div>${order.taxPrice.toFixed(2)}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div>
                                                <strong>Total:</strong>
                                            </div>
                                            <div>
                                                <strong>${order.totalPrice.toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    </li>
                                    {
                                        (order.isPaid && !order.isDelivered) && (
                                            <button className="primary block" onClick={() => deliverOrderHandler()}>Deliver</button>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
}
