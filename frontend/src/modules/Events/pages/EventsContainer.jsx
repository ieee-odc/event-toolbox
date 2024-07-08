import React, { useState } from "react";
import EventsList from "../components/EventsList";
import AddEventModal from "../components/AddEventModal";
import EditEventModal from "../components/EditEventModal";

function EventsContainer() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [selectedEventId, setSelectedEventId] = useState(null);

  const toggleSideBar = () => {
    setOpenSideBar((prev) => !prev);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewEvent({
      ...newEvent,
      [id]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosRequest.post("/events/add", newEvent);
      toggleModal();
      setNewEvent({
        name: "",
        description: "",
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

  const handleEditEventClick = (eventId) => {
    console.log("Edit event clicked with ID:", eventId);
    setSelectedEventId(eventId);
    toggleModal();
  };
  return (
    <>
      <EventsList
        onAddEventClick={handleAddEventClick}
        onEditEventClick={handleEditEventClick}
      />
      <AddEventModal
        isOpen={isModalOpen && !selectedEventId}
        toggleModal={toggleModal}
        handleSubmit={handleSubmit}
        newEvent={newEvent}
        handleInputChange={handleInputChange}
      />
      {selectedEventId && (
        <EditEventModal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          handleSubmit={handleSubmit}
          eventId={selectedEventId}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
}

export default EventsContainer;
