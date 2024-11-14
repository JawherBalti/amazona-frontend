import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADMIN_DELETE_RESET } from "../actions/types";
import { getUsers, adminDeleteUser } from "../actions/user";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function Users(props) {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // New state for sorting field
  const [order, setOrder] = useState("asc"); // New state for sorting order

  const usersReducer = useSelector((state) => state.getUsersReducer);
  const {
    users,
    loading,
    error,
    pages,
    searchUserId,
    searchResultsByName,
    searchPage,
    searchPages,
  } = usersReducer;

  const deleteReducer = useSelector((state) => state.adminDeleteReducer);
  const { loadingDelete, successDelete } = deleteReducer;

  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;

  const { search } = useLocation();
  const dispatch = useDispatch();

  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  const searchTerm = sp.get("searchTerm");

  if (!userInfo) {
    props.history.push("/signin");
  }

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: ADMIN_DELETE_RESET });
    } else {
      dispatch(getUsers(page, sortBy, order, searchTerm));
    }
  }, [successDelete, order, page, searchTerm, sortBy, dispatch]);

  const updateHandler = (userId) => {
    props.history.push(`/profile/${userId}`);
  };

  const deleteHandler = (userId) => {
    if (window.confirm("Are you sure? This action cannot be reversed."))
      dispatch(adminDeleteUser(userId));
  };

  const handleSearch = async () => {
    props.history.push(`/users?page=1&searchTerm=${localSearchTerm}`);
    setLocalSearchTerm("");
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const getDisplayUsers = () => {
    if (searchUserId) {
      return [searchUserId];
    } else if (searchResultsByName?.length > 0) {
      return searchResultsByName;
    } else {
      return users;
    }
  };

  const getCurrentPage = () => {
    return searchUserId
      ? 1
      : searchResultsByName?.length > 0
      ? searchPage
      : page;
  };

  const getTotalPages = () => {
    return searchUserId
      ? 1
      : searchResultsByName?.length > 0
      ? searchPages
      : pages;
  };

  return (
    <div>
      <h1>Users</h1>
      <div className="row mb-3">
        <div className="row search">
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search user..."
            style={{ width: "250px" }}
          />
          <button className="primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="order">
          <label>Sort By:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="isAdmin">Role</option>
            <option value="createdAt">Date</option>
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
              <th>Email</th>
              <th>Role</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getDisplayUsers().map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Admin" : "User"}</td>
                <td>{user.createdAt.substring(0, 10)}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={(e) => updateHandler(user._id)}
                  >
                    Edit
                  </button>
                  {!user.isAdmin && (
                    <button
                      type="button"
                      className="small"
                      onClick={() => deleteHandler(user._id)}
                    >
                      Delete
                    </button>
                  )}
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
          link="users"
        />
      </div>
    </div>
  );
}
