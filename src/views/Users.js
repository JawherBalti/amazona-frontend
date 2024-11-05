import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { USER_DETAILS_RESET } from '../actions/types'
import { getUsers, adminDeleteUser } from '../actions/user'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Pagination from '../components/Pagination'

export default function Users(props) {
    const usersReducer = useSelector(state => state.getUsersReducer)
    const { error, users, loading } = usersReducer
    const userSignIn = useSelector(state => state.userSignInReducer)
    const { userInfo } = userSignIn
    //const deleteReducer = useSelector(state => state.adminDeleteReducer)
    //const { errorDelete, successDelete, loadingDelete } = deleteReducer
    
    const [userList, setUserList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [usersPerPage, setUsersPerPage] = useState(9)

    const [pageNumberLimit, setpageNumberLimit] = useState(5)
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5)
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0)

    const lastOrder = currentPage * usersPerPage
    const firstOrder = lastOrder - usersPerPage

    if (!userInfo) {
        props.history.push("/signin")
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({ type: USER_DETAILS_RESET })
        dispatch(getUsers())
        if (users) {
            setUserList(users)
        }
    }, [dispatch, userList])

    const updateHandler = (userId) => {
        props.history.push(`/profile/${userId}`)
    }

    const deleteHandler = (userId) => {
        dispatch(adminDeleteUser(userId))
        setUserList(userList.filter(user => user._id !== userId))
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handleNextbtn = () => {
        setCurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    }

    const handlePrevbtn = () => {
        setCurrentPage(currentPage - 1);

        if ((currentPage - 1) % pageNumberLimit === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    }

    return (
        <div>
            <div>Users</div>
            {loading ? <LoadingBox></LoadingBox> :
                error ? <MessageBox variant="danger">{error}</MessageBox> :
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.slice(firstOrder, lastOrder).map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? "Admin" : "User"}</td>
                                    <td>
                                        <button type="button" className="small" onClick={(e) => updateHandler(user._id)}>Edit</button>
                                    </td>
                                    <td>
                                        { 
                                            !user.isAdmin && <button type="button" className="small" onClick={() => deleteHandler(user._id)}>Delete</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                    <Pagination ordersPerPage={usersPerPage} totalOrders={users ? users.length : userList.length} paginate={paginate} currentPage={currentPage} maxPageNumberLimit={maxPageNumberLimit} minPageNumberLimit={minPageNumberLimit} handleNextbtn={handleNextbtn} handlePrevbtn={handlePrevbtn}></Pagination>
        </div>
    )
}
