// File: ParticipantsCard.jsx
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
  initializeParticipants,
} from "../../../core/Features/Participants";
import CustomDropdown from "../../../core/components/Dropdown/CustomDropdown";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import CustomButton from "../../../core/components/Button/Button";
import "../Participants.css"

const ParticipationStatus = Object.freeze({
  PAID: "Paid",
  PENDING: "Pending",
  CANCELED: "Canceled",
});

const ParticipantsCard = () => {
  const { eventId, workshopId } = useParams();
  const {
    participants,
    filteredParticipants,
    participantsPerPage,
    searchQuery,
    isEdit,
  } = useSelector((store) => store.participantsStore);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = filteredParticipants.slice(
    indexOfFirstParticipant,
    indexOfLastParticipant
  );
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const handleSelectParticipant = (id) => {
    const updatedSelectedParticipants = selectedParticipants.includes(id)
      ? selectedParticipants.filter((participantId) => participantId !== id)
      : [...selectedParticipants, id];
    setSelectedParticipants(updatedSelectedParticipants);
    setIsSelecting(updatedSelectedParticipants.length > 0);
  };

  const handleSelectAll = () => {
    if (areAllSelected) {
      setSelectedParticipants([]);
      setIsSelecting(false);
    } else {
      const allParticipantIds = filteredParticipants.map((p) => p.id);
      setSelectedParticipants(allParticipantIds);
      setIsSelecting(true);
    }
  };


  const areAllSelected = selectedParticipants.length === filteredParticipants.length;


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
    dispatch(initializeParticipants(participants));

    const newSocket = io(import.meta.env.VITE_BACKEND.split("/api")[0]);

    newSocket.on("connect", () => {
      const roomId = workshopId ? `${eventId}/${workshopId}` : `${eventId}`;
      if (eventId) {
        newSocket.emit("joinRoom", roomId);
      }
    });

    newSocket.on("EventParticipantAdded", (data) => {
      dispatch(initializeParticipants([...participants, data]));
    });

    return () => {
      newSocket.off("EventParticipantAdded");
      newSocket.disconnect();
    };
  }, [eventId, workshopId, dispatch]);

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

  const formatResponses = (responses) => {
    return responses
      .map(({ question, answer }) => `${question}: ${answer}`)
      .join("; ");
  };

  const generateCSV = () => {
    const csvHeader = [
      "ID",
      "Full Name",
      "Email",
      "Created At",
      "Status",
      "Event Name",
      "Event Questions & Responses",
      "Workshop Details",
    ];

    const csvRows = participants.map((participant) => {
      const eventResponses = formatResponses(participant.eventResponses);
      const workshopDetails = participant.workshops
        .map((workshop) => {
          const workshopResponses = formatResponses(workshop.responses);
          return `Workshop: ${workshop.workshopName} (${workshopResponses})`;
        })
        .join("; ");

      return [
        participant.id,
        participant.fullName,
        participant.email,
        formatDateWithShort(participant.createdAt),
        participant.status,
        participant.eventName,
        eventResponses,
        workshopDetails,
      ].join(",");
    });

    const csvContent = [csvHeader.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const sendEmailsToSelectedParticipants = () => {
    const emailList = selectedParticipants
      .map((participantId) => {
        const participant = filteredParticipants.find(
          (p) => p.id === participantId
        );
        return participant.email;
      })
      .join(",");

    const subject = encodeURIComponent("Your Subject Here");
    const body = encodeURIComponent("Your Email Body Here");

    const mailtoLink = `mailto:${emailList}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
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
            {isSelecting ? (
              <>
                <div></div>
                <div className="d-flex align-items-center gap-2">
                  <CustomButton
                    text="Send Email"
                    iconClass="bx bx-envelope me-md-1 mrt-1"
                    style={{ padding: "5px" }}
                    backgroundColor="var(--primary-color)"
                    textColor="white"
                    hoverBackgroundColor="#0F205D"
                    hoverTextColor="white"
                    onClick={() => {
                      sendEmailsToSelectedParticipants()
                    }}
                  />
                </div></>
            ) : (
              <>

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
                  <div className="dt-buttons btn-group flex-wrap">
                    <CustomButton
                      text="Download"
                      iconClass="bx bx-download me-md-1"
                      style={{ padding: "5px" }}
                      backgroundColor="var(--primary-color)"
                      textColor="white"
                      hoverBackgroundColor="#0F205D"
                      hoverTextColor="white"
                      onClick={() => {
                        generateCSV();
                      }}
                    />
                  </div>
                </div>
              </>)}
          </div>
          <div className="table-responsive">
            <table
              className="invoice-list-table table border-top dataTable no-footer dtr-column"
              id="DataTables_Table_0"
              aria-describedby="DataTables_Table_0_info"
              style={{ width: "100%" }}
            >
              <thead id="table-head">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="mt-1 "
                      onChange={handleSelectAll}
                      checked={areAllSelected}
                    />
                  </th>
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
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(participant.id)}
                        onChange={() => handleSelectParticipant(participant.id)}
                      />
                    </td>
                    <td>
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="avatar-wrapper">
                          <div className="avatar avatar-sm me-2">
                            <span className="avatar-initial rounded-circle bg-label-dark">
                              <i className="bx bx-user m-0"></i>
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
                              handleChangeStatus(
                                participant,
                                ParticipationStatus.PAID
                              )
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
