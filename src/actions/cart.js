import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from "./types"
import { api } from ".."

export const addToCart = (productId, qty) => async (dispatch, getState) => {
    const request = await api.get(`/api/products/${productId}`)
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            name: request.data.name,
            image: request.data.image,
            price: request.data.price,
            countInStock: request.data.countInStock,
            product: request.data._id,
            qty,
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))
}

export const removeFromCart = (productId) => async (dispatch, getState) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: productId })
    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))
}

export const saveShippingAddress = (data) => (dispatch, getState) => {
    dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data })
    localStorage.setItem("shippingAddress", JSON.stringify(getState().cartReducer.shippingAddress))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data })
}