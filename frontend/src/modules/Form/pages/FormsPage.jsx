import React, { useState } from "react";
import FormsList from "../components/FormsList";
import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import FormModal from "../components/FormModal";
function Forms() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSideBar = () => {
    setOpenSideBar((prev) => !prev);
  };
  return (
    <DashboardLayout
      openSideBar={openSideBar}
      setOpenSideBar={openSideBar}
      toggleSideBar={toggleSideBar}
      isModalOpen={isModalOpen}
    >
      <FormsList />
      <FormModal />
    </DashboardLayout>
  );
}

export default Forms;
