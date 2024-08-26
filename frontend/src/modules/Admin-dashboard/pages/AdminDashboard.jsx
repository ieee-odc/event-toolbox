import React from "react";

import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";

import AdminDashboardContainer from "../components/AdminDashboardContainer";

function AdminDashboardPage() {

    return (
        <DashboardLayout activeTab="/dashboard">
            <AdminDashboardContainer />
        </DashboardLayout>
    );
}

export default AdminDashboardPage;