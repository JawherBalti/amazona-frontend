import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { api } from "..";
import { useSelector } from "react-redux";
import Pagination from "../components/Pagination";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    case "SEARCH_PRODUCTS":
      return {
        ...state,
        searchProductId:
          action.payload.products.length > 0
            ? action.payload.products[0]
            : null,
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

export default function Products(props) {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // New state for sorting field
  const [order, setOrder] = useState("asc"); // New state for sorting order

  const [
    {
      loading,
      error,
      products,
      pages,
      loadingDelete,
      successDelete,
      searchProductId,
      searchResultsByName,
      searchPage,
      searchPages,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    searchProductId: null,
    searchResultsByName: [],
    searchPage: 1,
    searchPages: 1,
  });

  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;

  const { search, pathname } = useLocation();

  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  const searchTerm = sp.get("searchTerm");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        let url = `/api/products/adminProducts?page=${page}&sortBy=${sortBy}&order=${order}`;
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
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, sortBy, order, successDelete, searchTerm]);

  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure? This action cannot be reversed.")) {
      try {
        await api.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.data.token}` },
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        console.log(err);
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  const handleSearch = async () => {
    props.history.push(`/products?page=1&searchTerm=${localSearchTerm}`);
    setLocalSearchTerm("");
  };

  const getDisplayProducts = () => {
    if (searchProductId) {
      return [searchProductId];
    } else if (searchResultsByName.length > 0) {
      return searchResultsByName;
    } else {
      return products;
    }
  };

  const getCurrentPage = () => {
    return searchProductId
      ? 1
      : searchResultsByName.length > 0
      ? searchPage
      : page;
  };

  const getTotalPages = () => {
    return searchProductId
      ? 1
      : searchResultsByName.length > 0
      ? searchPages
      : pages;
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="row">
        <div className="row" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search products..."
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
            <option value="price">Price</option>
            <option value="countInStock">Quantity</option>
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
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Created at</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getDisplayProducts().map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.countInStock}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.createdAt.substring(0,10)}</td>
                  <td>
                    <button
                      type="button"
                      className="small"
                      onClick={() => {
                        props.history.push(`/products/${product._id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="small"
                      onClick={() => deleteHandler(product)}
                    >
                      {loadingDelete ? <LoadingBox></LoadingBox> : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!searchProductId && searchResultsByName.length === 0 && (
            <div>
              <Pagination
                page={getCurrentPage()}
                pages={getTotalPages()}
                searchTerm={searchTerm}
                link="products"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
