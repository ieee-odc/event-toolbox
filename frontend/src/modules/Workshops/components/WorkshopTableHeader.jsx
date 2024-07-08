import React from 'react'

function WorkshopTableHeader({handleSearchChange,setIsModalOpen}) {
  return (
    <div className="row mx-1">
    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-3">
      <div className="dataTables_length" id="DataTables_Table_0_length">
        <label>
          <select
            name="DataTables_Table_0_length"
            aria-controls="DataTables_Table_0"
            className="form-select"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
      <div className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start mt-md-0 mt-3">
        <div className="dt-buttons btn-group flex-wrap">
          <button
            className="btn btn-secondary btn-primary"
            tabIndex={0}
            aria-controls="DataTables_Table_0"
            type="button"
            onClick={()=>{
              setIsModalOpen(true)
            }}
          >
            <span>
              <i className="bx bx-plus me-md-1" />
              <span className="d-md-inline-block d-none">
                Create Workshop
              </span>
            </span>
          </button>{" "}
        </div>
      </div>
    </div>
    <div className="col-12 col-md-6 d-flex align-items-center justify-content-end flex-column flex-md-row pe-3 gap-md-3">
     <div id="DataTables_Table_0_filter" className="dataTables_filter">
            <label>
              <input
                type="search"
                className="form-control"
                placeholder="Search Workshop"
                aria-controls="DataTables_Table_0"
                onChange={handleSearchChange}
              />
            </label>
          </div>
      <div className="invoice_status mb-3 mb-md-0">
        <select id="UserRole" className="form-select">
          <option value=""> Select Status </option>
          <option value="Pending" className="text-capitalize">
            Pending
          </option>
          <option value="Paid" className="text-capitalize">
            Paid
          </option>
          <option value="Canceled" className="text-capitalize">
            Canceled
          </option>
          
        </select>
      </div>
    </div>
  </div>
  )
}

export default WorkshopTableHeader
