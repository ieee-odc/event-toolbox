import React from "react";
import { useDispatch } from "react-redux";
import {
  filterWorkshops,
  toggleWorkshopModal,
  resetWorkshopModal,
  setWorkshopsPerPage,
} from "../../../core/Features/Workshops";
import CustomButton from "../../../core/components/Button/Button";
import "../Workshops.css";
function WorkshopTableHeader() {
  const dispatch = useDispatch();

  const handleSearchChange = (event) => {
    dispatch(filterWorkshops(event.target.value));
  };

  const handleWorkshopsPerPageChange = (e) => {
    dispatch(setWorkshopsPerPage(Number(e.target.value)));
  };

  return (
    <div className="row mx-1">
      <div
        id="create-workshop-container"
        className="col-12 col-md-10 d-flex align-items-center justify-content-center justify-content-md-start gap-3"
      >
        <div className="dataTables_length" id="DataTables_Table_0_length">
          <label>
            <select
              name="DataTables_Table_0_length"
              aria-controls="DataTables_Table_0"
              className="form-select extend-select"
              onChange={handleWorkshopsPerPageChange}
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={18}>18</option>
            </select>
          </label>
        </div>
        <div
          className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start mt-md-0 mt-3"
          id="create-workshop"
        >
          <div className="dt-buttons btn-group flex-wrap">
            <CustomButton
              text="Create Session"
              iconClass="bx bx-plus me-md-1 mrt-1"
              tabIndex={0}
              aria-controls="DataTables_Table_0"
              backgroundColor="var(--primary-color)"
              textColor="white"
              hoverBackgroundColor="#0F205D"
              hoverTextColor="white"
              onClick={() => {
                dispatch(resetWorkshopModal());
                dispatch(toggleWorkshopModal());
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-end flex-column flex-md-row pe-3 gap-md-3">

          <div
            id="DataTables_Table_0_filter"
            className="dataTables_filter"
          >
            <label className="w-200">
              <input
                type="search"
                className="form-control"
                placeholder="Search Session"
                aria-controls="DataTables_Table_0"
                onChange={handleSearchChange}
              />
            </label>
          </div>
        </div>

      </div>

    </div>
  );
}

export default WorkshopTableHeader;
