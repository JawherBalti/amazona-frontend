import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { applyMiddleware } from 'redux';
import { legacy_createStore as createStore} from 'redux'
import {thunk} from 'redux-thunk'
import promiseMiddleware from 'redux-promise';
import reducer from './reducers'
import axios from 'axios';

<link
rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>


export const api = axios.create({
  baseURL: 'http://localhost:5000',
});

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, thunk)(createStore);
const initialState = {
  userSignInReducer: {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  },
  cartReducer: {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
    paymentMethod: "PayPal"
  }
}
ReactDOM.render(
  <Provider
    store={createStoreWithMiddleware(
      reducer,
      initialState,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider >,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
