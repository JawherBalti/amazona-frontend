import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { detailsOrder, payOrder } from "../actions/order";
import { ORDER_PAY_RESET } from "../actions/types";
import { api } from "..";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export default function Order(props) {
  const orderId = props.match.params.id;

  const orderDetails = useSelector((state) => state.orderDetailsReducer);
  const { order, loading, error } = orderDetails;
  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;
  const orderPay = useSelector((state) => state.orderPayReducer);
  const {
    error: errorPay,
    success: successPay,
    loading: loadingPay,
  } = orderPay;

  const dispatch = useDispatch();
  const history = useHistory();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!userInfo) return history.push("/signin");

    if (!order || successPay || (order && order._id !== orderId)) {
      dispatch({ type: ORDER_PAY_RESET }); // to prevent infinite loop (page keeps reloading)
      dispatch(detailsOrder(orderId));
    } else {
      const addPayPalScript = async () => {
        const { data: clientId } = await api.get("/api/config/paypal");

        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": "sb", //should be clientId instead of sb but for some reason data does not work!!!!
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      addPayPalScript();
    }
  }, [dispatch, paypalDispatch, history, userInfo, order, orderId, successPay]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  async function onApprove(data, actions) {
    try {
      const paymentResult = await actions.order.capture();
      dispatch(payOrder(order, paymentResult)); // Dispatch payOrder to update the backend
    } catch (err) {
      console.log(err);
    }
  }

  function onError(err) {
    console.log(err);
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
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
                  {order.shippingAddress.city},{order.shippingAddress.country}
                </p>
                {order.isDelivered && order.deliveredAt ? (
                  <MessageBox variant="success">
                    Delivered at: {order.deliveredAt.substring(0, 10)}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod} <br />
                </p>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at: {order.paidAt.substring(0, 10)}
                  </MessageBox>
                ) : (
                  <MessageBox variant="danger">Not paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          />
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>
                        <div>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
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
              <li>
                <MessageBox variant="">
                  <div className="row">
                    <div>
                      <strong>Use this fake account credentials:</strong>
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <strong>Email: </strong>
                      <span> sb-gagbe33828531@personal.example.com</span>
                    </div>
                  </div>
                  <div className="row">
                    <div>
                      <strong>Password: </strong>
                      <span> 4cX"uzL^</span>
                    </div>
                  </div>
                </MessageBox>
              </li>
              {!order.isPaid && (
                <li>
                  {isPending ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
