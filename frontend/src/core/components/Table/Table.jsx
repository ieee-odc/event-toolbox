import React from "react";

//dataSource
// const dataSource = [
//     {
//       key: '1',
//       name: 'Mike',
//       age: 32,
//       address: '10 Downing Street',
//     },
//     {
//       key: '2',
//       name: 'John',
//       age: 42,
//       address: '10 Downing Street',
//     },
//   ];

//Columns
// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     key: 'age',
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//     key: 'address',
//   },
// ];
function Table({ dataSource, columns, actions, hasSearchBar = true }) {
  // const actions=[
  //     {
  //       title: 'Actions',
  //       key: 'action',
  //       render: (record) => (
  //         <div>
  //           <button
  //             className="btn btn-sm btn-info"
  //             onClick={() => handleEdit(record)}
  //           >
  //             Edit
  //           </button>
  //           <button
  //             className="btn btn-sm btn-danger ms-1"
  //             onClick={() => handleDelete(record.key)}
  //           >
  //             Delete
  //           </button>
  //         </div>
  //       ),
  //     },
  // ]
  return (
    <div className="card">
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
              {hasSearchBar && (
                <div
                  id="DataTables_Table_0_filter"
                  className="dataTables_filter"
                >
                  <label>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search Invoice"
                      aria-controls="DataTables_Table_0"
                    />
                  </label>
                </div>
              )}
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
                  style={{ width: 66 }}
                  aria-label=": activate to sort column ascending"
                >
                  <i className="bx bx-trending-up" />
                </th>
                <th
                  className="sorting"
                  tabIndex={0}
                  aria-controls="DataTables_Table_0"
                  rowSpan={1}
                  colSpan={1}
                  style={{ width: 345 }}
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
                  Total
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
                  className="sorting_disabled"
                  rowSpan={1}
                  colSpan={1}
                  style={{ width: 126 }}
                  aria-label="Balance"
                >
                  Balance
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
              <tr className="odd">
                <td
                  className="  control"
                  tabIndex={0}
                  style={{ display: "none" }}
                />
                <td className="sorting_1">
                  <a href="app-invoice-preview.html">
                    <span className="fw-medium">#5089</span>
                  </a>
                </td>
                <td>
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-html="true"
                    aria-label='<span>Sent<br> <span className="fw-medium">Balance:</span> 0<br> <span className="fw-medium">Due Date:</span> 05/09/2020</span>'
                    data-bs-original-title='<span>Sent<br> <span className="fw-medium">Balance:</span> 0<br> <span className="fw-medium">Due Date:</span> 05/09/2020</span>'
                  >
                    <span className="badge badge-center rounded-pill bg-label-secondary w-px-30 h-px-30">
                      <i className="bx bx-paper-plane bx-xs" />
                    </span>
                  </span>
                </td>
                <td>
                  <div className="d-flex justify-content-start align-items-center">
                    <div className="avatar-wrapper">
                      <div className="avatar avatar-sm me-2">
                        <span className="avatar-initial rounded-circle bg-label-dark">
                          JK
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <a
                        href="pages-profile-user.html"
                        className="text-body text-truncate"
                      >
                        <span className="fw-medium">Jamal Kerrod</span>
                      </a>
                      <small className="text-truncate text-muted">
                        Software Development
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="d-none">3077</span>$3077
                </td>
                <td>
                  <span className="d-none">20200509</span>09 May 2020
                </td>
                <td>
                  <span className="badge bg-label-success"> Paid </span>
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
                        <a
                          href="app-invoice-edit.html"
                          className="dropdown-item"
                        >
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
              <tr className="even">
                <td
                  className="  control"
                  tabIndex={0}
                  style={{ display: "none" }}
                />
                <td className="sorting_1">
                  <a href="app-invoice-preview.html">
                    <span className="fw-medium">#5041</span>
                  </a>
                </td>
                <td>
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-html="true"
                    aria-label='<span>Sent<br> <span className="fw-medium">Balance:</span> 0<br> <span className="fw-medium">Due Date:</span> 11/19/2020</span>'
                    data-bs-original-title='<span>Sent<br> <span className="fw-medium">Balance:</span> 0<br> <span className="fw-medium">Due Date:</span> 11/19/2020</span>'
                  >
                    <span className="badge badge-center rounded-pill bg-label-secondary w-px-30 h-px-30">
                      <i className="bx bx-paper-plane bx-xs" />
                    </span>
                  </span>
                </td>
                <td>
                  <div className="d-flex justify-content-start align-items-center">
                    <div className="avatar-wrapper">
                      <div className="avatar avatar-sm me-2">
                        <img
                          src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template-free/assets/img/avatars/7.png"
                          alt="Avatar"
                          className="rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <a
                        href="pages-profile-user.html"
                        className="text-body text-truncate"
                      >
                        <span className="fw-medium">Shamus Tuttle</span>
                      </a>
                      <small className="text-truncate text-muted">
                        Software Development
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="d-none">2230</span>$2230
                </td>
                <td>
                  <span className="d-none">20201119</span>19 Nov 2020
                </td>
                <td>
                  <span className="badge bg-label-success"> Paid </span>
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
                        <a
                          href="app-invoice-edit.html"
                          className="dropdown-item"
                        >
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
  );
}

export default Table;
