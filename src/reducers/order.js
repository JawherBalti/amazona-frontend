import { MY_ORDER_LIST_FAIL, MY_ORDER_LIST_REQUEST, MY_ORDER_LIST_SUCCESS, ORDER_DELIVER_RESET, ORDERS_LIST_FAIL, ORDERS_LIST_REQUEST, ORDERS_LIST_SUCCESS, ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_RESET, ORDER_CREATE_SUCCESS, ORDER_DELETE_FAIL, ORDER_DELETE_REQUEST, ORDER_DELETE_SUCCESS, ORDER_DELIVER_FAIL, ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_PAY_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_RESET, ORDER_PAY_SUCCESS } from "../actions/types"

export const orderReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return { loading: true }
        case ORDER_CREATE_SUCCESS:
            return { loading: true, success: true, order: action.payload }
        case ORDER_CREATE_FAIL:
            return { loading: false, error: action.payload }
        case ORDER_CREATE_RESET:
            return {}
        default:
            return state
    }
}

export const orderDetailsReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return { loading: true }
        case ORDER_DETAILS_SUCCESS:
            return { loading: false, order: action.payload }
        case ORDER_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const orderPayReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return { loading: true }
        case ORDER_PAY_SUCCESS:
            return { loading: false, success: true }
        case ORDER_PAY_FAIL:
            return { loading: false, error: action.payload }
        case ORDER_PAY_RESET:
            return {}
        default:
            return state
    }
}

export const orderDeliverReducer = (state = { loading: true, success: false }, action) => {
    switch (action.type) {
        case ORDER_DELIVER_REQUEST:
            return { loading: true }
        case ORDER_DELIVER_SUCCESS:
            return { loading: false, success: true }
        case ORDER_DELIVER_FAIL:
            return { loading: false, error: action.payload }
        case ORDER_DELIVER_RESET:
            return {}
        default:
            return state
    }
}

export const myOrderReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case MY_ORDER_LIST_REQUEST:
            return { loading: true }
        case MY_ORDER_LIST_SUCCESS:
            return { loading: false, orders: action.payload }
        case MY_ORDER_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const allOrdersReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case ORDERS_LIST_REQUEST:
            return { loading: true }
        case ORDERS_LIST_SUCCESS:
            return { loading: false, allOrders: action.payload }
        case ORDERS_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const orderDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_DELETE_REQUEST:
            return { loadingDelete: true }
        case ORDER_DELETE_SUCCESS:
            return { loadingDelete: false, successDelete: true }
        case ORDER_DELETE_FAIL:
            return { loadingDelete: false, errorDelete: action.payload }
        default:
            return state
    }
}