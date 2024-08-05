import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../../core/components/Pagination/Pagination';
import { UserData } from '../../../utils/UserData';
import axiosRequest from '../../../utils/AxiosConfig';
import { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure } from '../../../core/Features/Stats';

function EventsTable() {
    const dispatch = useDispatch();
    const userData = UserData();
    const userId = userData.id;
    const { events, isLoading } = useSelector((state) => state.statsStore);


    useEffect(() => {

        const fetchEventsAndWorkshops = async () => {
            dispatch(fetchStatsStart());
            try {
                const response = await axiosRequest.get(`/events/get-organizer/${userId}`);
                const eventsData = response.data.events;

                if (!Array.isArray(eventsData)) {
                    console.error('Expected an array but got:', eventsData);
                    dispatch(fetchStatsFailure('Expected an array but got: ' + eventsData));
                    return;
                }

                let totalParticipants = 0;
                let currentParticipants = 0;
                let totalWorkshops = 0;

                const updatedEvents = await Promise.all(
                    eventsData.map(async (event) => {
                        const workshopsResponse = await axiosRequest.get(`/workshop/get-event/${event.id}`);
                        const workshops = workshopsResponse.data.workshops;
                        totalWorkshops += workshops.length;

                        let eventTotalParticipants = 0;
                        let eventCurrentParticipants = 0;

                        workshops.forEach((workshop) => {
                            eventTotalParticipants += workshop.numberOfAttendees;
                            eventCurrentParticipants += workshop.currentParticipants;
                        });

                        totalParticipants += eventTotalParticipants;
                        currentParticipants += eventCurrentParticipants;
                        const overallProgress = (
                            (eventCurrentParticipants / eventTotalParticipants) *
                            100
                        ).toFixed(2);

                        return {
                            ...event,
                            totalParticipants: eventTotalParticipants,
                            currentParticipants: eventCurrentParticipants,
                            overallProgress,
                        };
                    })
                );

                dispatch(fetchStatsSuccess({
                    events: updatedEvents,
                    totalParticipants,
                    currentParticipants,
                    totalWorkshops,
                }));
            } catch (error) {
                console.error("Error fetching events and workshops", error);
                dispatch(fetchStatsFailure(error.message));
            }
        };

        fetchEventsAndWorkshops();
    }, [userId]);

    return (

        <div className="card mb-6">

            <div className="table-responsive mb-4">
                <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                    <div className="card-header py-sm-0 d-flex justify-content-between mt-3 mb-4">
                        <div className="head-label text-center">
                            <h5 className="card-title mb-0 text-nowrap">Your Events</h5>
                        </div>
                        <div id="DataTables_Table_0_filter" className="dataTables_filter">
                            <label>
                                <input type="search" className="form-control" placeholder="Search Course" aria-controls="DataTables_Table_0" />
                            </label>
                        </div>
                    </div>
                    {isLoading ? (
                        <p>Loading events...</p>
                    ) : (
                        <table className="table table-sm datatables-academy-course dataTable no-footer dtr-column" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info">
                            <thead className="border-top">
                                <tr>
                                    <th className="control sorting_disabled dtr-hidden" rowSpan="1" colSpan="1" style={{ width: 0, display: 'none' }} aria-label=""></th>

                                    <th className="sorting sorting_desc" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '462px' }} aria-label="Course Name: activate to sort column ascending" aria-sort="descending">Course Name</th>
                                    <th className="sorting" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '95px' }} aria-label="Time: activate to sort column ascending">Time</th>
                                    <th className="w-25 sorting" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '307px' }} aria-label="Progress: activate to sort column ascending">Progress</th>
                                    <th className="w-25 sorting" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '307px' }} aria-label="Status: activate to sort column ascending">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event) => (
                                    <tr key={event.id} className="odd">
                                        <td className="control dtr-hidden" tabIndex="0" style={{ display: 'none' }}></td>

                                        <td className="sorting_1">
                                            <div className="d-flex align-items-center">
                                                <span className="me-4">
                                                    <span className="badge bg-label-success rounded p-1_5">
                                                        <i className="bx bxs-color bx-28px"></i>
                                                    </span>
                                                </span>
                                                <div>
                                                    <a className="text-heading text-truncate fw-medium mb-2 text-wrap" href="app-academy-course-details.html">{event.name}</a>

                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="fw-medium text-nowrap text-heading">16h 15m</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <p className="fw-medium mb-0 text-heading">{event.overallProgress}%</p>
                                                <div className="progress w-100" style={{ height: '8px' }}>
                                                    <div className="progress-bar" style={{ width: `${event.overallProgress}%` }} aria-valuenow={event.overallProgress} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <small>{event.currentParticipants}/{event.totalParticipants}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <i className="bx bx-user bx-md me-1_5 text-primary"></i><span>{event.currentParticipants}</span>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {/* <div className="row mx-2" id="pagination-section">
                                <div className="col-sm-12 col-md-6">
                                    <div
                                        className="dataTables_info"
                                        id="DataTables_Table_0_info"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        {`Showing ${indexOfFirstWorkshop + 1} to ${Math.min(
                                            indexOfLastWorkshop,
                                            filteredWorkshops.length
                                        )} of ${filteredWorkshops.length} entries`}
                                    </div>
                                </div>
                                <Pagination
                                    unitsPerPage={workshopsPerPage}
                                    totalUnits={filteredWorkshops.length}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                />
                            </div> */}
                </div>
            </div>

        </div>

    );
}
export default EventsTable;