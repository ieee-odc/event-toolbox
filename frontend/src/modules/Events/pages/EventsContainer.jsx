import React, { useState } from "react";
import EventsList from "../components/EventsList";
import AddEventModal from "../components/AddEventModal";
import EditEventModal from "../components/EditEventModal";
import axiosRequest from "../../../utils/AxiosConfig";

function EventsContainer() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleModal = () => {
    if (selectedEvent) {
      setSelectedEvent(null);
    }
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setNewEvent({
        name: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewEvent((prevData) => {
      const newData = { ...prevData, [id]: value };
      if (id === "startDate") {
        newData.endDate = "";
      }
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosRequest.post("/events/add", newEvent);
      toggleModal();
      setNewEvent({
        name: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleAddEventClick = () => {
    toggleModal();
  };

  const handleEditEventClick = (event) => {
    setSelectedEvent(event);
    toggleModal();
  };

  return (
    <>
      <EventsList
        onAddEventClick={handleAddEventClick}
        onEditEventClick={handleEditEventClick}
      />
      <AddEventModal
        isOpen={isModalOpen && !selectedEvent}
        toggleModal={toggleModal}
        handleSubmit={handleSubmit}
        newEvent={newEvent}
        handleInputChange={handleInputChange}
      />
      {selectedEvent && (
        <EditEventModal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          handleSubmit={handleSubmit}
          event={selectedEvent}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
}

export default EventsContainer;
