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

  const handleDeleteWorkshop = (workshopId) => {
    axiosRequest.post(`/workshop/delete/${workshopId}`).then(() => {
      dispatch(deleteWorkshop(workshopId));
      toast.success("Workshop deleted successfully");
    });
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
  const progressPercentage = (currentParticipants, capacity) => {
    return (currentParticipants / capacity) * 100;
  };
  const handleEditWorkshop = (workshop) => {
    dispatch(
      setSelectedWorkshop({
        ...workshop,
        startTime: formatTime(workshop.startTime),
        endTime: formatTime(workshop.endTime),
        date: new Date(workshop.startTime),
      })
    );
    dispatch(toggleWorkshopModal());
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
          <WorkshopTableHeader />

          <div className="row g-4" style={{ justifyContent: "center" }}>
            {isLoading ? (
              <p>Loading workshops...</p>
            ) : (
              currentWorkshops &&
              currentWorkshops.map((workshop) => {
                const progressPercentage =
                (workshop.currentParticipants / workshop?.space?.capacity) * 100;

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
                      personCount={0}
                      personCapacity={workshop?.space?.capacity}
                      progress={progressPercentage}
                    />
                  </div>
                )
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
