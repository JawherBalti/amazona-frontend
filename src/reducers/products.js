import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_FAIL,
    GET_PRODUCTS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL
} from '../actions/types'

export const productsListReducer = (state = { loading: false, products: [] }, action) => {
    switch (action.type) {
        case GET_PRODUCTS_REQUEST:
            return { loading: true }
        case GET_PRODUCTS_SUCCESS:
            return { loading: false, products: action.payload }
        case GET_PRODUCTS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const productDetailsReducer = (state = { product: {}, loading: false }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return { loading: true }
        case PRODUCT_DETAILS_SUCCESS:
            return { loading: false, product: action.payload }
        case PRODUCT_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}