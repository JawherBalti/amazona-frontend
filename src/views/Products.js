import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import { deleteProduct, getAdminProducts } from "../actions/products";
import { PRODUCT_DELETE_RESET } from "../actions/types";

export default function Products(props) {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // New state for sorting field
  const [order, setOrder] = useState("asc"); // New state for sorting order

  const productsReducer = useSelector((state) => state.adminProductsReducer);
  const {
    loading,
    error,
    products,
    pages,
    searchProductId,
    searchResultsByName,
    searchPage,
    searchPages,
  } = productsReducer;

const deleteReducer = useSelector((state) => state.productDeleteReducer)
const {loadingDelete, successDelete} = deleteReducer

  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;

  const { search } = useLocation();
  const dispatch = useDispatch();

  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  const searchTerm = sp.get("searchTerm");

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    } else {
      dispatch(getAdminProducts(page, sortBy, order, searchTerm));
    }
  }, [page, userInfo, sortBy, order, successDelete, searchTerm, dispatch]);

  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure? This action cannot be reversed.")) {
      dispatch(deleteProduct(product));
    }
  };

  const handleSearch = async () => {
    props.history.push(`/products?page=1&searchTerm=${localSearchTerm}`);
    setLocalSearchTerm("");
  };

  const getDisplayProducts = () => {
    if (searchProductId) {
      return [searchProductId];
    } else if (searchResultsByName?.length > 0) {
      return searchResultsByName;
    } else {
      return products;
    }
  };

  const getCurrentPage = () => {
    return searchProductId
      ? 1
      : searchResultsByName?.length > 0
      ? searchPage
      : page;
  };

  const getTotalPages = () => {
    return searchProductId
      ? 1
      : searchResultsByName?.length > 0
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
      <div className="row mb-3">
        <div className="row search">
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
        <div className="order">
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
            className="primary"
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
                  <td>{product.createdAt.substring(0, 10)}</td>
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
          <div>
            <Pagination
              page={getCurrentPage()}
              pages={getTotalPages()}
              searchTerm={searchTerm}
              link="products"
            />
          </div>
        </>
      )}
    </div>
  );
}
