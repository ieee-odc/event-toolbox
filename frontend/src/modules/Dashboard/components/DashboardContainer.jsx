import React from 'react'
import EventsTable from './EventsTable'
import HeaderStats from './HeaderStats'
import ParticipationChart from './ParticipationChart'
import SpaceChart from './SpaceChart'
import "../Dashboard.css"
export default function DashboardContainer() {
    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y" id="eventsContainer">
                <HeaderStats />

                <div className="d-flex align-items-center ">
                    <ParticipationChart />
                    <SpaceChart />
                </div>
                <EventsTable />

            </div>
        </div>
    )
}
