import React, { useState } from "react";
import CustomSideBar from "../../../core/components/Sidebar/CustomSideBar";
import EventsList from "../components/EventsList";
import AddEventModal from "../components/AddEventModal";
import EditEventModal from "../components/EditEventModal"; // Import EditEventModal
import axiosRequest from "../../../utils/AxiosConfig";

function Events() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [selectedEventId, setSelectedEventId] = useState(null); // State for selected event ID

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
      console.log("Event submitted:", response.data);
      // Close the modal and reset form
      toggleModal();
      setNewEvent({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      // You may want to update events list state here if needed
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleAddEventClick = () => {
    toggleModal();
  };

  const handleEditEventClick = (eventId) => {
    console.log("Edit event clicked with ID:", eventId);
    setSelectedEventId(eventId); // Set selected event ID
    toggleModal(); // Open the edit modal
  };

  return (
    <div className="layout-container">
      <CustomSideBar
        openSideBar={openSideBar}
        toggleSideBar={toggleSideBar}
        activeTab="/events"
      />
      <EventsList
        onAddEventClick={handleAddEventClick}
        onEditEventClick={handleEditEventClick}
      />
      <AddEventModal
        isOpen={isModalOpen && !selectedEventId} // Ensure modal is not open if editing an event
        toggleModal={toggleModal}
        handleSubmit={handleSubmit}
        newEvent={newEvent}
        handleInputChange={handleInputChange}
      />
      {selectedEventId && ( // Render EditEventModal only if selectedEventId is truthy
        <EditEventModal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          handleSubmit={handleSubmit}
          eventId={selectedEventId}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
}

export default Events;
