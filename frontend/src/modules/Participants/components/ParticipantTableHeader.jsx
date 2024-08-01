import React from "react";
import { useDispatch } from "react-redux";
import {
  toggleParticipantModal,
  setParticipantsPerPage,
  resetParticipantModal,
} from "../../../core/Features/Participants";
import CustomButton from "../../../core/components/Button/Button";
import "../Participants.css";

function ParticipantTableHeader({ onSearchChange }) {
  const dispatch = useDispatch();
  const handleParticipantsPerPageChange = (e) => {
    dispatch(setParticipantsPerPage(Number(e.target.value)));
  };

  return (
    <div className="row mx-1">
      <div
        id="create-workshop-container"
        className="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-3"
      >
        <div
          style={{ width: "auto" }}
          className="dataTables_length"
          id="DataTables_Table_0_length"
        >
          <label>
            <select
              name="DataTables_Table_0_length"
              aria-controls="DataTables_Table_0"
              className="form-select extend-select"
              onChange={handleParticipantsPerPageChange}
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
            <CustomButton
              text="Create Participant"
              iconClass="bx bx-plus me-md-1"
              style={{ padding: "5px" }}
              backgroundColor="var(--primary-color)"
              textColor="white"
              hoverBackgroundColor="#0F205D"
              hoverTextColor="white"
              onClick={() => {
                dispatch(resetParticipantModal() );
                dispatch(toggleParticipantModal());
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-end flex-column flex-md-row pe-3 gap-md-3">
        <div id="DataTables_Table_0_filter" className="dataTables_filter">
          <label>
            <input
              type="search"
              className="form-control"
              placeholder="Search Participant"
              aria-controls="DataTables_Table_0"
              onChange={onSearchChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ParticipantTableHeader;
