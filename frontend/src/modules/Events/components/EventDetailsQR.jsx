import React, { useEffect, useState } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { UserData } from "../../../utils/UserData";
import { base64UrlDecode, base64UrlEncode } from "../../../utils/helpers/base64Helper";
const EventDetail = () => {
    const { token } = useParams()
    const navigate = useNavigate(); // Initialize useNavigate for navigation
    const [event, setEvent] = useState(null);
    // const selectedFormId = useSelector((state) => state.eventsStore.selectedEvent.formId); // Access selected form ID
    const userData = UserData();

    const decodedToken = base64UrlDecode(token);
    const [tokenData, setTokenData] = useState();
    useEffect(() => {
        try {
            setTokenData(JSON.parse(decodedToken));
        } catch (error) {
            console.error("Invalid token format", error);
        }
    }, [token]);
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axiosRequest.get(`/events/${tokenData.eventId}`);
                setEvent(response.data.event);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEvent();
    }, [tokenData]);

    const calculateDurationInDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInMilliseconds = end - start;
        return Math.round(durationInMilliseconds / (1000 * 60 * 60 * 24));
    };

    const formatDate = (passedDate) => {
        const dateObj = new Date(passedDate);
        const day = dateObj.getUTCDate().toString().padStart(2, "0");
        const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getUTCFullYear().toString();
        return `${day}/${month}/${year}`;
    };

    const getEventStatus = (startDate, endDate) => {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (currentDate > end) {
            return { status: "Done", badgeClass: "badge bg-label-success" };
        } else if (currentDate < start) {
            return { status: "Upcoming", badgeClass: "badge bg-label-primary" };
        } else {
            return { status: "Ongoing", badgeClass: "badge bg-label-warning" };
        }
    };

    const handleRegisterClick = () => {

        if (event) {
            const object = {
                userId: event.organizerId,
                formId: event.formId
            }
            navigate(`/form/${base64UrlEncode(JSON.stringify(object))}`);
        } else {
            console.error("No form selected for this event.");
        }
    };

    if (!event) {
        return <p>Loading event details...</p>;
    }

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="card shadow-lg p-4" style={{ maxWidth: "800px" }}>
                <img
                    className="card-img-top mb-4"
                    src={event.coverPhoto || "https://via.placeholder.com/800x400"}
                    alt="Event cover"
                />
                <div className="card-body">
                    <h3 className="card-title">{event.name}</h3>
                    <p className="card-text">{event.description}</p>
                    <p className="card-text"><b>Location:</b> {event.location}</p>
                    <p className="card-text">
                        <b>Dates:</b> {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </p>
                    <p className="card-text">
                        <b>Duration:</b> {calculateDurationInDays(event.startDate, event.endDate)} days
                    </p>
                    <p className="card-text">
                        <span className={getEventStatus(event.startDate, event.endDate).badgeClass}>
                            {getEventStatus(event.startDate, event.endDate).status}
                        </span>
                    </p>
                    <button className="btn btn-primary mt-3" onClick={handleRegisterClick}>
                        Register for the Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
