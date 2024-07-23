import React, { useState } from "react";
import EventsContainer from "./EventsContainer";
import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";

function Events() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSideBar = () => {
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
