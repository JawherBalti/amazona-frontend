import React from "react";
import { useHistory } from "react-router-dom";

export default function Pagination({ page, pages, searchTerm, link }) {
  const location = useHistory();

  const handlePaginate = (e) => {
    const url = `/${link}?page=${e.target.innerHTML}`;
    if (searchTerm) {
      location.push(`${url}&searchTerm=${searchTerm}`);
    } else {
      location.push(url);
    }
  };
  const handlePrevbtn = (e) => {
    if(Number(page)<1) page = 1
    const url = `/${link}?page=${Number(page)-1}`;
    if (searchTerm) {
      location.push(`${url}&searchTerm=${searchTerm}`);
    } else {
      location.push(url);
    }
  };
  const handleNextbtn = (e) => {
    if(Number(page)> pages) page = pages
    const url = `/${link}?page=${Number(page) +1}`;
    if (searchTerm) {
      location.push(`${url}&searchTerm=${searchTerm}`);
    } else {
      location.push(url);
    }
  };

  return (
    <div className="row center" style={{ marginTop: "10px" }}>
      <button
        onClick={(e) => handlePrevbtn(e)}
        disabled={Number(page)=== 1 ? true : false}
      >
        Prev
      </button>
      {[...Array(pages).keys()].map((x) => (
        <div
          className={
            x + 1 === Number(page) ? "active-page page-number" : "page-number"
          }
          key={x + 1}
          onClick={(e) => handlePaginate(e)}
        >
          {x + 1}
        </div>
      ))}
      <button onClick={handleNextbtn} disabled={Number(page) === pages ? true : false}>
        Next
      </button>
    </div>
  );
}
