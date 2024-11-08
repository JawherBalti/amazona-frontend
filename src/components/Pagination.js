import React from "react";

export default function Pagination({
  ordersPerPage,
  totalOrders,
  paginate,
  currentPage,
  maxPageNumberLimit,
  minPageNumberLimit,
  handlePrevbtn,
  handleNextbtn,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <div
          onClick={() => paginate(number)}
          key={number}
          className={
            currentPage === number ? "active-page page-number" : "page-number"
          }
        >
          {number}
        </div>
      );
    } else {
      return null;
    }
  });

  return (
    <div className="row center" style={{ marginTop: "10px" }}>
      <button
        onClick={handlePrevbtn}
        disabled={currentPage === pageNumbers[0] ? true : false}
      >
        Prev
      </button>
      {renderPageNumbers}
      <button
        onClick={handleNextbtn}
        disabled={
          currentPage === pageNumbers[pageNumbers.length - 1] ? true : false
        }
      >
        Next
      </button>
    </div>
  );
}
