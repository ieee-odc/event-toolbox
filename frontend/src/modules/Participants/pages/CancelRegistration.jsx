import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  base64UrlDecode,
  base64UrlEncode,
} from "../../../utils/helpers/base64Helper";
import axiosRequest from "../../../utils/AxiosConfig";
import toast from "react-hot-toast";

function CancelRegistration() {
  const { token } = useParams();
  const decodedToken = base64UrlDecode(token);

  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    /// eyJwYXJ0aWNpcGFudElkIjoiNjZhYjgyZGRmMjMxZmFlZTM3ODM5Y2VkIiwiZXZlbnRJZCI6Mn0
    try {
      setTokenData(JSON.parse(decodedToken));
    } catch (error) {
      console.error("Invalid token format", error);
    }
  }, [token]);

  const [participations, setParticipations] = useState([]);
  const [eventParticipation, setEventParticipation] = useState(null);
  const [selectedParticipations, setSelectedParticipations] = useState([]);

  useEffect(() => {
    if (!tokenData) return;

    setLoading(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tokenData]);

  const handleCheckboxChange = (participationId) => {
    setSelectedParticipations((prevSelected) =>
      prevSelected.includes(participationId)
        ? prevSelected.filter((id) => id !== participationId)
        : [...prevSelected, participationId]
    );
  };
  const handleCancelWholeEvent = async () => {
    setLoading(true);
    try {
      await axiosRequest.post(
        `/participant/cancel-event/${tokenData.eventId}`,
        {
          participantEmail: eventParticipation.email,
        }
      );
      toast.success("Event registration cancelled successfully.");

      setEventParticipation(null);
    } catch (error) {
      console.error("Error cancelling event registration", error);
      toast.error(
        "Failed to cancel event registration. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSelectedWorkshops = async () => {
    setLoading(true);
    try {
      console.log(selectedParticipations);
      const cancelPromises = selectedParticipations.map((participationId) =>
        axiosRequest.post(`/participant/cancel-workshop/${participationId}`)
      );
      await Promise.all(cancelPromises);
      setParticipations((prevParticipations) =>
        prevParticipations.filter(
          (participation) => !selectedParticipations.includes(participation._id)
        )
      );

      // Clear the selected participations
      setSelectedParticipations([]);
      toast.success("Selected workshop registrations cancelled successfully.");
    } catch (error) {
      toast.error("Failed to cancel selected workshop registrations.");
    } finally {
      setLoading(false);
    }
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
              {loading ? (
                <span>Loading</span>
              ) : (
                <div className="card-body">
                  <h4 className="mb-2">Cancel Registration</h4>
                  {!eventParticipation ? (
                    <p>Event Participation already canceled</p>
                  ) : (
                    <div>
                      <p className="mb-6">
                        You can cancel your registration here.
                      </p>

                      <div
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <h5>Cancel the whole event</h5>
                        <button
                          id="deleteButton"
                          onClick={handleCancelWholeEvent}
                        >
                          <p className="mx-1">Cancel</p>
                          <div className="centered">
                            {" "}
                            <i className="bx bxs-trash mx-1"></i>
                          </div>
                        </button>
                      </div>
                      {participations.length !== 0 && (
                        <div>
                          <h5>Cancel workshops</h5>
                          {participations.map((participation) => (
                            <div
                              key={participation.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <input
                                type="checkbox"
                                id={`workshop-${participation._id}`}
                                checked={selectedParticipations.includes(
                                  participation._id
                                )}
                                onChange={() =>
                                  handleCheckboxChange(participation._id)
                                }
                              />
                              <label htmlFor={`workshop-${participation.id}`}>
                                {participation.workshop.name}
                              </label>
                            </div>
                          ))}
                          <button
                            id="deleteButton"
                            className="w-100"
                            onClick={handleCancelSelectedWorkshops}
                          >
                            <p className="mx-1">Confirm Cancellation</p>
                            <div className="centered">
                              {" "}
                              <i className="bx bxs-trash mx-1"></i>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelRegistration;
