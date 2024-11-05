import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

export default function PrivateRoute({ component: Component, ...rest }) {
    const userSignIn = useSelector(state => state.userSignInReducer)
    const { userInfo } = userSignIn

    //rest: params of originial route
    //render: if userInfo exists render component in App.js otherwise redirect to signin page
    return (
        <Route {...rest} render={props => userInfo ?
            <Component {...props}></Component> :
            <Redirect to="/signin" />}>
        </Route>
    )
}
