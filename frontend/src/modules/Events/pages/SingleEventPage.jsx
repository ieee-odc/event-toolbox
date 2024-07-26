import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParticipantsContainer from "../../Participants/components/ParticipantsContainer";
import WorkshopsContainer from "../../Workshops/components/WorkshopsContainer";
import FormContainer from "../../Form/components/FormContainer";
import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import SpaceContainer from "../../Space/component/spaceContainer";
import { useDispatch } from "react-redux";
import { initializeEvents } from "../../../core/Features/Events";
import axiosRequest from "../../../utils/AxiosConfig";
import { initializeForms } from "../../../core/Features/Forms";
import { initializeParticipants } from "../../../core/Features/Participants";
import { initializeSpaces } from "../../../core/Features/Spaces";
import { initializeWorkshops } from "../../../core/Features/Workshops";

function SingleEventPage() {
  const { eventId } = useParams();

  const [activeTab, setActiveTab] = useState("Participants");
  const [event, setEvent] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    axiosRequest.get(`/events/${eventId}`).then((res) => {
      setEvent(res.data.event);
    });
  }, [eventId]);

  useEffect(() => {
    axiosRequest.get(`/form/get-event/${eventId}`).then((res) => {
      dispatch(initializeForms(res.data.forms));
    });
  }, [eventId]);

  useEffect(() => {
    axiosRequest.get(`/space/get-event/${eventId}`).then((res) => {
      dispatch(initializeSpaces(res.data.spaces));
    });
  }, [eventId]);

  useEffect(() => {
    axiosRequest.get(`/workshop/get-event/${eventId}`).then((res) => {
      dispatch(initializeWorkshops(res.data.workshops));
    });
  }, [eventId]);

  useEffect(() => {
    axiosRequest.get(`/participant/get-event/${eventId}`).then((res) => {
      dispatch(initializeParticipants(res.data.participants));
    });
  }, [eventId]);

  return (
    <DashboardLayout>
      <div style={{ padding: 20 }}>
        <div className="d-flex flex-column flex-md-row justify-content-between">
          <h4 className="py-3 mb-4">
            <span className="text-muted fw-light">{event?.name} /</span>{" "}
            {activeTab}
          </h4>
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-form-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-form"
                type="button"
                role="tab"
                aria-controls="pills-form"
                aria-selected="false"
                onClick={() => {
                  setActiveTab("Forms");
                }}
              >
                Forms
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-space-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-space"
                type="button"
                role="tab"
                aria-controls="pills-space"
                aria-selected="false"
                onClick={() => {
                  setActiveTab("Spaces");
                }}
              >
                Venue
              </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pills-participant-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-participant"
                  type="button"
                  role="tab"
                  aria-controls="pills-participant"
                  aria-selected="true"
                  onClick={() => {
                    setActiveTab("Participants");
                  }}
                >
                  Participants
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-workshop-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-workshop"
                  type="button"
                  role="tab"
                  aria-controls="pills-workshop"
                  aria-selected="false"
                  onClick={() => {
                    setActiveTab("Workshops");
                  }}
                >
                  Workshops
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
            className="tab-pane fade"
            id="pills-form"
            role="tabpanel"
            aria-labelledby="pills-form-tab"
            tabIndex="0"
          >
            <FormContainer />
          </div>
          <div
            className="tab-pane fade"
            id="pills-space"
            role="tabpanel"
            aria-labelledby="pills-space-tab"
            tabIndex="0"
          >
            <SpaceContainer />
          </div>
          <div
            className="tab-pane fade show active"
            id="pills-participant"
            role="tabpanel"
            aria-labelledby="pills-participant-tab"
            tabIndex="0"
          >
            <ParticipantsContainer />
          </div>
          <div
            className="tab-pane fade"
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
