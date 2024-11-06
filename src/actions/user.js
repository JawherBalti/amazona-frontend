import { api } from ".."
import { USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNOUT, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, ACTIVATE_ACCOUNT_REQUEST, ACTIVATE_ACCOUNT_SUCCESS, ACTIVATE_ACCOUNT_FAIL, USERS_DETAILS_REQUEST, USERS_DETAILS_FAIL, USERS_DETAILS_SUCCESS, ADMIN_UPDATE_SUCCESS, ADMIN_UPDATE_FAIL, ADMIN_DELETE_REQUEST, ADMIN_DELETE_SUCCESS, ADMIN_DELETE_FAIL, USER_DETAILS_RESET } from "./types"
import axios from 'axios'

export const register = (name, email, password) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST, payload: { name, email, password } })
    try {
        const request = await api.post("/api/user/register", { name, email, password })
        dispatch({ type: USER_REGISTER_SUCCESS, payload: request })
    } catch (err) {
        dispatch({ type: USER_REGISTER_FAIL, payload: err.response && err.response.data.message ? err.response.data.message : err.message })
    }
}

export const activateAccount = (token) => async (dispatch) => {
    dispatch({ type: ACTIVATE_ACCOUNT_REQUEST, payload: { token } })
    try {
        const { data } = await api.post("/api/user/activate", { token })
        dispatch({ type: ACTIVATE_ACCOUNT_SUCCESS, payload: data })
    } catch (err) {
        dispatch({ type: ACTIVATE_ACCOUNT_FAIL, payload: err.response && err.response.data.message ? err.response.data.message : err.message })
    }
}

export const signin = (email, password) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } })
    try {
        const request = await api.post("/api/user/signin", { email, password })
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: request })
        localStorage.setItem("userInfo", JSON.stringify(request))
    } catch (err) {
        dispatch({ type: USER_SIGNIN_FAIL, payload: err.response && err.response.data.message ? err.response.data.message : err.message })
    }
}

export const signout = () => (dispatch) => {
    localStorage.removeItem("userInfo")
    localStorage.removeItem("cartItems")
    localStorage.removeItem("shippingAddress")
    localStorage.removeItem("paymentMethod")
    dispatch({ type: USER_SIGNOUT })
    dispatch({ type: USER_DETAILS_RESET })
}

export const getUsers = () => async (dispatch, getState) => {
    dispatch({ type: USERS_DETAILS_REQUEST })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await api.get("/api/user/getusers", {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: USERS_DETAILS_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: USERS_DETAILS_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const userDetailss = (userId) => async (dispatch, getState) => {
    dispatch({ type: USER_DETAILS_REQUEST, payload: userId })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await api.get(`/api/user/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: USER_DETAILS_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const updateUser = (user) => async (dispatch, getState) => {
    dispatch({ type: USER_UPDATE_REQUEST, payload: user })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const request = await api.put(`/api/user/profile/`, user, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: USER_UPDATE_SUCCESS, payload: request })
        dispatch({ type: USER_SIGNIN_SUCCESS, payload: request }) //because we need to update user name in navbar which comes from localstorage
        localStorage.setItem("userInfo", JSON.stringify(request))
    } catch (error) {
        dispatch({ type: USER_UPDATE_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const adminUpdateUser = (user) => async (dispatch, getState) => {
    dispatch({ type: USER_UPDATE_REQUEST, payload: user })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const request = await api.put(`/api/user/profile/${user._id}`, user, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: ADMIN_UPDATE_SUCCESS, payload: request })
    } catch (error) {
        dispatch({ type: ADMIN_UPDATE_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const adminDeleteUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: ADMIN_DELETE_REQUEST })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await api.delete(`/api/user/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: ADMIN_DELETE_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ADMIN_DELETE_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}