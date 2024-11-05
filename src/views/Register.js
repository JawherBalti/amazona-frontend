import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { USER_REGISTER_RESET } from '../actions/types'
import { register } from '../actions/user'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'

export default function Register(props) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const [emailSentMessage, setEmailSentMessage] = useState("")

    const registerReducer = useSelector(state => state.userRegisterReducer)
    const { loading, error, userInfo } = registerReducer

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({ type: USER_REGISTER_RESET })
        if (userInfo) {
            setEmailSentMessage(userInfo.data.message)
        }
    }, [dispatch, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password1 === password2) {
            dispatch(register(name, email, password1))
        }
        else {
            alert("Passwords do not match!")
        }
    }

    return (
        <div>
            {loading ? (<LoadingBox></LoadingBox>) :
                error ?
                    (
                        <form className="form" onSubmit={submitHandler}>
                            <MessageBox variant={"danger"}>{error}</MessageBox>
                            <div>
                                <h1>Register</h1>
                            </div>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input id="name" type="text" placeholder="Enter your name" required onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input id="email" type="text" placeholder="Enter your email" required onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password1">Password</label>
                                <input id="password1" type="password" placeholder="Enter your password" required onChange={e => setPassword1(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password2">Confirm Password</label>
                                <input id="password2" type="password" placeholder="Confirm your password" required onChange={e => setPassword2(e.target.value)} />
                            </div>
                            <div>
                                <label />
                                <button className="primary" type="submit">Create your account</button>
                            </div>
                            <div>
                                <label />
                                <div>Already have an account? {' '}
                                    <Link to={"/signin"}>Sing In</Link>
                                </div>
                            </div>
                        </form>) : (
                        <form className="form" onSubmit={submitHandler}>
                            {emailSentMessage && <MessageBox variant="success">{emailSentMessage}</MessageBox>}
                            <div>
                                <h1>Register</h1>
                            </div>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input id="name" type="text" placeholder="Enter your name" required onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input id="email" type="text" placeholder="Enter your email" required onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password1">Password</label>
                                <input id="password1" type="password" placeholder="Enter your password" required onChange={e => setPassword1(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password2">Confirm Password</label>
                                <input id="password2" type="password" placeholder="Confirm your password" required onChange={e => setPassword2(e.target.value)} />
                            </div>
                            <div>
                                <label />
                                <button className="primary" type="submit">Create your account</button>
                            </div>
                            <div>
                                <label />
                                <div>Already have an account? {' '}
                                    <Link to={"/signin"}>Sing In</Link>
                                </div>
                            </div>
                        </form>
                    )}
        </div>
    )
}
