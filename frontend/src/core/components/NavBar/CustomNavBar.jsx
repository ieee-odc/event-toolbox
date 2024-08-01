import React from "react";

function CustomNavBar({ toggleSideBar }) {
  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0   d-xl-none ">
        <i
          className="bx bx-menu bx-sm"
          style={{ cursor: "pointer" }}
          onClick={toggleSideBar}
        />
      </div>
      <div
        className="navbar-nav-right d-flex align-items-center"
        id="navbar-collapse"
      >
        {/* Search */}
        <div className="navbar-nav align-items-center">
          <div className="nav-item navbar-search-wrapper mb-0">
            <a className="nav-item nav-link search-toggler px-0">
              <i className="bx bx-search bx-sm" />
              <span className="d-none d-md-inline-block text-muted">
                Search
              </span>
            </a>
          </div>
        </div>
        {/* /Search */}
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          {/* Language */}
          <li className="nav-item dropdown-language dropdown me-2 me-xl-0">
            <a
              className="nav-link dropdown-toggle hide-arrow"
              data-bs-toggle="dropdown"
            >
              <i className="bx bx-globe bx-sm" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a
                  className="dropdown-item active"
                  data-language="en"
                  data-text-direction="ltr"
                >
                  <span className="align-middle">English</span>
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  data-language="fr"
                  data-text-direction="ltr"
                >
                  <span className="align-middle">French</span>
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  data-language="ar"
                  data-text-direction="rtl"
                >
                  <span className="align-middle">Arabic</span>
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  data-language="de"
                  data-text-direction="ltr"
                >
                  <span className="align-middle">German</span>
                </a>
              </li>
            </ul>
          </li>
          {/* /Language */}
          {/* Quick links  */}

          {/* Quick links */}
          {/* Style Switcher */}
          <li className="nav-item dropdown-style-switcher dropdown me-2 me-xl-0">
            <a
              className="nav-link dropdown-toggle hide-arrow"
              data-bs-toggle="dropdown"
            >
              <i className="bx bx-sm bx-sun" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-styles">
              <li>
                <a className="dropdown-item" data-theme="light">
                  <span className="align-middle">
                    <i className="bx bx-sun me-2" />
                    Light
                  </span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" data-theme="dark">
                  <span className="align-middle">
                    <i className="bx bx-moon me-2" />
                    Dark
                  </span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" data-theme="system">
                  <span className="align-middle">
                    <i className="bx bx-desktop me-2" />
                    System
                  </span>
                </a>
              </li>
            </ul>
          </li>
          {/* / Style Switcher*/}
          {/* Notification */}
          <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-1">
            <a
              className="nav-link dropdown-toggle hide-arrow"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
            >
              <i className="bx bx-bell bx-sm" />
              <span className="badge bg-danger rounded-pill badge-notifications">
                5
              </span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end py-0">
              <li className="dropdown-menu-header border-bottom">
                <div className="dropdown-header d-flex align-items-center py-3">
                  <h5 className="text-body mb-0 me-auto">Notification</h5>
                  <a
                    className="dropdown-notifications-all text-body"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    aria-label="Mark all as read"
                    data-bs-original-title="Mark all as read"
                  >
                    <i className="bx fs-4 bx-envelope-open" />
                  </a>
                </div>
              </li>
              <li className="dropdown-notifications-list scrollable-container ps">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item list-group-item-action dropdown-notifications-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <img
                            src="../../assets/img/avatars/1.png"
                            alt=""
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">Congratulation Lettie 🎉</h6>
                        <p className="mb-0">
                          Won the monthly best seller gold badge
                        </p>
                        <small className="text-muted">1h ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item list-group-item-action dropdown-notifications-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <span className="avatar-initial rounded-circle bg-label-danger">
                            CF
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">Charles Franklin</h6>
                        <p className="mb-0">Accepted your connection</p>
                        <small className="text-muted">12hr ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <img
                            src="../../assets/img/avatars/2.png"
                            alt=""
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">New Message ✉️</h6>
                        <p className="mb-0">
                          You have new message from Natalie
                        </p>
                        <small className="text-muted">1h ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item list-group-item-action dropdown-notifications-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <span className="avatar-initial rounded-circle bg-label-success">
                            <i className="bx bx-cart" />
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">Whoo! You have new order 🛒 </h6>
                        <p className="mb-0">ACME Inc. made new order $1,154</p>
                        <small className="text-muted">1 day ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <img
                            src="../../assets/img/avatars/9.png"
                            alt=""
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          Application has been approved 🚀{" "}
                        </h6>
                        <p className="mb-0">
                          Your ABC project application has been approved.
                        </p>
                        <small className="text-muted">2 days ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <span className="avatar-initial rounded-circle bg-label-success">
                            <i className="bx bx-pie-chart-alt" />
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">Monthly report is generated</h6>
                        <p className="mb-0">
                          July monthly financial report is generated{" "}
                        </p>
                        <small className="text-muted">3 days ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <img
                            src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template-free/assets/img/avatars/1.png"
                            alt=""
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">Send connection request</h6>
                        <p className="mb-0">
                          Peter sent you connection request
                        </p>
                        <small className="text-muted">4 days ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item list-group-item-action dropdown-notifications-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <img
                            src="../../assets/img/avatars/6.png"
                            alt=""
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">New message from Jane</h6>
                        <p className="mb-0">Your have new message from Jane</p>
                        <small className="text-muted">5 days ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <span className="avatar-initial rounded-circle bg-label-warning">
                            <i className="bx bx-error" />
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">CPU is running high</h6>
                        <p className="mb-0">
                          CPU Utilization Percent is currently at 88.63%,
                        </p>
                        <small className="text-muted">5 days ago</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <a className="dropdown-notifications-read">
                          <span className="badge badge-dot" />
                        </a>
                        <a className="dropdown-notifications-archive">
                          <span className="bx bx-x" />
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
                  <div
                    className="ps__thumb-x"
                    tabIndex={0}
                    style={{ left: 0, width: 0 }}
                  />
                </div>
                <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
                  <div
                    className="ps__thumb-y"
                    tabIndex={0}
                    style={{ top: 0, height: 0 }}
                  />
                </div>
              </li>
              <li className="dropdown-menu-footer border-top p-3">
                <button className="btn btn-primary text-uppercase w-100">
                  view all notifications
                </button>
              </li>
            </ul>
          </li>
          {/*/ Notification */}
          {/* User */}
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a
              className="nav-link dropdown-toggle hide-arrow"
              data-bs-toggle="dropdown"
            >
              <div className="avatar avatar-online">
                <img
                  src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template-free/assets/img/avatars/1.png"
                  alt=""
                  className="w-px-40 h-auto rounded-circle"
                />
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a
                  className="dropdown-item"
                  href="pages-account-settings-account.html"
                >
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img
                          src="../../assets/img/avatars/1.png"
                          alt=""
                          className="w-px-40 h-auto rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-medium d-block">John Doe</span>
                      <small className="text-muted">Admin</small>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <div className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item">
                  <i className="bx bx-user me-2" />
                  <span className="align-middle">My Profile</span>
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="pages-account-settings-account.html"
                >
                  <i className="bx bx-cog me-2" />
                  <span className="align-middle">Settings</span>
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="pages-account-settings-billing.html"
                >
                  <span className="d-flex align-items-center align-middle">
                    <i className="flex-shrink-0 bx bx-credit-card me-2" />
                    <span className="flex-grow-1 align-middle">Billing</span>
                    <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
                      4
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <div className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="pages-faq.html">
                  <i className="bx bx-help-circle me-2" />
                  <span className="align-middle">FAQ</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="pages-pricing.html">
                  <i className="bx bx-dollar me-2" />
                  <span className="align-middle">Pricing</span>
                </a>
              </li>
              <li>
                <div className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="auth-login-cover.html"
                  target="_blank"
                >
                  <i className="bx bx-power-off me-2" />
                  <span className="align-middle">Log Out</span>
                </a>
              </li>
            </ul>
          </li>
          {/*/ User */}
        </ul>
      </div>
      {/* Search Small Screens */}
      <div className="navbar-search-wrapper search-input-wrapper d-none">
        <span
          className="twitter-typeahead"
          style={{ position: "relative", display: "inline-block" }}
        >
          <input
            type="text"
            className="form-control search-input container-xxl border-0 tt-input"
            placeholder="Search..."
            aria-label="Search..."
            autoComplete="off"
            spellCheck="false"
            dir="auto"
            style={{ position: "relative", verticalAlign: "top" }}
          />
          <pre
            aria-hidden="true"
            style={{
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "pre",
              fontFamily:
                '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              fontSize: 15,
              fontStyle: "normal",
              fontVariant: "normal",
              fontWeight: 400,
              wordSpacing: 0,
              letterSpacing: 0,
              textIndent: 0,
              textRendering: "auto",
              textTransform: "none",
            }}
          />
          <div
            className="tt-menu navbar-search-suggestion ps"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 100,
              display: "none",
            }}
          >
            <div className="tt-dataset tt-dataset-pages" />
            <div className="tt-dataset tt-dataset-files" />
            <div className="tt-dataset tt-dataset-members" />
            <div className="ps__rail-x" style={{ left: 0, bottom: 0 }}>
              <div
                className="ps__thumb-x"
                tabIndex={0}
                style={{ left: 0, width: 0 }}
              />
            </div>
            <div className="ps__rail-y" style={{ top: 0, right: 0 }}>
              <div
                className="ps__thumb-y"
                tabIndex={0}
                style={{ top: 0, height: 0 }}
              />
            </div>
          </div>
        </span>
        <i className="bx bx-x bx-sm search-toggler cursor-pointer" />
      </div>
    </nav>
  );
}

export default CustomNavBar;
