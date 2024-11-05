import React from 'react'

export default function Pagination({ ordersPerPage, totalOrders, paginate, currentPage, maxPageNumberLimit, minPageNumberLimit, handlePrevbtn, handleNextbtn }) {

    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
        pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map(number => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
            return (
                <div key={number} className=" page-number">
                    <li  className={currentPage === number ? "active-page" : ""} onClick={() => paginate(number)}>
                        {number}
                    </li>
                </div>
            )
        } else {
            return null
        }
    })

    return (
        <div>
            <ul className="row center">
                <li>
                    <button onClick={handlePrevbtn} disabled={currentPage === pageNumbers[0] ? true : false}>
                        Prev
                    </button>
                </li>
                {renderPageNumbers}
                <li>
                    <button onClick={handleNextbtn} disabled={currentPage === pageNumbers[pageNumbers.length - 1] ? true : false}>
                        Next
                    </button>
                </li>
            </ul>
        </div>
    )
}
