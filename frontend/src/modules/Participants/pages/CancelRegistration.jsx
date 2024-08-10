import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  base64UrlDecode,
  base64UrlEncode,
} from "../../../utils/helpers/base64Helper";
import axiosRequest from "../../../utils/AxiosConfig";

function CancelRegistration() {
  const { token } = useParams();
  const decodedToken = base64UrlDecode(token);
  let tokenData;
  try {
    tokenData = JSON.parse(decodedToken);
  } catch (error) {
    console.error("Invalid token format", error);
  }

  const [participations, setParticipations] = useState([]);
  const [eventParticipation, setEventParticipation] = useState({});
  const [selectedParticipations, setSelectedParticipations] = useState([]);

  useEffect(() => {
    axiosRequest
      .post("/participant/cancelation-data", {
        participantId: tokenData.participantId,
        eventId: tokenData.eventId,
      })
      .then((res) => {
        const participants = res.data.participants;
        setParticipations(
          participants.filter((participation) => participation.workshopId)
        );
        const eventOnlyParticipation = participants.find(
          (participation) => !participation.workshopId
        );
        setEventParticipation(eventOnlyParticipation || {});
      });
  }, [token]);

  const handleCheckboxChange = (participationId) => {
    setSelectedParticipations((prevSelected) =>
      prevSelected.includes(participationId)
        ? prevSelected.filter((id) => id !== participationId)
        : [...prevSelected, participationId]
    );
  };

  return (
    <div className="container" style={{ height: "100vh" }}>
      <div
        className="container-xxl "
        style={{
          display: "flex",
          height: "90%",
          margin: "auto 0",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="authentication-wrapper authentication-basic container-p-y">
          <div className="authentication-inner">
            <div className="card">
              <div className="card-body">
                <h4 className="mb-2">Cancel Registration</h4>
                <p className="mb-6">You can cancel your registration here.</p>

                <div>
                  <h5>Cancel the whole event</h5>
                  <button>Cancel</button>
                </div>

                <h5>Cancel workshops</h5>
                {participations.map((participation) => (
                  <div
                    key={participation.id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      id={`workshop-${participation.id}`}
                      checked={selectedParticipations.includes(
                        participation.id
                      )}
                      onChange={() => handleCheckboxChange(participation.id)}
                    />
                    <label htmlFor={`workshop-${participation.id}`}>
                      {participation.workshopId}
                    </label>
                  </div>
                ))}

                <button
                  onClick={() =>
                    console.log("Selected workshops:", selectedParticipations)
                  }
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelRegistration;
