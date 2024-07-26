import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosRequest from "../../../utils/AxiosConfig";
import { UserData } from "../../../utils/UserData";
import {
  selectSpace,
  toggleSpaceModal,
} from "../../../core/Features/Spaces";
import SpaceModal from "./SpaceModal";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { updateSelectedWorkshopField } from "../../../core/Features/Workshops";

function WorkshopSpaceContainer() {
  const { workshopId } = useParams();
  const dispatch = useDispatch();
  const { spaces, isLoading } = useSelector((store) => store.spacesStore);
  const {selectedWorkshop}=useSelector((store)=>store.workshopsStore);

  const handleSpaceClick = (space) => {
    Promise.all([
      axiosRequest.post(`/space/edit/${space.id}`, {
        workshopId,
      }),
      axiosRequest.post(`/workshop/edit/${workshopId}`, {
        spaceId: space.id,
      }),
    ])
      .then(() => {
        dispatch(updateSelectedWorkshopField({ id: "spaceId", value: space.id }));
        toast.success(`Selected ${space.name} space`);
      })
      .catch((error) => {
        console.error("Error updating space or workshop:", error);
      });
  };

  const handleOpenEditModal = (space) => {
    dispatch(selectSpace(space));
    dispatch(toggleSpaceModal());
  };

  return (
    <div className="flex-grow-1">
      <div className="card mb-4">
        <div className="card-widget-separator-wrapper">
          <div className="card-body card-widget-separator">
            <div className="row gy-4 gy-sm-1">
              <div className="col-sm-6 col-lg-3">
                <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                  <div>
                    <h3 className="mb-1">24</h3>
                    <p className="mb-0">Clients</p>
                  </div>
                  <div className="avatar me-sm-4">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-user bx-sm" />
                    </span>
                  </div>
                </div>
                <hr className="d-none d-sm-block d-lg-none me-4" />
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="d-flex justify-content-between align-items-start card-widget-2 border-end pb-3 pb-sm-0">
                  <div>
                    <h3 className="mb-1">165</h3>
                    <p className="mb-0">Invoices</p>
                  </div>
                  <div className="avatar me-lg-4">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-file bx-sm" />
                    </span>
                  </div>
                </div>
                <hr className="d-none d-sm-block d-lg-none" />
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="d-flex justify-content-between align-items-start border-end pb-3 pb-sm-0 card-widget-3">
                  <div>
                    <h3 className="mb-1">$2.46k</h3>
                    <p className="mb-0">Paid</p>
                  </div>
                  <div className="avatar me-sm-4">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-check-double bx-sm" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h3 className="mb-1">$876</h3>
                    <p className="mb-0">Unpaid</p>
                  </div>
                  <div className="avatar">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-error-circle bx-sm" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow-1">
        <div className="card overflow-hidden">
          <div className="d-flex app-logistics-fleet-wrapper">
            <div className="flex-shrink-0 position-fixed m-4 d-md-none w-auto z-1">
              <button
                className="btn btn-label-white border border-2 z-2 p-2"
                data-bs-toggle="sidebar"
                data-overlay=""
                data-target="#app-logistics-fleet-sidebar"
              >
                <i className="bx bx-menu"></i>
              </button>
            </div>
            <div
              className="app-logistics-fleet-sidebar col h-100 show"
              id="app-logistics-fleet-sidebar"
            >
              <div
                className="card-header border-0 pt-4 pb-2 d-flex justify-content-end"
                style={{ alignItems: "center" }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    dispatch(toggleSpaceModal());
                  }}
                >
                  <span>
                    <i className="bx bx-plus me-md-1" />
                    <span className="d-md-inline-block d-none">Add Venue</span>
                  </span>
                </button>
              </div>

              <div className="card-body p-0 logistics-fleet-sidebar-body ps">
                <div
                  className="accordion p-2"
                  id="fleet"
                  data-bs-toggle="sidebar"
                  data-overlay=""
                  data-target="#app-logistics-fleet-sidebar"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                  }}
                >
                  {spaces.map((space) => (
                    <div
                      key={space.id}
                      role="button"
                      className={`shadow-none collapsed`}
                      style={{
                        border:
                          selectedWorkshop.spaceId === space.id
                            ? "solid 1px black"
                            : "none",
                        display: "flex",
                        padding: "5px 10px",
                        justifyContent: "space-between",
                        borderRadius: 10,
                      }}
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "100%" }}
                        onClick={() => handleSpaceClick(space)}
                      >
                        <div className="avatar-wrapper">
                          <div className="avatar me-3">
                            <span className="avatar-initial rounded-circle bg-label-secondary">
                              <i className="bx bxs-truck"></i>
                            </span>
                          </div>
                        </div>
                        <span
                          className="d-flex flex-column"
                          style={{
                            width: "100%",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          <span className="h6 mb-0" style={{}}>
                            {space.name}
                          </span>
                          <span className="text-muted">{space.capacity}</span>
                        </span>
                      </div>
                      <div
                        onClick={() => {
                          handleOpenEditModal(space);
                        }}
                      >
                        edit
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="ps__rail-x"
                style={{ left: "0px", bottom: "0px" }}
              >
                <div
                  className="ps__thumb-x"
                  tabIndex="0"
                  style={{ left: "0px", width: "0px" }}
                ></div>
              </div>
              <div className="ps__rail-y" style={{ top: "0px", right: "0px" }}>
                <div
                  className="ps__thumb-y"
                  tabIndex="0"
                  style={{ top: "0px", height: "0px" }}
                ></div>
              </div>
            </div>
            <div className="app-overlay d-none show"></div>
          </div>
        </div>
        <SpaceModal />
      </div>
    </div>
  );
}

export default WorkshopSpaceContainer;
