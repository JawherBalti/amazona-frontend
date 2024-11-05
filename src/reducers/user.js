import { USER_UPDATE_RESET, USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_RESET, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNOUT, USER_UPDATE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, ACTIVATE_ACCOUNT_REQUEST, ACTIVATE_ACCOUNT_SUCCESS, ACTIVATE_ACCOUNT_FAIL, USER_REGISTER_RESET, USERS_DETAILS_REQUEST, USERS_DETAILS_SUCCESS, USERS_DETAILS_FAIL, ADMIN_UPDATE_REQUEST, ADMIN_UPDATE_SUCCESS, ADMIN_UPDATE_FAIL, ADMIN_UPDATE_RESET, ADMIN_DELETE_REQUEST, ADMIN_DELETE_SUCCESS, ADMIN_DELETE_FAIL } from "../actions/types";

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }
        case USER_REGISTER_RESET:
            return {}
        default:
            return state
    }
}

export const userSignInReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_SIGNIN_REQUEST:
            return { loading: true }
        case USER_SIGNIN_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_SIGNIN_FAIL:
            return { loading: false, error: action.payload }
        case USER_SIGNOUT:
            return {}
        default:
            return state
    }
}

export const activateAccountReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIVATE_ACCOUNT_REQUEST:
            return { loading: true }
        case ACTIVATE_ACCOUNT_SUCCESS:
            return { loading: false, info: action.payload }
        case ACTIVATE_ACCOUNT_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const getUsersReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case USERS_DETAILS_REQUEST:
            return { loading: true }
        case USERS_DETAILS_SUCCESS:
            return { loading: false, users: action.payload }
        case USERS_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userDetailsReducer = (state = { loading: true }, action) => {
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return { loading: true }
        case USER_DETAILS_SUCCESS:
            return { loading: false, user: action.payload }
        case USER_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        case USER_DETAILS_RESET:
            return {}
        default:
            return state
    }
}

export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true }
        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case USER_UPDATE_RESET:
            return {}
        default:
            return state
    }
}

export const adminUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_UPDATE_REQUEST:
            return { loading: true }
        case ADMIN_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case ADMIN_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case ADMIN_UPDATE_RESET:
            return {}
        default:
            return state
    }
}

export const adminDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case ADMIN_DELETE_REQUEST:
            return { loadingDelete: true }
        case ADMIN_DELETE_SUCCESS:
            return { loadingDelete: false, successDelete: true }
        case ADMIN_DELETE_FAIL:
            return { loadingDelete: false, errorDelete: action.payload }
        default:
            return state
    }
}