import React, { useEffect, useReducer, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Products() {
  const [currentPage, setCurrentPage] = useState();
  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;

  const { search, pathname } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(
          `/api/products/adminProducts?page=${page} `,
          {
            headers: { Authorization: `Bearer ${userInfo.data.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };
    fetchData();
  }, [page, userInfo]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  return (
    <div>
      <h1>Products</h1>
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
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      //   props.history.push(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        {[...Array(pages).keys()].map((x) => (
          <Link
            className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
            key={x + 1}
            to={`/products?page=${x + 1}`}
          >
            {x + 1}
          </Link>
        ))}
        <Pagination
          ordersPerPage={10}
          totalOrders={countProducts}
          paginate={paginate}
          currentPage={currentPage}
          maxPageNumberLimit={maxPageNumberLimit}
          minPageNumberLimit={minPageNumberLimit}
          handleNextbtn={handleNextbtn}
          handlePrevbtn={handlePrevbtn}
        ></Pagination>
      </div>
    </div>
  );
}
