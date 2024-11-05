import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { USER_UPDATE_RESET } from '../actions/types'
import { updateUser, userDetailss } from '../actions/user'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'

export default function Profile(props) {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const userSignIn = useSelector(state => state.userSignInReducer)
    const { userInfo } = userSignIn
    const userDetails = useSelector(state => state.userDetailsReducer)
    const { loading, error, user } = userDetails
    const userUpdate = useSelector(state => state.userUpdateReducer)
    const { loading: loadingUpdate, error: errorUpadte, success: successUpdate } = userUpdate

    if (!userInfo) {
        props.history.push("/signin")
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({ type: USER_UPDATE_RESET }) // when the user visits the page after update, the message "user updated successfully disappears"
        if (!user) {
            dispatch(userDetailss(userInfo.data.user._id))
        } else {
            setName(userInfo.data.user.name) //should be user.name but its buggy
        }
    }, [dispatch, user, userInfo.data.user._id]) //do not add userInfo because when logout useEffect will trigger and userInfo is undefined which causes an error

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("passwords do not match!")
        } else {
            dispatch(updateUser({ userId: user._id, name, password }))
        }
    }
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {
                    loading ? <LoadingBox></LoadingBox> :
                        error ? <MessageBox variant="danger">{error}</MessageBox> :
                            <>
                                {loadingUpdate && <LoadingBox></LoadingBox>}
                                {errorUpadte && <MessageBox variant="danger">{errorUpadte}</MessageBox>}
                                {successUpdate && <MessageBox variant="success">Profile updated successfully</MessageBox>}
                                <div>
                                    <label htmlFor="name">Name</label>
                                    <input id="name" type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="password">New Password</label>
                                    <input id="password" type="password" placeholder="Enter your password" onChange={e => setPassword(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input id="confirmPassword" type="password" placeholder="Confirm your new password" onChange={e => setConfirmPassword(e.target.value)} />
                                </div>
                                <div>
                                    <label />
                                    <button className="primary" type="submit">Update</button>
                                </div>
                            </>
                }
            </form>
        </div>
    )
}
