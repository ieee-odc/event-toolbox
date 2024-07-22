import React, { useEffect, useState } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import { toast } from "react-hot-toast";
import WorkshopTableHeader from "./WorkshopTableHeader";
import WorkshopModal from "./WorkshopModal";
import { useNavigate, useParams } from "react-router-dom";
import { formatTime } from "../../../utils/helpers/FormatDateWithTime";
import { formatDateWithNumbers } from "../../../utils/helpers/FormatDate";
import { useDispatch, useSelector } from 'react-redux';
import { deleteWorkshop, filterWorkshops, initializeWorkshops, setSelectedWorkshop, toggleWorkshopModal, updateSelectedWorkshopField } from "../../../core/Features/Workshops";
import { UserData } from './../../../utils/UserData';

const WorkshopsCard = () => {
  const { eventId } = useParams();

  const {filteredWorkshops}=useSelector((state)=>state.workshopsStore)
  const userData=UserData();
const dispatch=useDispatch();
  const [dropdownStates, setDropdownStates] = useState({});
  const navigate = useNavigate();



  const handleDeleteWorkshop = (workshopId) => {
    axiosRequest.post(`/workshop/delete/${workshopId}`).then(() => {
      dispatch(deleteWorkshop(workshopId))
      toast.success("Workshop deleted successfully");
    });
  };

  const handleNavigateToForm = (formId) => {
    navigate(`/form/${formId}`);
  };

  const renderTag = (startTime) => {
    const workshopDate = new Date(startTime);
    const currentDate = new Date();

    // Calculate difference in milliseconds
    const differenceInTime = workshopDate.getTime() - currentDate.getTime();

    // Calculate difference in days
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    if (differenceInDays === 0) {
      return <span className="badge bg-label-info ms-auto">Today</span>;
    } else if (differenceInDays < 0) {
      return <span className="badge bg-label-secondary ms-auto">Over</span>;
    } else {
      return (
        <span className="badge bg-label-success ms-auto">{`${differenceInDays} Days left`}</span>
      );
    }
  };

  const initializeDropdownStates = (workshops) => {
    const initialStates = workshops.reduce((acc, workshop) => {
      acc[workshop.id] = false;
      return acc;
    }, {});
    setDropdownStates(initialStates);
  };



  const toggleDropdown = (workshopId) => {
    setDropdownStates({
      ...dropdownStates,
      [workshopId]: !dropdownStates[workshopId],
    });
  };

  const handleEditWorkshop = (workshop) => {
    dispatch(setSelectedWorkshop({
      ...workshop,
      startTime:formatTime(workshop.startTime),
      endTime: formatTime(workshop.endTime),
      date:new Date(workshop.startTime)
    }))
    dispatch(toggleWorkshopModal())
    setDropdownStates({
      ...dropdownStates,
      [workshop.id]: false,
    });
  };

  return (
    <div className="card" style={{ padding: "20px" }}>
      <div className="card-datatable table-responsive">
        <div
          id="DataTables_Table_0_wrapper"
          className="dataTables_wrapper dt-bootstrap5 no-footer"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <WorkshopTableHeader/>
          <div className="row g-4">
            {filteredWorkshops &&
              filteredWorkshops.map((workshop) => {
                const progressPercentage =
                  (workshop.currentParticipants / workshop.capacity) * 100;

                return (
                  <div className="col-xl-4 col-lg-6 col-md-6" key={workshop.id}>
                    <div className="card">
                      <div className="card-header">
                        <div className="d-flex align-items-start">
                          <div className="d-flex align-items-start">
                            <div className="avatar me-3">
                              <img
                                src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/assets/img/icons/brands/social-label.png"
                                alt="Avatar"
                                className="rounded-circle"
                              />
                            </div>
                            <div className="me-2">
                              <h5 className="mb-1">
                                <span className="h5">{workshop.name}</span>
                              </h5>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <div className="dropdown">
                              <a
                                href="javascript:;"
                                className="btn dropdown-toggle hide-arrow text-body p-0"
                                onClick={() => toggleDropdown(workshop.id)} // Toggle dropdown visibility
                                aria-expanded={dropdownStates[workshop.id]}
                              >
                                <i className="bx bx-dots-vertical-rounded" />
                              </a>
                              {dropdownStates[workshop.id] && ( // Render dropdown if dropdown state is true
                                <div
                                  className="dropdown-menu dropdown-menu-end"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <a
                                    href="javascript:;"
                                    className="dropdown-item"
                                  >
                                    Download
                                  </a>
                                  <a
                                    onClick={() => {
                                      handleEditWorkshop(workshop);
                                    }}
                                    className="dropdown-item"
                                  >
                                    Edit
                                  </a>
                                  <a
                                    href="javascript:;"
                                    className="dropdown-item"
                                  >
                                    Duplicate
                                  </a>
                                  <div className="dropdown-divider" />
                                  <a
                                    onClick={() => {
                                      handleDeleteWorkshop(workshop.id);
                                    }}
                                    style={{ cursor: "pointer" }}
                                    className="dropdown-item delete-record text-danger"
                                  >
                                    Delete
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body" style={{cursor:"pointer"}} onClick={()=>{
                        navigate(`/event/${eventId}/workshop/${workshop.id}`)
                      }}>
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="bg-lighter p-2 rounded me-auto mb-3">
                            <h6 className="mb-1">
                              <span className="text-body fw-normal">Form</span>{" "}
                              <span
                                onClick={() =>
                                  handleNavigateToForm(workshop.formId)
                                }
                              >
                                #{workshop.formId}
                              </span>
                            </h6>
                          </div>
                          <div className="text-end mb-3">
                            <h6 className="mb-1">
                              Date:{" "}
                              <span className="text-body fw-normal">
                                {formatDateWithNumbers(workshop.startTime)}
                              </span>
                            </h6>
                            <h6 className="mb-1">
                              Start Time:{" "}
                              <span className="text-body fw-normal">
                                {formatTime(workshop.startTime)}
                              </span>
                            </h6>
                            <h6 className="mb-1">
                              End Time:{" "}
                              <span className="text-body fw-normal">
                                {formatTime(workshop.endTime)}
                              </span>
                            </h6>
                          </div>
                        </div>
                        <p className="mb-0">{workshop.description}</p>
                      </div>
                      <div className="card-body border-top">
                        <div className="d-flex align-items-center mb-3">
                          {renderTag(workshop.startTime)}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small>
                            Person: {workshop.currentParticipants}/
                            {workshop.capacity}
                          </small>
                          <small>{progressPercentage.toFixed(2)}% Full</small>
                        </div>
                        <div className="progress mb-3" style={{ height: 8 }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${progressPercentage}%` }}
                            aria-valuenow={progressPercentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="row mx-2">
            <div className="col-sm-12 col-md-6">
              <div
                className="dataTables_info"
                id="DataTables_Table_0_info"
                role="status"
                aria-live="polite"
              >
                {`Showing  to of ${filteredWorkshops.length} entries`}
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div
                className="dataTables_paginate paging_simple_numbers"
                id="DataTables_Table_0_paginate"
              >
                <ul className="pagination">
                  <li
                    className={`paginate_button page-item previous`}
                    id="DataTables_Table_0_previous"
                  >
                    <a
                      aria-controls="DataTables_Table_0"
                      role="link"
                      tabIndex={-1}
                      className="page-link"
                    >
                      Previous
                    </a>
                  </li>
                    <li
                      className={`paginate_button page-item active`}
                    >
                      <a
                        href="#"
                        aria-controls="DataTables_Table_0"
                        role="link"
                        tabIndex={0}
                        className="page-link"
                      >
                        1
                      </a>
                    </li>
                  <li
                    className={`paginate_button page-item next}`}
                    id="DataTables_Table_0_next"
                  >
                    <a
                      aria-controls="DataTables_Table_0"
                      role="link"
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

          <WorkshopModal />
        </div>
      </div>
    </div>
  );
};

export default WorkshopsCard;
