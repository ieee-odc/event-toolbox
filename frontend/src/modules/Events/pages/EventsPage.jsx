import React, { useState } from "react";
import CustomSideBar from "../../../core/components/Sidebar/CustomSideBar";
import EventsList from "../components/EventsList";
import AddEventModal from "../components/AddEventModal";
import EditEventModal from "../components/EditEventModal";
import axiosRequest from "../../../utils/AxiosConfig";
import EventsContainer from "./EventsContainer";
import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";

function Events() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSideBar = () => {
    console.log("clicked");
    setOpenSideBar((prev) => !prev);
  };
  return (
    <DashboardLayout
      openSideBar={openSideBar}
      setOpenSideBar={openSideBar}
      isModalOpen={isModalOpen}
      toggleSideBar={toggleSideBar}
    >
      <EventsContainer />
    </DashboardLayout>
  );
}

export default Events;
