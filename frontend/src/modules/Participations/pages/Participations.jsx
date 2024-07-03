import React from 'react'
import Table from '../../../core/components/Table/Table'

const ParticipationStatus = Object.freeze({
    PAID: 'Paid',
    PENDING: 'Pending',
    CANCELED: 'Canceled'
  });
  

function Participations() {
    const participants = [
        {
            id: 1,
            email: "slim@gmail.com",
            fullName: "Slim Skhab",
            status: ParticipationStatus.PAID,
            createDate: "2024-06-01",
            data: {}
        },
        {
            id: 2,
            email: "amira@gmail.com",
            fullName: "Amira Ben Salah",
            status: ParticipationStatus.PENDING,
            createDate: "2024-06-05",
            data: {}
        },
        {
            id: 3,
            email: "ahmed@gmail.com",
            fullName: "Ahmed Ben Ali",
            status: ParticipationStatus.CANCELED,
            createDate: "2024-06-10",
            data: {}
        },
        {
            id: 4,
            email: "rachid@gmail.com",
            fullName: "Rachid Zouari",
            status: ParticipationStatus.PAID,
            createDate: "2024-06-15",
            data: {}
        },
        {
            id: 5,
            email: "sara@gmail.com",
            fullName: "Sara Mansour",
            status: ParticipationStatus.PENDING,
            createDate: "2024-06-20",
            data: {}
        }
    ];

    const filteredParticipants=participants
const getStatusIcon=(status)=>{
    switch(status){
        case ParticipationStatus.PAID:
            return <span class="badge bg-label-success">Paid </span>
        case ParticipationStatus.PENDING:
            return <span class="badge bg-label-warning">Pending </span>
        case ParticipationStatus.CANCELED:
            return <span class="badge bg-label-danger">Canceled </span>
        default:
            return <i className="bx bx-info-circle text-info"></i>
    }
}

    return (
        <div className="card" >
  <div className="card-datatable table-responsive">
    <div
      id="DataTables_Table_0_wrapper"
      className="dataTables_wrapper dt-bootstrap5 no-footer"
    >
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
              >
                <span>
                  <i className="bx bx-plus me-md-1" />
                  <span className="d-md-inline-block d-none">
                    Create Invoice
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
                    placeholder="Search Invoice"
                    aria-controls="DataTables_Table_0"
                    onChange={handleSearchChange}
                  />
                </label>
              </div>
          <div className="invoice_status mb-3 mb-md-0">
            <select id="UserRole" className="form-select">
              <option value=""> Select Status </option>
              <option value="Downloaded" className="text-capitalize">
                Downloaded
              </option>
              <option value="Draft" className="text-capitalize">
                Draft
              </option>
              <option value="Paid" className="text-capitalize">
                Paid
              </option>
              <option value="Partial Payment" className="text-capitalize">
                Partial Payment
              </option>
              <option value="Past Due" className="text-capitalize">
                Past Due
              </option>
              <option value="Sent" className="text-capitalize">
                Sent
              </option>
            </select>
          </div>
        </div>
      </div>
      <table
        className="invoice-list-table table border-top dataTable no-footer dtr-column"
        id="DataTables_Table_0"
        aria-describedby="DataTables_Table_0_info"
        style={{ width: 1275 }}
      >
        <thead>
          <tr>
            {/* <th
              className="control sorting"
              tabIndex={0}
              aria-controls="DataTables_Table_0"
              rowSpan={1}
              colSpan={1}
              style={{ width: 0, display: "none" }}
              aria-label=": activate to sort column ascending"
            /> */}
            <th
              className="sorting sorting_desc"
              tabIndex={0}
              aria-controls="DataTables_Table_0"
              rowSpan={1}
              colSpan={1}
              style={{ width: 92 }}
              aria-label="#ID: activate to sort column ascending"
              aria-sort="descending"
            >
              #ID
            </th>

            <th
              className="sorting"
              tabIndex={0}
              aria-controls="DataTables_Table_0"
              rowSpan={1}
              colSpan={1}
              style={{ width: 100 }}
              aria-label="Client: activate to sort column ascending"
            >
              Client
            </th>
            <th
              className="sorting"
              tabIndex={0}
              aria-controls="DataTables_Table_0"
              rowSpan={1}
              colSpan={1}
              style={{ width: 96 }}
              aria-label="Total: activate to sort column ascending"
            >
              Email
            </th>
            <th
              className="text-truncate sorting"
              tabIndex={0}
              aria-controls="DataTables_Table_0"
              rowSpan={1}
              colSpan={1}
              style={{ width: 168 }}
              aria-label="Issued Date: activate to sort column ascending"
            >
              Issued Date
            </th>
            <th
              className="cell-fit sorting_disabled"
              rowSpan={1}
              colSpan={1}
              style={{ width: 76 }}
              aria-label="Actions"
            >
              Status
            </th>
            <th
              className="cell-fit sorting_disabled"
              rowSpan={1}
              colSpan={1}
              style={{ width: 76 }}
              aria-label="Actions"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {
            participants && participants.map((participant,index) =>{
                return <tr className={`${index/2===0?"even":"odd"}`}>
                <td
                  className="  control"
                  tabIndex={0}
                  style={{ display: "none" }}
                />
                <td className="sorting_1">
                    <span className="fw-medium" style={{fontWeight: "500",
    color: "#646cff",
    textDecoration: "inherit",cursor:"pointer"}}>#{participant.id}</span>
                </td>
                
                <td>
                  <div className="d-flex justify-content-start align-items-center">
                    <div className="avatar-wrapper">
                      <div className="avatar avatar-sm me-2">
                        <span className="avatar-initial rounded-circle bg-label-dark">
                        <i class='bx bx-user'></i>
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <a
                        href="pages-profile-user.html"
                        className="text-body text-truncate"
                      >
                        <span className="fw-medium">{participant.fullName}</span>
                      </a>
                     
                    </div>
                  </div>
                </td>
                <td>
                <div className="d-flex justify-content-start align-items-center">
                    <div className="d-flex flex-column">
                      <a
                        href="pages-profile-user.html"
                        className="text-body text-truncate"
                      >
                        <span className="fw-medium">{participant.email}</span>
                      </a>
                     
                    </div>
                  </div>
                </td>
                <td className=''>
                  <span className="d-none"></span>09 May 2020
                </td>
                <td>
                  {getStatusIcon(participant.status)}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <a
                      href="javascript:;"
                      data-bs-toggle="tooltip"
                      className="text-body"
                      data-bs-placement="top"
                      aria-label="Send Mail"
                      data-bs-original-title="Send Mail"
                    >
                      <i className="bx bx-send mx-1" />
                    </a>
                    <a
                      href="app-invoice-preview.html"
                      data-bs-toggle="tooltip"
                      className="text-body"
                      data-bs-placement="top"
                      aria-label="Preview Invoice"
                      data-bs-original-title="Preview Invoice"
                    >
                      <i className="bx bx-show mx-1" />
                    </a>
                    <div className="dropdown">
                      <a
                        href="javascript:;"
                        className="btn dropdown-toggle hide-arrow text-body p-0"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bx bx-dots-vertical-rounded" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:;" className="dropdown-item">
                          Download
                        </a>
                        <a href="app-invoice-edit.html" className="dropdown-item">
                          Edit
                        </a>
                        <a href="javascript:;" className="dropdown-item">
                          Duplicate
                        </a>
                        <div className="dropdown-divider" />
                        <a
                          href="javascript:;"
                          className="dropdown-item delete-record text-danger"
                        >
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            })
          }

        </tbody>
      </table>
      <div className="row mx-2">
        <div className="col-sm-12 col-md-6">
          <div
            className="dataTables_info"
            id="DataTables_Table_0_info"
            role="status"
            aria-live="polite"
          >
            Showing 1 to 10 of 50 entries
          </div>
        </div>
        <div className="col-sm-12 col-md-6">
          <div
            className="dataTables_paginate paging_simple_numbers"
            id="DataTables_Table_0_paginate"
          >
            <ul className="pagination">
              <li
                className="paginate_button page-item previous disabled"
                id="DataTables_Table_0_previous"
              >
                <a
                  aria-controls="DataTables_Table_0"
                  aria-disabled="true"
                  role="link"
                  data-dt-idx="previous"
                  tabIndex={-1}
                  className="page-link"
                >
                  Previous
                </a>
              </li>
              <li className="paginate_button page-item active">
                <a
                  href="#"
                  aria-controls="DataTables_Table_0"
                  role="link"
                  aria-current="page"
                  data-dt-idx={0}
                  tabIndex={0}
                  className="page-link"
                >
                  1
                </a>
              </li>
              <li className="paginate_button page-item ">
                <a
                  href="#"
                  aria-controls="DataTables_Table_0"
                  role="link"
                  data-dt-idx={1}
                  tabIndex={0}
                  className="page-link"
                >
                  2
                </a>
              </li>
              <li className="paginate_button page-item ">
                <a
                  href="#"
                  aria-controls="DataTables_Table_0"
                  role="link"
                  data-dt-idx={2}
                  tabIndex={0}
                  className="page-link"
                >
                  3
                </a>
              </li>
              <li className="paginate_button page-item ">
                <a
                  href="#"
                  aria-controls="DataTables_Table_0"
                  role="link"
                  data-dt-idx={3}
                  tabIndex={0}
                  className="page-link"
                >
                  4
                </a>
              </li>
              <li className="paginate_button page-item ">
                <a
                  href="#"
                  aria-controls="DataTables_Table_0"
                  role="link"
                  data-dt-idx={4}
                  tabIndex={0}
                  className="page-link"
                >
                  5
                </a>
              </li>
              <li
                className="paginate_button page-item next"
                id="DataTables_Table_0_next"
              >
                <a
                  href="#"
                  aria-controls="DataTables_Table_0"
                  role="link"
                  data-dt-idx="next"
                  tabIndex={0}
                  className="page-link"
                >
                  Next
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


    )
}

export default Participations
