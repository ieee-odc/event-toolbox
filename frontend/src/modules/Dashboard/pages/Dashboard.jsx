import React from "react";

import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import EventsTable from "../components/EventsTable";
import DashboardContainer from "../components/DashboardContainer";

function Participants() {

    return (
        <DashboardLayout activeTab="/dashboard">
            <DashboardContainer />
        </DashboardLayout>
    );
}

export default Participants;