import React, { useState, useEffect } from 'react';
// import jwt from 'jsonwebtoken';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { activateAccount } from '../actions/user';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function AccountActivation({ match }) {
    const [name, setName] = useState("")
    const [token, setToken] = useState("")
    const [accountActivatedMessage, setAccountActivatedMessage] = useState("")

    const activate = useSelector(state => state.activateAccountReducer)
    const { loading, info, error } = activate

    useEffect(() => {
        let token = match.params.token;
        let tokenData = atob(token.split('.')[1])

        if (token) {
            setName(tokenData.name)
            setToken(token)
        }

        if (info) {
            setAccountActivatedMessage(info.message)
        }
    }, [info, match.params]);

    const dispatch = useDispatch()

    const handleSubmit = e => {
        e.preventDefault();
        if (!info) {
            dispatch(activateAccount(token))
        }
    };

    return (
        <div>
            {loading ? <LoadingBox></LoadingBox> :
                error ? <MessageBox variant="danger">{error}</MessageBox> :
                    (
                        <form className="form" onSubmit={handleSubmit}>
                            <div>
                                <h1>Welcome {name}! Click the button to activate your account.</h1>
                            </div>
                            {accountActivatedMessage ?
                                (<div>
                                    <label />
                                    <MessageBox variant="success">{accountActivatedMessage}</MessageBox>
                                </div>) :

                                (<div>
                                    <label />
                                    <button type="submit" className="primary">Activate</button>
                                </div>)
                            }
                            <div>
                                <label />
                                <div>Already have an account? {' '}
                                    <Link to={"/signin"}>Sing In</Link>
                                </div>
                            </div>
                        </form>
                    )
            }
        </div>
    );
};