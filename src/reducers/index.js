import { combineReducers } from 'redux'
import { productsListReducer, productDetailsReducer, adminProductsReducer, productDeleteReducer } from './products'
import { cartReducer } from './cart'
import {userUpdateReducer, userSignInReducer, userRegisterReducer, userDetailsReducer, activateAccountReducer, getUsersReducer, adminUpdateReducer, adminDeleteReducer } from './user'
import { allOrdersReducer, myOrderReducer, orderReducer, orderDetailsReducer, orderPayReducer, orderDeliverReducer, orderDeleteReducer } from './order'

const rootReducer = combineReducers({
    productsListReducer,
    adminProductsReducer,
    productDetailsReducer,
    productDeleteReducer,
    cartReducer,
    userSignInReducer,
    userRegisterReducer,
    activateAccountReducer,
    allOrdersReducer,
    orderReducer,
    orderDetailsReducer,
    orderPayReducer,
    orderDeliverReducer,
    myOrderReducer,
    orderDeleteReducer,
    userDetailsReducer,
    userUpdateReducer,
    adminUpdateReducer,
    adminDeleteReducer,
    getUsersReducer
})

export default rootReducer