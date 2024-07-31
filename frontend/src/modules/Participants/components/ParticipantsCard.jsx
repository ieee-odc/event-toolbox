import React, { useEffect, useState } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import ParticipantTableHeader from "./ParticipantTableHeader";
import ParticipantModal from "./ParticipantModal";
import ParticipantDetails from "./ParticipantDetails";
import { toast } from "react-hot-toast";
import { formatDateWithShort } from "../../../utils/helpers/FormatDate";

import Pagination from "../../../core/components/Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleParticipantModal,
  toggleParticipantDetails,
  setSelectedParticipant,
  deleteParticipant,
  editParticipant,
  filterParticipants,
  setSearchQuery,
} from "../../../core/Features/Participants";
import CustomDropdown from "../../../core/components/Dropdown/CustomDropdown";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const ParticipationStatus = Object.freeze({
  PAID: "Paid",
  PENDING: "Pending",
  CANCELED: "Canceled",
});

const ParticipantsCard = () => {
  const { eventId } = useParams();
  const {
    participants,
    filteredParticipants,
    participantsPerPage,
    groupedParticipants,
    searchQuery,
    isEdit
  } = useSelector((store) => store.participantsStore);

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState(null);

  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = filteredParticipants.slice(
    indexOfFirstParticipant,
    indexOfLastParticipant
  );

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

  const handleDeleteParticipant = (participantId) => {
    axiosRequest.post(`/participant/delete/${participantId}`).then(() => {
      dispatch(deleteParticipant(participantId));
      toast.success("Participant deleted successfully");
    });
  };

  const [socket, setSocket] = useState(null);

  const handleOpenDetails = (participant) => {
    dispatch(setSelectedParticipant(participant));
    dispatch(toggleParticipantDetails());
  };

  const handleChangeStatus = (participant, newStatus) => {
    const updatedParticipant = { ...participant, status: newStatus };
    axiosRequest
      .post(`/participant/edit/${participant.id}`, updatedParticipant)
      .then(() => {
        dispatch(editParticipant(updatedParticipant));
        toast.success("Participant status updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update participant status");
      });
  };



  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND);

    newSocket.on("connect", () => {
      if (eventId) {
        newSocket.emit("joinRoom", eventId);
      }
    });

    newSocket.on("EventParticipantAdded", (data) => {
      dispatch(addParticipant(data));
    });

    return () => {
      newSocket.off("EventParticipantAdded");
      newSocket.disconnect();
    };
  }, [eventId]);

  const handleStatusChange = (e) => {
    dispatch(filterParticipants(e.target.value));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    dispatch(setSearchQuery(query));
    setCurrentPage(1);
  };
  const handleEditClick = (participant) => {
    dispatch(setSelectedParticipant(participant));
    dispatch(toggleParticipantModal());
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
            <ParticipantTableHeader onSearchChange={handleSearchChange} />
            <div className="d-flex align-items-center gap-2">
              <select
                id="participantStatusFilter"
                className="form-select"
                onChange={handleStatusChange}
              >
                <option value="">All Participants</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table
              className="invoice-list-table table border-top dataTable no-footer dtr-column"
              id="DataTables_Table_0"
              aria-describedby="DataTables_Table_0_info"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Issued Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentParticipants.map((participant, index) => (
                  <tr
                    key={participant.id}
                    className={`${index % 2 === 0 ? "even" : "odd"}`}
                  >
                    <td>
                      <span
                        className="fw-medium"
                        style={{
                          fontWeight: "500",
                          color: "#646cff",
                          textDecoration: "inherit",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenDetails(participant)}
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
                          <span
                            className="text-body text-truncate fw-medium"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenDetails(participant)}
                          >
                            {participant.fullName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="d-flex flex-column">
                          <a className="text-body text-truncate">
                            <span className="fw-medium">
                              {participant.email}
                            </span>
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>{formatDateWithShort(participant.createdAt)}</td>
                    <td>{getStatusIcon(participant.status)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <a
                          href={`mailto:${participant.email}`}
                          className="text-body"
                        >
                          <i className="bx bx-send mx-1" />
                        </a>
                        <a
                          className="text-body"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleOpenDetails(participant)}
                        >
                          <i className="bx bx-show mx-1" />
                        </a>
                        <CustomDropdown
                          toggleContent={
                            <i className="bx bx-dots-vertical-rounded" />
                          }
                        >
                          <a
                            className="dropdown-item"
                            onClick={() => handleEditClick(participant)}
                          >
                            Edit
                          </a>
                          <a
                            className="dropdown-item"
                            onClick={() =>
                              
                             { console.log(isEdit), handleChangeStatus(
                                participant,
                                ParticipationStatus.PAID
                              )}
                            }
                          >
                            Mark as Paid
                          </a>
                          <a
                            className="dropdown-item"
                            onClick={() =>
                              handleChangeStatus(
                                participant,
                                ParticipationStatus.PENDING
                              )
                            }
                          >
                            Mark as Pending
                          </a>
                          <a
                            className="dropdown-item"
                            onClick={() =>
                              handleChangeStatus(
                                participant,
                                ParticipationStatus.CANCELED
                              )
                            }
                          >
                            Mark as Canceled
                          </a>
                          <hr className="dropdown-divider" />
                          <a
                            onClick={() =>
                              handleDeleteParticipant(participant.id)
                            }
                            style={{ cursor: "pointer" }}
                            className="dropdown-item text-danger"
                          >
                            Delete
                          </a>
                        </CustomDropdown>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row mx-2" id="pagination-section">
            <div className="col-sm-12 col-md-6">
              <div
                className="dataTables_info"
                id="DataTables_Table_0_info"
                role="status"
                aria-live="polite"
              >
                {`Showing ${indexOfFirstParticipant + 1} to ${Math.min(
                  indexOfLastParticipant,
                  filteredParticipants.length
                )} of ${filteredParticipants.length} entries`}
              </div>
            </div>
            <Pagination
              unitsPerPage={participantsPerPage}
              totalUnits={filteredParticipants.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
          <ParticipantModal />
          <ParticipantDetails />
        </div>
      </div>
    </div>
  );
};

export default ParticipantsCard;
