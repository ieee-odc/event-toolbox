import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParticipantsContainer from "../../Participants/components/ParticipantsContainer";
import FormContainer from "../../Form/components/FormContainer";
import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import SpaceContainer from "../../Space/component/spaceContainer";
import { useDispatch, useSelector } from "react-redux";
import axiosRequest from "../../../utils/AxiosConfig";
import { initializeForms } from "../../../core/Features/Forms";
import { initializeParticipants } from "../../../core/Features/Participants";
import { initializeSpaces } from "../../../core/Features/Spaces";
import { initializeWorkshops, setSelectedWorkshop } from "../../../core/Features/Workshops";
import WorkshopSpaceContainer from "../../Space/component/WorkshopSpaceContainer";
import WorkshopFormContainer from "../../Form/components/WorkshopFormContainer";

function SingleWorkshopPage() {
  const { workshopId, eventId } = useParams();

  const [activeTab, setActiveTab] = useState("Participants");
  const dispatch = useDispatch();

  const {selectedWorkshop}=useSelector((store)=>store.workshopsStore)


  useEffect(() => {
    axiosRequest.get(`/workshop/${workshopId}`).then((res) => {
      dispatch(setSelectedWorkshop(res.data.workshop));
    });
  }, [workshopId]);

  useEffect(() => {
    axiosRequest.get(`/participant/get-workshop/${workshopId}`).then((res) => {
      dispatch(initializeParticipants(res.data.participants));
    });
  }, [workshopId]);


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

  return (
    <DashboardLayout>
      <div id="u-container" style={{ padding: 5 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="py-3 mb-4">
            <span className="text-muted fw-light">{selectedWorkshop?.name} /</span>{" "}
            {activeTab}
          </h4>
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
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
                Spaces
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
            className="tab-pane fade show active"
            id="pills-participant"
            role="tabpanel"
            aria-labelledby="pills-participant-tab"
            tabindex="0"
          >
            <ParticipantsContainer />
          </div>
          <div
            className="tab-pane fade"
            id="pills-form"
            role="tabpanel"
            aria-labelledby="pills-form-tab"
            tabindex="0"
          >
            <WorkshopFormContainer />
          </div>

          <div
            className="tab-pane fade"
            id="pills-space"
            role="tabpanel"
            aria-labelledby="pills-space-tab"
            tabindex="0"
          >
            <WorkshopSpaceContainer/>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SingleWorkshopPage;
