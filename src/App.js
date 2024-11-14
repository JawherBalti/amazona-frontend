import React from "react";
import Home from "./views/Home";
import Product from "./views/Product";
import Signin from "./views/Signin";
import Register from "./views/Register";
import { Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Cart from "./views/Cart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "./actions/user";
import Shipping from "./views/Shipping";
import Payment from "./views/Payment";
import PlaceOrder from "./views/PlaceOrder";
import OrderHistory from "./views/OrderHistory";
import Profile from "./views/Profile";
import AccountActivation from "./views/AccountActivation";
import Users from "./views/Users";
import ProfileById from "./views/ProfileById";
import Order from "./views/Order";
import Orders from "./views/Orders";
import ChatBox from "./components/ChatBox";
import Support from "./views/Support";
import OrderDeliver from "./views/OrderDeliver";
import {
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import Dashboard from "./views/Dashboard";
import Products from "./views/Products";
import EditProduct from "./views/EditProduct";
import CreateProduct from "./views/CreateProduct";
import AdminRoute from "./components/AdminRoute";

function App() {
  const cart = useSelector((state) => state.cartReducer);
  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;

  const dispatch = useDispatch();
  const location = useLocation();

  const signoutHandler = () => {
    dispatch(signout());
  };

  return (
    <div className="grid-container">
      <header className="row">
        <div>
          <Link to="/" className="brand">
            amazona
          </Link>
        </div>
        <div>
          <Link to="/cart">
            Cart{" "}
            {cart.cartItems.length > 0 && (
              <span className="badge">{cart.cartItems.length}</span>
            )}
          </Link>
          {userInfo ? (
            <div className="dropdown">
              <Link to="#">
                {userInfo.data.user.name} <i className="fa fa-caret-down"></i>
              </Link>
              <ul className="dropdown-content">
                <li>
                  <Link to="/profile">User Profile</Link>
                </li>
                <li>
                  <Link to="/orderhistory">Order History</Link>
                </li>
                <li>
                  <Link to="/signin" onClick={signoutHandler}>
                    Sign Out
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/signin">Sign in</Link>
          )}

          {userInfo && userInfo.data.user.isAdmin && (
            <div className="dropdown">
              <Link to="#admin">
                Admin <i className="fa fa-caret-down"></i>
              </Link>
              <ul className="dropdown-content">
                <li>
                  <Link to="/support">Support</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/products">Products</Link>
                </li>
                <li>
                  <Link to="/allOrders">Orders</Link>
                </li>
                <li>
                  <Link to="/users">Users</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
      <main>
        <Route exact path="/cart/:id?" component={Cart}></Route>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/signin" component={Signin}></Route>
        <Route exact path="/product/:id" component={Product}></Route>
        <PrivateRoute exact path="/order/:id" component={Order}></PrivateRoute>
        <PrivateRoute exact path="/profile/:id" component={ProfileById}></PrivateRoute>
        <PrivateRoute exact path="/orderhistory" component={OrderHistory}></PrivateRoute>
        <PrivateRoute exact path="/shipping" component={Shipping}></PrivateRoute>
        <PrivateRoute exact path="/placeorder" component={PlaceOrder}></PrivateRoute>
        <PrivateRoute exact path="/profile" component={Profile}></PrivateRoute>
        <PrivateRoute exact path="/payment" component={Payment}></PrivateRoute>
        <AdminRoute exact path="/order/deliver/:id" component={OrderDeliver}></AdminRoute>
        <AdminRoute exact path="/allOrders" component={Orders}></AdminRoute>
        <AdminRoute exact path="/users" component={Users}></AdminRoute>
        <AdminRoute exact path="/support" component={Support}></AdminRoute>
        <AdminRoute exact path="/dashboard" component={Dashboard}></AdminRoute>
        <AdminRoute exact path="/createProduct" component={CreateProduct}></AdminRoute>
        <AdminRoute exact path="/products" component={Products}></AdminRoute>
        <AdminRoute exact path="/products/:id" component={EditProduct}></AdminRoute>
        <Route
          exact
          path="/activate/:token"
          component={AccountActivation}
        ></Route>
      </main>
      {location.pathname === "/" && <ChatBox />}

      <footer className="row center">All rights reserved</footer>
    </div>
  );
}

export default App;
