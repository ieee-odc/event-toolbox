import React, { useEffect, useState } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import { toast } from "react-hot-toast";
import WorkshopTableHeader from "./WorkshopTableHeader";
import WorkshopModal from "./WorkshopModal";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../../utils/helpers/FormatDateWithTime";
import { formatDateWithNumbers } from "../../../utils/helpers/FormatDate";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWorkshop,
  filterWorkshops,
  initializeWorkshops,
  setSelectedWorkshop,
  toggleWorkshopModal,
  updateSelectedWorkshopField,
} from "../../../core/Features/Workshops";
import { UserData } from "./../../../utils/UserData";
import Pagination from "../../../core/components/Pagination/Pagination";
import Card from "../../../core/components/Card/Card";

const WorkshopsCard = () => {
  const { filteredWorkshops, workshopsPerPage, isLoading } = useSelector(
    (state) => state.workshopsStore
  );
  const userData = UserData();
  const dispatch = useDispatch();
  const [dropdownStates, setDropdownStates] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastWorkshop = currentPage * workshopsPerPage;
  const indexOfFirstWorkshop = indexOfLastWorkshop - workshopsPerPage;
  const currentWorkshops = filteredWorkshops.slice(
    indexOfFirstWorkshop,
    indexOfLastWorkshop
  );

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

  return (
    <div className="card" style={{ padding: "20px" }}>
      <div className="card-datatable table-responsive">
        <div
          id="DataTables_Table_0_wrapper"
          className="dataTables_wrapper dt-bootstrap5 no-footer"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
<div className="d-flex justify-content-between align-items-center mb-4">
            <WorkshopTableHeader />
            <div className="d-flex align-items-center gap-2">
              <select
                id="participantStatusFilter"
                className="form-select"
                // onChange={handleStatusChange}
              >
                <option value="">All Workshops</option>
                <option value="Paid">Done</option>
                <option value="Pending">Starting Soon</option>
              </select>
            </div>
          </div>
          <div className="row g-4" style={{ justifyContent: "center" }}>
            {isLoading ? (
              <p>Loading workshops...</p>
            ) : (
              currentWorkshops &&
              currentWorkshops.map((workshop) => {
                const progressPercentage = (
                  (workshop.currentParticipants / workshop?.numberOfAttendees) *
                  100
                ).toFixed(2);

                return (
                  <div className=" col-md-4" key={workshop.id}>
                    <Card
                      title={workshop.name}
                      formText={workshop.formId}
                      workshop={workshop}
                      date={formatDateWithNumbers(workshop.endTime)}
                      endTime={formatTime(workshop.endTime)}
                      startTime={formatTime(workshop.startTime)}
                      description={workshop.description}
                      badgeText={renderTag(workshop.startTime)}
                      personCount={workshop.currentParticipants}
                      personCapacity={workshop?.numberOfAttendees}
                      progress={progressPercentage}
                    />
                  </div>
                );
              })
            )}
          </div>
          <div className="row mx-2" id="pagination-section">
            <div className="col-sm-12 col-md-6">
              <div
                className="dataTables_info"
                id="DataTables_Table_0_info"
                role="status"
                aria-live="polite"
              >
                {`Showing ${indexOfFirstWorkshop + 1} to ${Math.min(
                  indexOfLastWorkshop,
                  filteredWorkshops.length
                )} of ${filteredWorkshops.length} entries`}
              </div>
            </div>
            <Pagination
              unitsPerPage={workshopsPerPage}
              totalUnits={filteredWorkshops.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>

          <WorkshopModal />
        </div>
      </div>
    </div>
  );
};

export default WorkshopsCard;
