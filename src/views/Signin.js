import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signin } from '../actions/user'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'

export default function Signin(props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signinReducer = useSelector(state => state.userSignInReducer)
    const { loading, userInfo, error } = signinReducer

    const redirect = props.location.search ? props.location.search.split("=")[1] : "/"

    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(signin(email, password))
    }

    useEffect(() => {
        if (userInfo) {
            props.history.push(redirect)
        }
    }, [props.history, redirect, userInfo])

    return (
        <div>
            {loading ? (<LoadingBox></LoadingBox>) :
                error ?
                    (
                        <form className="form" onSubmit={submitHandler}>
                            <MessageBox variant={"danger"}>{error}</MessageBox>
                            <div>
                                <h1>Sign In</h1>
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input id="email" type="text" placeholder="Enter your email" required onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" placeholder="Enter your password" required onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div>
                                <label />
                                <button className="primary" type="submit" >Sign In</button>
                            </div>
                            <div>
                                <label />
                                <div>New customer? {' '}
                                    <Link to={"/register"}>Create an account</Link>
                                </div>
                            </div>
                        </form>
                    ) :
                    (
                        <form className="form" onSubmit={submitHandler}>
                            <div>
                                <h1>Sign In</h1>
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input id="email" type="text" placeholder="Enter your email" required onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" placeholder="Enter your password" required onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div>
                                <label />
                                <button className="primary" type="submit" >Sign In</button>
                            </div>
                            <div>
                                <label />
                                <div>New customer? {' '}
                                    <Link to={"/register"}>Create an account</Link>
                                </div>
                            </div>
                        </form>
                    )}
        </div>
    )
}
