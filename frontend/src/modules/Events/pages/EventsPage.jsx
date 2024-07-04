import React, { useEffect, useState } from "react";
import axiosRequest from "../../../utils/AxiosConfig";
import CustomSideBar from "../../../core/components/Sidebar/CustomSideBar";
import EventsList from "../components/EventsList";
function Events() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSideBar = () => {
    console.log("clicked");
    setOpenSideBar((prev) => !prev);
  };
  return (
    <div className="layout-container">
      <CustomSideBar
        openSideBar={openSideBar}
        toggleSideBar={toggleSideBar}
        activeTab="/events"
      />
      <EventsList />
    </div>
  );
}
export default Events;
