import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ParticipantsContainer from "../../Participants/components/ParticipantsContainer";
import WorkshopsContainer from "../../Workshops/components/WorkshopsContainer";
import FormContainer from "../../Form/components/FormContainer";
import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import SpaceContainer from "../../Space/component/spaceContainer";
import { useDispatch } from "react-redux";
import axiosRequest from "../../../utils/AxiosConfig";
import {
  initializeForms,
  setIsLoadingForm,
} from "../../../core/Features/Forms";
import {
  initializeParticipants,
  setIsParticipantLoading,
} from "../../../core/Features/Participants";
import {
  initializeSpaces,
  setIsSpacesLoading,
} from "../../../core/Features/Spaces";
import {
  initializeWorkshops,
  setIsWorkshopLoading,
} from "../../../core/Features/Workshops";

function SingleEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Participants"
  );
  const [event, setEvent] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    axiosRequest.get(`/events/${eventId}`).then((res) => {
      setEvent(res.data.event);
    });
  }, [eventId]);

  useEffect(() => {
    dispatch(setIsLoadingForm(true));
    axiosRequest.get(`/form/get-event/${eventId}`).then((res) => {
      dispatch(initializeForms(res.data.forms));
      dispatch(setIsLoadingForm(false));
    });
  }, [eventId]);

  useEffect(() => {
    dispatch(setIsSpacesLoading(true));
    axiosRequest.get(`/space/get-event/${eventId}`).then((res) => {
      dispatch(initializeSpaces(res.data.spaces));
      dispatch(setIsSpacesLoading(false));
    });
  }, [eventId]);

  useEffect(() => {
    dispatch(setIsWorkshopLoading(true));
    axiosRequest.get(`/workshop/get-event/${eventId}`).then((res) => {
      dispatch(initializeWorkshops(res.data.workshops));
      dispatch(setIsWorkshopLoading(false));
    });
  }, [eventId]);

  useEffect(() => {
    axiosRequest.get(`/participant/get-event/${eventId}`).then((res) => {
      dispatch(initializeParticipants(res.data.participants));
      dispatch(setIsParticipantLoading(false));
    });
  }, [eventId]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <DashboardLayout>
      <div style={{ padding: 20 }}>
        <div className="d-flex flex-column flex-md-row justify-content-between">
          <div className="d-flex">
            <button
              className="btn btn-link pe-3 mrrt-1 mb-4"
              onClick={() => navigate(-1)}
            >
              <h4>
                <i className="bx bx-arrow-back m-0"></i>{" "}
              </h4>
            </button>
            <h4 className="py-3 mb-4">
              <span className="text-muted fw-light">{event?.name} /</span>{" "}
              {activeTab}
            </h4>
          </div>
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "Forms" ? "active" : ""}`}
                id="pills-form-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-form"
                type="button"
                role="tab"
                aria-controls="pills-form"
                aria-selected={activeTab === "Forms"}
                onClick={() => {
                  setActiveTab("Forms");
                }}
              >
                Forms
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "Spaces" ? "active" : ""}`}
                id="pills-space-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-space"
                type="button"
                role="tab"
                aria-controls="pills-space"
                aria-selected={activeTab === "Spaces"}
                onClick={() => {
                  setActiveTab("Spaces");
                }}
              >
                Venue
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "Participants" ? "active" : ""
                }`}
                id="pills-participant-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-participant"
                type="button"
                role="tab"
                aria-controls="pills-participant"
                aria-selected={activeTab === "Participants"}
                onClick={() => {
                  setActiveTab("Participants");
                }}
              >
                Participants
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "Sessions" ? "active" : ""
                }`}
                id="pills-workshop-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-workshop"
                type="button"
                role="tab"
                aria-controls="pills-workshop"
                aria-selected={activeTab === "Sessions"}
                onClick={() => {
                  setActiveTab("Sessions");
                }}
              >
                Sessions
              </button>
            </li>
          </ul>
        </div>

        <div
          className="tab-content"
          id="pills-tabContent"
          style={{ padding: 0 }}
        >
          <div
            className={`tab-pane fade ${
              activeTab === "Forms" ? "show active" : ""
            }`}
            id="pills-form"
            role="tabpanel"
            aria-labelledby="pills-form-tab"
            tabIndex="0"
          >
            <FormContainer />
          </div>
          <div
            className={`tab-pane fade ${
              activeTab === "Spaces" ? "show active" : ""
            }`}
            id="pills-space"
            role="tabpanel"
            aria-labelledby="pills-space-tab"
            tabIndex="0"
          >
            <SpaceContainer />
          </div>
          <div
            className={`tab-pane fade ${
              activeTab === "Participants" ? "show active" : ""
            }`}
            id="pills-participant"
            role="tabpanel"
            aria-labelledby="pills-participant-tab"
            tabIndex="0"
          >
            <ParticipantsContainer />
          </div>
          <div
            className={`tab-pane fade ${
              activeTab === "Sessions" ? "show active" : ""
            }`}
            id="pills-workshop"
            role="tabpanel"
            aria-labelledby="pills-workshop-tab"
            tabIndex="0"
          >
            <WorkshopsContainer />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SingleEventPage;
