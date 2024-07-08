import React from "react";
import CustomNavBar from "../NavBar/CustomNavBar";
import CustomSideBar from "../Sidebar/CustomSideBar";

function DashboardLayout({
  children,
  openSideBar,
  setOpenSideBar,
  isModalOpen,
  toggleSideBar,
}) {
  return (
    <div className="layout-container">
      <CustomSideBar
        openSideBar={openSideBar}
        toggleSideBar={toggleSideBar}
        activeTab="/participants"
      />
      <div
        className="layout-page"
        style={{ display: "flex", flexDirection: "column" }}
        onClick={() => {
          if (openSideBar) {
            toggleSideBar();
          }
        }}
      >
        <CustomNavBar toggleSideBar={toggleSideBar} />
        {/* Content wrapper */}
        <div className="content-wrapper">
          {/* Content */}
          {children}
          {/* / Content */}
          {/* Footer */}
          <footer className="content-footer footer bg-footer-theme">
            <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
              <div className="mb-2 mb-md-0">
                © 2024, made with ❤️ by{" "}
                <a
                  href="https://themeselection.com"
                  target="_blank"
                  className="footer-link fw-medium"
                >
                  EventBox
                </a>
              </div>
              <div className="d-none d-lg-inline-block">
                <a
                  href="https://themeselection.com/license/"
                  className="footer-link me-4"
                  target="_blank"
                >
                  Terms & Conditions
                </a>
                <a
                  href="https://themeselection.com/"
                  target="_blank"
                  className="footer-link me-4"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </footer>
          {/* / Footer */}
          <div className="content-backdrop fade" />
        </div>

        {/* Content wrapper */}
        {openSideBar && (
          <div
            className="layout-overlay layout-menu-toggle"
            style={{ display: "block" }}
          ></div>
        )}

        {isModalOpen && (
          <div
            className="content-backdrop fade"
            style={{ zIndex: "999", opacity: "0.3" }}
          >
            azdazd
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;
