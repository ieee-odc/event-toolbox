import React from "react";

import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";

import AdminDashboardContainer from "../components/AdminDashboardContainer";
import AdminApproval from "../../admin/components/AdminApproval";

function AdminDashboardPage() {

    return (
        <DashboardLayout activeTab="/dashboard">
            <AdminApproval />
            <AdminDashboardContainer />
        </DashboardLayout>
    );
}

export default AdminDashboardPage;