import React, { useEffect, useState } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import ParticipantTableHeader from "./ParticipantTableHeader";
import ParticipantModal from "./ParticipantModal";
import { toast } from "react-hot-toast";
import { formatDateWithShort } from "../../../utils/helpers/FormatDate";

const ParticipationStatus = Object.freeze({
  PAID: "Paid",
  PENDING: "Pending",
  CANCELED: "Canceled",
});

const ParticipantsCard = ({setIsModalOpen,isModalOpen}) => {
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  const getStatusIcon = (status) => {
    switch (status) {
      case ParticipationStatus.PAID:
        return <span className="badge bg-label-success">Paid</span>;
      case ParticipationStatus.PENDING:
        return <span className="badge bg-label-warning">Pending</span>;
      case ParticipationStatus.CANCELED:
        return <span className="badge bg-label-danger">Canceled</span>;
      default:
        return <i className="bx bx-info-circle text-info"></i>;
    }
  };

  const handleSearchChange = (event) => {
    const filtered = participants.filter(
      (participant) =>
        participant.fullName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        participant.email
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
    );
    setFilteredParticipants(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    // Change this when we add events
    axiosRequest.get("/participant/get-event/1").then((res) => {
      setParticipants(res.data.participants);
      setFilteredParticipants(res.data.participants);
    });
  }, []);

  useEffect(() => {
    setFilteredParticipants(participants);
  }, [participants]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredParticipants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDeleteParticipant = (participantId) => {
    axiosRequest.post(`/participant/delete/${participantId}`).then(() => {
      setParticipants(
        participants.filter((participant) => participant.id !== participantId)
      );
      setFilteredParticipants(
        filteredParticipants.filter(
          (participant) => participant.id !== participantId
        )
      );
      toast.success("Participant deleted successfully");
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
          <ParticipantTableHeader
            handleSearchChange={handleSearchChange}
            setIsModalOpen={setIsModalOpen}
          />
          <div className="table-responsive">
            <table
              className="invoice-list-table table border-top dataTable no-footer dtr-column"
              id="DataTables_Table_0"
              aria-describedby="DataTables_Table_0_info"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
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
                    style={{ width: 100 }}
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
                    Email
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
                    className="cell-fit sorting_disabled"
                    rowSpan={1}
                    colSpan={1}
                    style={{ width: 76 }}
                    aria-label="Actions"
                  >
                    Status
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
                {currentItems.map((participant, index) => (
                  <tr
                    className={`${index % 2 === 0 ? "even" : "odd"}`}
                    key={participant.id}
                  >
                    <td className="sorting_1">
                      <span
                        className="fw-medium"
                        style={{
                          fontWeight: "500",
                          color: "#646cff",
                          textDecoration: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        #{participant.id}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="avatar-wrapper">
                          <div className="avatar avatar-sm me-2">
                            <span className="avatar-initial rounded-circle bg-label-dark">
                              <i className="bx bx-user"></i>
                            </span>
                          </div>
                        </div>
                        <div className="d-flex flex-column">
                          <a
                            href="pages-profile-user.html"
                            className="text-body text-truncate"
                          >
                            <span className="fw-medium">
                              {participant.fullName}
                            </span>
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="d-flex flex-column">
                          <a
                            href="pages-profile-user.html"
                            className="text-body text-truncate"
                          >
                            <span className="fw-medium">
                              {participant.email}
                            </span>
                          </a>
                        </div>
                      </div>
                    </td>
                    
                    <td className="">
                      <span className="d-none"></span>{formatDateWithShort(participant.createdAt)}
                    </td>
                    <td>{getStatusIcon(participant.status)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                      <a
  href={`mailto:${participant.email}`}
  data-bs-toggle="tooltip"
  className="text-body"
  data-bs-placement="top"
  aria-label="Send Mail"
  data-bs-original-title="Send Mail"
>
  <i className="bx bx-send mx-1" />
</a>
                        <a
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
                              onClick={() => {
                                handleDeleteParticipant(participant.id);
                              }}
                              style={{cursor: 'pointer'}}
                              className="dropdown-item delete-record text-danger"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row mx-2">
            <div className="col-sm-12 col-md-6">
              <div
                className="dataTables_info"
                id="DataTables_Table_0_info"
                role="status"
                aria-live="polite"
              >
                {`Showing ${indexOfFirstItem + 1} to ${
                  indexOfLastItem > filteredParticipants.length
                    ? filteredParticipants.length
                    : indexOfLastItem
                } of ${filteredParticipants.length} entries`}
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div
                className="dataTables_paginate paging_simple_numbers"
                id="DataTables_Table_0_paginate"
              >
                <ul className="pagination">
                  <li
                    className={`paginate_button page-item previous ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    id="DataTables_Table_0_previous"
                  >
                    <a
                      onClick={handlePrevious}
                      aria-controls="DataTables_Table_0"
                      aria-disabled={currentPage === 1}
                      role="link"
                      tabIndex={-1}
                      className="page-link"
                    >
                      Previous
                    </a>
                  </li>
                  {[...Array(totalPages).keys()].map((number) => (
                    <li
                      key={number + 1}
                      className={`paginate_button page-item ${
                        currentPage === number + 1 ? "active" : ""
                      }`}
                    >
                      <a
                        onClick={() => paginate(number + 1)}
                        href="#"
                        aria-controls="DataTables_Table_0"
                        role="link"
                        tabIndex={0}
                        className="page-link"
                      >
                        {number + 1}
                      </a>
                    </li>
                  ))}
                  <li
                    className={`paginate_button page-item next ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                    id="DataTables_Table_0_next"
                  >
                    <a
                      onClick={handleNext}
                      aria-controls="DataTables_Table_0"
                      aria-disabled={currentPage === totalPages}
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

          <ParticipantModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setParticipants={setParticipants}
          />

      </div>
      </div>
      
    </div>
  );
};

export default ParticipantsCard;
