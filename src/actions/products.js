import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_FAIL,
    GET_PRODUCTS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    GET_ADMIN_PRODUCTS_REQUEST,
    GET_ADMIN_PRODUCTS_SUCCESS,
    GET_ADMIN_PRODUCTS_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL
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

export const getAdminProducts = (page, sortBy, order, searchTerm) => async (dispatch, getState) => {
    dispatch({ type: GET_ADMIN_PRODUCTS_REQUEST })
const { userSignInReducer: { userInfo } } = getState()
    try {
        let url = `/api/products/adminProducts?page=${page}&sortBy=${sortBy}&order=${order}`;
        if (searchTerm) {
          url += `&searchTerm=${searchTerm}`;
        }
        const { data } = await api.get(url, {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        });
        dispatch({ type: GET_ADMIN_PRODUCTS_SUCCESS, payload: data })
      } catch (err) {
        dispatch({ type: GET_ADMIN_PRODUCTS_FAIL, payload: err.message })
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

export const deleteProduct = (product) => async (dispatch, getState) => {
    dispatch({ type: PRODUCT_DELETE_REQUEST, payload: product });
    const { userSignInReducer: { userInfo } } = getState();
    
    try {
      await api.delete(`/api/products/${product._id}`, {
        headers: { Authorization: `Bearer ${userInfo.data.token}` },
      });
      dispatch({ type: PRODUCT_DELETE_SUCCESS });
    } catch (err) {
      console.log(err);
      dispatch({
        type: PRODUCT_DELETE_FAIL
      });
    }
  };