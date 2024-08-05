import React from 'react'
import EventsTable from './EventsTable'
import HeaderStats from './HeaderStats'
import ParticipationChart from './ParticipationChart'

export default function DashboardContainer() {
    return (
        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y" id="eventsContainer">
                <HeaderStats />
                <EventsTable />
                <ParticipationChart />
            </div>
        </div>
    )
}
