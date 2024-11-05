import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { myOrders } from '../actions/order'
import Pagination from '../components/Pagination'

export default function OrderHistory(props) {

    const myOrderList = useSelector(state => state.myOrderReducer)
    const { loading, error, orders } = myOrderList
    const userSignIn = useSelector(state => state.userSignInReducer)
    const { userInfo } = userSignIn

    const [allMyOrders, setAllMyOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [ordersPerPage, setOrdersPerPage] = useState(9)

    const [pageNumberLimit, setpageNumberLimit] = useState(5)
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5)
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0)

    const lastOrder = currentPage * ordersPerPage
    const firstOrder = lastOrder - ordersPerPage

    if (!userInfo) {
        props.history.push("/signin")
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(myOrders())
        if (orders) {
            setAllMyOrders(orders)
        }
    }, [dispatch])

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
            <div>Order history</div>
            {loading ? <LoadingBox></LoadingBox> :
                error ? <MessageBox variant="danger">{error}</MessageBox> :
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.slice(firstOrder, lastOrder).map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>{order.totalPrice.toFixed(2)}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : "Not Paid"}</td>
                                        <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : "Not Delivered"}</td>
                                        <td>
                                            <button type="button" className="small" onClick={() => { props.history.push(`/order/${order._id}`) }}>Details</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
            }
            <Pagination ordersPerPage={ordersPerPage} totalOrders={orders ? orders.length : allMyOrders.length} paginate={paginate} currentPage={currentPage} maxPageNumberLimit={maxPageNumberLimit} minPageNumberLimit={minPageNumberLimit} handleNextbtn={handleNextbtn} handlePrevbtn={handlePrevbtn}></Pagination>
        </div>
    )
}
