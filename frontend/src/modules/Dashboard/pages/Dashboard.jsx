import React from "react";

import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import EventsTable from "../components/EventsTable";
import DashboardContainer from "../components/DashboardContainer";

function Participants() {

    return (
        <DashboardLayout activeTab="/participants">
            <DashboardContainer />
        </DashboardLayout>
    );
}

export default Participants;