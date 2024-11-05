import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

export default function AdminRoute({ component: Component, ...rest }) {
    const userSignIn = useSelector(state => state.userSignInReducer)
    const { userInfo } = userSignIn

    //rest: params of originial route
    //render: if userInfo exists render component in App.js otherwise redirect to signin page
    return (
        <Route {...rest} render={props => 
            userInfo && userInfo.data.user.isAdmin ?
            <Component {...props}></Component> :
            <Redirect to="/signin" />}>
        </Route>
    )
}
