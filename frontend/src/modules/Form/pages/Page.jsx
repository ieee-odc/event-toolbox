import React from 'react';
import Sidebar from '../../../core/components/sidebar/sidebar';
import Navbar from '../../../core/components/navbar/navbar';

const Page = () => {
  return (
    <div>
      <Navbar />
      <div className="content-wrapper">
        {/* <Sidebar /> */}

        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="py-3 mb-4">
            <span className="text-muted fw-light">Tables /</span> Basic Tables
          </h4>

          {/* Basic Bootstrap Table */}
          <div className="card">
            <h5 className="card-header">Table Basic</h5>
            <div className="table-responsive text-nowrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Users</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0">
                  <tr>
                    <td><i className="fab fa-angular fa-lg text-danger me-3"></i> <span className="fw-medium">Angular Project</span></td>
                    <td>Albert Cook</td>
                    <td>
                      <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" className="avatar avatar-xs pull-up" aria-label="Lilian Fuller" data-bs-original-title="Lilian Fuller">
                          <img src="../../assets/img/avatars/5.png" alt="Avatar" className="rounded-circle" />
                        </li>
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" className="avatar avatar-xs pull-up" aria-label="Sophia Wilkerson" data-bs-original-title="Sophia Wilkerson">
                          <img src="../../assets/img/avatars/6.png" alt="Avatar" className="rounded-circle" />
                        </li>
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" className="avatar avatar-xs pull-up" aria-label="Christina Parker" data-bs-original-title="Christina Parker">
                          <img src="../../assets/img/avatars/7.png" alt="Avatar" className="rounded-circle" />
                        </li>
                      </ul>
                    </td>
                    <td><span className="badge bg-label-primary me-1">Active</span></td>
                    <td>
                      <div className="dropdown">
                        <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i className="bx bx-dots-vertical-rounded"></i></button>
                        <div className="dropdown-menu">
                          <a className="dropdown-item" href="javascript:void(0);"><i className="bx bx-edit-alt me-1"></i> Edit</a>
                          <a className="dropdown-item" href="javascript:void(0);"><i className="bx bx-trash me-1"></i> Delete</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* Repeat similar rows for other projects */}
                </tbody>
              </table>
            </div>
          </div>
          {/*/ Basic Bootstrap Table */}

          <hr className="my-5" />
        </div>

        {/* Footer */}
        <footer className="content-footer footer bg-footer-theme">
          <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
            <div className="mb-2 mb-md-0">
              © <script>{`document.write(new Date().getFullYear())`}</script>2024, made with ❤️ by <a href="https://themeselection.com" target="_blank" className="footer-link fw-medium">ThemeSelection</a>
            </div>
            <div className="d-none d-lg-inline-block">
              <a href="https://themeselection.com/license/" className="footer-link me-4" target="_blank">License</a>
              <a href="https://themeselection.com/" target="_blank" className="footer-link me-4">More Themes</a>
              <a href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/" target="_blank" className="footer-link me-4">Documentation</a>
              <a href="https://themeselection.com/support/" target="_blank" className="footer-link d-none d-sm-inline-block">Support</a>
            </div>
          </div>
        </footer>
        {/* / Footer */}

        <div className="content-backdrop fade"></div>
      </div>
    </div>
  );
};

export default Page;
