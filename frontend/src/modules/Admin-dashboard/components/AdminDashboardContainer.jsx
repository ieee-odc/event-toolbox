import React from 'react'
import Events from './Events'
import GlobalParticipationChart from './Participation'
import GlobalStats from './GlobalStats'
import AdminApproval from '../../admin/components/AdminApproval'
export default function AdminDashboardContainer() {
    return (
        <div className="content-wrapper">

            <div className="container-xxl flex-grow-1 container-p-y" id="eventsContainer">
                <GlobalStats />
                <AdminApproval />
                <div className="d-flex align-items-center ">
                    <GlobalParticipationChart />
                </div>
                <Events />

            </div>
        </div>
    )
}
