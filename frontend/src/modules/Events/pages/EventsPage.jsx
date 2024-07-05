import React, { useState } from "react";
import CustomSideBar from "../../../core/components/Sidebar/CustomSideBar";
import EventsList from "../components/EventsList";
import EventModal from "../components/EventModal";
import axios from "axios";

function Events() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

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
      const response = await axios.post(
        "http://localhost:6001/events/add",
        newEvent
      );
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
    // Open the modal when "Add Event" is clicked in EventsList
    toggleModal();
  };

  return (
    <div className="layout-container">
      <CustomSideBar
        openSideBar={openSideBar}
        toggleSideBar={toggleSideBar}
        activeTab="/events"
      />
      <EventsList onAddEventClick={handleAddEventClick} />
      <EventModal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        handleSubmit={handleSubmit}
        newEvent={newEvent}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export default Events;
