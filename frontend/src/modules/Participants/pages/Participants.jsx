import React, { useEffect, useState } from "react";
import Table from "../../../core/components/Table/Table";
import axiosRequest from "../../../utils/AxiosConfig";
import CustomSideBar from "../../../core/components/Sidebar/CustomSideBar";
import ParticipantsCard from "../components/ParticipantsCard";
import CustomNavBar from "../../../core/components/NavBar/CustomNavBar";
import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import ParticipantsContainer from "./ParticipantsContainer";

function Participants() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSideBar = () => {
    console.log("clicked");
    setOpenSideBar((prev) => !prev);
  };
  return (
<DashboardLayout openSideBar={openSideBar} setOpenSideBar={openSideBar} isModalOpen={isModalOpen} toggleSideBar={toggleSideBar}>
  <ParticipantsContainer/>
</DashboardLayout>
  );
}

export default Participants;
