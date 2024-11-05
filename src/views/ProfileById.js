import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ADMIN_UPDATE_RESET } from '../actions/types'
import { adminUpdateUser, userDetailss } from '../actions/user'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'

export default function ProfileById(props) {
    const userId = props.match.params.id;

    const [name, setName] = useState("")
    const [isAdmin, setIsAdmin] = useState("")

    const userDetails = useSelector(state => state.userDetailsReducer)
    const { loading, error, user } = userDetails
    const userUpdate = useSelector(state => state.adminUpdateReducer)
    const { loading: loadingUpdate, error: errorUpadte, success: successUpdate } = userUpdate
    const userSignIn = useSelector(state => state.userSignInReducer)
    const { userInfo } = userSignIn
    
    const dispatch = useDispatch()

    if (!userInfo) {
        props.history.push("/signin")
    }

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: ADMIN_UPDATE_RESET })
            props.history.push('/users')
        }
        if (!user) {
            dispatch(userDetailss(userId))
        } else {
            setName(user.name)
            setIsAdmin(user.isAdmin)
        }
    }, [dispatch, user, userId, successUpdate, props.history])

    const roleChangeHandler = (e) => {
        if (e.target.value === "Admin"){
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(adminUpdateUser({ _id: userId, name, isAdmin }))
    }

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    {user && <h1>{`${user.name}'s Profile`}</h1>}
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
                                {user &&
                                    <div>
                                        <label htmlFor="role">Role</label>
                                        <select onChange={(e) => roleChangeHandler(e)}>
                                            <option value={user.isAdmin ? "Admin" : "User"}>{user.isAdmin ? "Admin" : "User"}</option>
                                            <option value={user.isAdmin ? "User" : "Admin"}>{user.isAdmin ? "User" : "Admin"}</option>
                                        </select>
                                    </div>
                                }
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
