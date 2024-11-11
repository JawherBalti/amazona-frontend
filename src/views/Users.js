import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_DETAILS_RESET } from "../actions/types";
import { getUsers, adminDeleteUser } from "../actions/user";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { api } from "..";
import Pagination from "../components/Pagination";

const reducer = (state, action) => {
  switch (action.type) {
    
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload.users,
        page: action.payload.page,
        pages: action.payload.pages,
        countUsers: action.payload.countUsers,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SEARCH_USER":
      return {
        ...state,
        searchUserId:
          action.payload.users.length > 0 ? action.payload.users[0] : null,
        searchResultsByName: [],
        searchPage: action.payload.page,
        searchPages: action.payload.pages,
      };
    case "CLEAR_SEARCH_RESULTS":
      return {
        ...state,
        searchProductId: null,
        searchResultsByName: [],
        searchPage: 1,
        searchPages: 1,
      };
    default:
      return state;
  }
};

export default function Users(props) {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // New state for sorting field
  const [order, setOrder] = useState("asc"); // New state for sorting order

//   const usersReducer = useSelector((state) => state.getUsersReducer);
//   const { error, users, loading } = usersReducer;
  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;

  const { search, pathname } = useLocation();

  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  const searchTerm = sp.get("searchTerm");

  const [
    {
      users,
      loading,
      error,
      pages,
      searchUserId,
      searchResultsByName,
      searchPage,
      searchPages,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    searchUserId: null,
    searchResultsByName: [],
    searchPage: 1,
    searchPages: 1,
  });

  if (!userInfo) {
    props.history.push("/signin");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        let url = `/api/user/getUsers?page=${page}&sortBy=${sortBy}&order=${order}`;
        if (searchTerm) {
          url += `&searchTerm=${searchTerm}`;
        }
        const { data } = await api.get(url, {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, [order, page, searchTerm, sortBy, userInfo]);

  const updateHandler = (userId) => {
    props.history.push(`/profile/${userId}`);
  };

  const deleteHandler = (userId) => {
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
    } else if (searchResultsByName.length > 0) {
      return searchResultsByName;
    } else {
      return users;
    }
  };

  const getCurrentPage = () => {
    return searchUserId
      ? 1
      : searchResultsByName.length > 0
      ? searchPage
      : page;
  };

  const getTotalPages = () => {
    return searchUserId
      ? 1
      : searchResultsByName.length > 0
      ? searchPages
      : pages;
  };

  return (
    <div>
      <h1>Users</h1>
      <div className="row">
        <div className="row" style={{ marginBottom: "20px" }}>
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
        <div>
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
          <button
            className="primary mb-3"
            onClick={() => props.history.push("/createProduct")}
          >
            Create product
          </button>
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
          {!searchUserId && searchResultsByName.length === 0 && (
            <div>
              <Pagination
                page={getCurrentPage()}
                pages={getTotalPages()}
                searchTerm={searchTerm}
                link="users"
              />
            </div>
          )}
    </div>
  );
}
