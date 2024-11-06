import axios from 'axios'
import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_FAIL,
    GET_PRODUCTS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS
} from './types'
import { api } from '..'

export const getProducts = () => async (dispatch) => {
    dispatch({ type: GET_PRODUCTS_REQUEST })
    try {
        const request = await api.get("/api/products")
        
        dispatch({ type: GET_PRODUCTS_SUCCESS, payload: request.data })
    } catch (err) {
        dispatch({ type: GET_PRODUCTS_FAIL, payload: err.message })
    }
}

export const detailsProduct = (productId) => async (dispatch) => {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId })
    try {
        const request = await api.get(`/api/products/${productId}`)
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: request.data })
    } catch (err) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: err.response && err.response.data.message ?
                err.response.data.message : err.message
        })
    }
}