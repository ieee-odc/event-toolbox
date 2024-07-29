import React, { useEffect, useState } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import ParticipantTableHeader from "./ParticipantTableHeader";
import ParticipantModal from "./ParticipantModal";
import { toast } from "react-hot-toast";
import { formatDateWithShort } from "../../../utils/helpers/FormatDate";
import { addParticipant, deleteParticipant } from "../../../core/Features/Participants";
import Pagination from "../../../core/components/Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { io } from 'socket.io-client';
import { useParams } from "react-router-dom";

const ParticipationStatus = Object.freeze({
  PAID: "Paid",
  PENDING: "Pending",
  CANCELED: "Canceled",
});

const ParticipantsCard = () => {
  const { eventId } = useParams();
  const { participants, filteredParticipants, participantsPerPage } =
    useSelector((store) => store.participantsStore);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND);
  
    newSocket.on('connect', () => {
      if (eventId) {
        newSocket.emit('joinRoom',eventId );
      }
    });
  
    newSocket.on('EventParticipantAdded', (data) => {
      dispatch(addParticipant(data));
    });
  
    return () => {
      newSocket.off('EventParticipantAdded');
      newSocket.disconnect();
    };
  }, [eventId]);
  
  return (
    <div className="card" style={{ padding: "20px" }}>
      <div className="card-datatable table-responsive">
        <div
          id="DataTables_Table_0_wrapper"
          className="dataTables_wrapper dt-bootstrap5 no-footer"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <ParticipantTableHeader />
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
                {currentParticipants.map((participant, index) => (
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
                      <span className="d-none"></span>
                      {formatDateWithShort(participant.createdAt)}
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
                            className="btn dropdown-toggle hide-arrow text-body p-0"
                            id="three-dots"
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
                              style={{ cursor: "pointer" }}
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
        </div>
      </div>
    </div>
  );
};

export default ParticipantsCard;
