import React from "react";
import "./Pagination.css";

const Pagination = ({
  unitsPerPage,
  totalUnits,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUnits / unitsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="col-sm-12 col-md-6">
      <div className="dataTables_paginate paging_simple_numbers">
        <ul className="pagination">
          <li
            className={`paginate_button page-item previous ${
              currentPage === 1 ? "disabled" : ""
            }`}
            onClick={handlePrevPage}
          >
            <a
              aria-controls="DataTables_Table_0"
              role="link"
              tabIndex={-1}
              className="page-link"
              id="previous"
            >
              <span>
                <i className="bx bx-left-arrow-alt me-1 md-2"></i>
                <span className="d-md-inline-block d-none">Previous</span>
              </span>
            </a>
          </li>
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`paginate_button page-item ${
                number === currentPage ? "active" : ""
              }`}
            >
              <a
                onClick={() => handlePageChange(number)}
                aria-controls="DataTables_Table_0"
                role="link"
                tabIndex={0}
                className="page-link"
                style={{ cursor: "pointer" }}
              >
                {number}
              </a>
            </li>
          ))}
          <li
            className={`paginate_button page-item next ${
              currentPage === pageNumbers.length ? "disabled" : ""
            }`}
            onClick={handleNextPage}
          >
            <a
              aria-controls="DataTables_Table_0"
              role="link"
              tabIndex={0}
              className="page-link"
              id="next"
            >
              <span>
                <span className="d-md-inline-block d-none">Next</span>
                <i className="bx bx-right-arrow-alt me-1 md-2"></i>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
