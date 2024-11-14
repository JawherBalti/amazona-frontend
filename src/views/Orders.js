import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { allOrderss, deleteOrder } from "../actions/order";
import { useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";
import { ORDER_DELETE_RESET } from "../actions/types";

export default function Orders(props) {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalPrice"); // New state for sorting field
  const [order, setOrder] = useState("asc"); // New state for sorting order

  const allOrderList = useSelector((state) => state.allOrdersReducer);
  const {
    orders,
    loading,
    error,
    pages,
    searchOrderId,
    searchResultsByTotal,
    searchPage,
    searchPages,
  } = allOrderList;

  const deleteReducer = useSelector((state) => state.orderDeleteReducer);
  const { loadingDelete, successDelete } = deleteReducer;

  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;

  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  const searchTerm = sp.get("searchTerm");

  if (!userInfo) {
    props.history.push("/signin");
  }

  const dispatch = useDispatch();

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: ORDER_DELETE_RESET });
    } else {
      dispatch(allOrderss(page, sortBy, order, searchTerm));
    }
  }, [dispatch, page, sortBy, order, searchTerm, successDelete]);

  const deleteHandler = (orderId) => {
    if (window.confirm("Are you sure? This action cannot be reversed."))
      dispatch(deleteOrder(orderId));
  };

  const handleSearch = async () => {
    props.history.push(`/allOrders?page=1&searchTerm=${localSearchTerm}`);
    setLocalSearchTerm("");
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const getDisplayOrders = () => {
    if (searchOrderId) {
      return [searchOrderId];
    } else if (searchResultsByTotal?.length > 0) {
      return searchResultsByTotal;
    } else {
      return orders;
    }
  };

  const getCurrentPage = () => {
    return searchOrderId
      ? 1
      : searchResultsByTotal?.length > 0
      ? searchPage
      : page;
  };

  const getTotalPages = () => {
    return searchOrderId
      ? 1
      : searchResultsByTotal?.length > 0
      ? searchPages
      : pages;
  };

  return (
    <div>
      <h1>Order history</h1>
      <div className="row mb-3">
        <div className="row search">
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search order..."
            style={{ width: "250px" }}
          />
          <button className="primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="order">
          <label>Sort By:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="totalPrice">Total</option>
            <option value="shippingAddress.name">Name</option>
            <option value="isPaid">Paid</option>
            <option value="isDelivered">Delivered</option>
            <option value="createdAt">Creation date</option>
          </select>
          <select value={order} onChange={handleOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Total</th>
              <th>Paid at</th>
              <th>Delivered at</th>
              <th>Created at</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getDisplayOrders().map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.shippingAddress.name}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid && order.paidAt
                    ? order.paidAt?.substring(0, 10)
                    : "Not Paid"}
                </td>
                <td>
                  {order.isDelivered && order.deliveredAt
                    ? order.deliveredAt?.substring(0, 10)
                    : "Not Delivered"}
                </td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      props.history.push(`/order/deliver/${order._id}`);
                    }}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <Pagination
          page={getCurrentPage()}
          pages={getTotalPages()}
          searchTerm={searchTerm}
          link="allOrders"
        />
      </div>
    </div>
  );
}
