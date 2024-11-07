import React, { useEffect, useReducer } from "react";
import Chart from "react-google-charts";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useSelector } from "react-redux";
import { api } from "..";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/api/order/summary", {
          headers: { authorization: `Bearer ${userInfo.data.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <div>
        <h1>Dashboard</h1>
      </div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="row">
            <div className="col-1">
              <div className="card">
                <div className="card-body">
                  <h1>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </h1>
                  <p> Total users</p>
                </div>
              </div>
            </div>
            <div className="col-1">
              <div className="card">
                <div className="card-body">
                  <h1>
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </h1>
                  <p> Total orders</p>
                </div>
              </div>
            </div>
            <div className="col-1">
              <div className="card">
                <div className="card-body">
                  <h1>
                    $
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </h1>
                  <p>Total revenue</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card" style={{width:"45%"}}>
              <div className=" card-body">
                <div>
                  <h1>Sales</h1>
                </div>
                {summary.dailyOrders.length === 0 ? (
                  <MessageBox>No Sale</MessageBox>
                ) : (
                  <Chart
                  options={{
                    backgroundColor: "#f8f8f8",
                    chartArea: { width: "80%", height: "80%" },
                    legend: { position: "bottom" },
                  }}
                    width="100%"
                    height="400px"
                    chartType="AreaChart"
                    loader={<div>Loading Chart...</div>}
                    data={[
                      ["Date", "Sales"],
                      ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                    ]}
                  ></Chart>
                )}
              </div>
            </div>
            <div className="card" style={{width:"45%"}}>
              <div className="card-body">
                <div>
                  <h1>Categories</h1>
                </div>
                {summary.productCategories.length === 0 ? (
                  <MessageBox>No Category</MessageBox>
                ) : (
                  <Chart
                    options={{
                      backgroundColor: "#f8f8f8",
                      chartArea: { width: "100%", height: "80%" },
                      legend: { position: "bottom" },
                    }}
                    width="100%"
                    height="400px"
                    chartType="PieChart"
                    loader={<div>Loading Chart...</div>}
                    data={[
                      ["Category", "Products"],
                      ...summary.productCategories.map((x) => [x._id, x.count]),
                    ]}
                  ></Chart>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
