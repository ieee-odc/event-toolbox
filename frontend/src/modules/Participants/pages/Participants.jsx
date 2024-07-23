import React, { useState } from "react";

import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import ParticipantsContainer from "../components/ParticipantsContainer";

function Participants() {

  return (
<DashboardLayout activeTab="/participants">
  <ParticipantsContainer/>
</DashboardLayout>
  );
}

export default Participants;
