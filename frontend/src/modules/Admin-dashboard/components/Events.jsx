import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../../core/components/Pagination/Pagination';
import axiosRequest from '../../../utils/AxiosConfig';
import { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure, setEventsPerPage } from '../../../core/Features/Stats';
function Events() {
    const dispatch = useDispatch();
    const { events, isLoading, eventsPerPage } = useSelector((state) => state.statsStore);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedUser, setSelectedUser] = useState("");
    const [uniqueUsers, setUniqueUsers] = useState([]);
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const filteredEvents = events
        .filter(event =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedUser === "" || event.organizerName === selectedUser)
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

    const currentEvents = filteredEvents.slice(
        indexOfFirstEvent,
        indexOfLastEvent
    );

    const handleEventsPageChange = (e) => {
        dispatch(setEventsPerPage(Number(e.target.value)));
    };
    useEffect(() => {

        const fetchEventsAndWorkshops = async () => {
            dispatch(fetchStatsStart());
            try {
                const response = await axiosRequest.get(`/events/`);
                const eventsData = response.data;

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

                        const organizerResponse = await axiosRequest.get(`/organizers/get/${event.organizerId}`);
                        const organizerName = organizerResponse.data.name;

                        let eventTotalParticipants = 0;
                        let eventCurrentParticipants = 0;

                        workshops.forEach((workshop) => {
                            eventTotalParticipants += workshop.numberOfAttendees;
                            eventCurrentParticipants += workshop.currentParticipants;
                        });

                        totalParticipants += eventTotalParticipants;
                        currentParticipants += eventCurrentParticipants;
                        const overallProgress = eventTotalParticipants > 0
                            ? ((eventCurrentParticipants / eventTotalParticipants) * 100).toFixed(2)
                            : "0.00";


                        return {
                            ...event,
                            totalParticipants: eventTotalParticipants,
                            currentParticipants: eventCurrentParticipants,
                            overallProgress,
                            organizerName,
                        };
                    })
                );
                const users = [...new Set(updatedEvents.map(event => event.organizerName))];
                setUniqueUsers(users);
                const totalOrganizers = users.length;
                console.log("haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", users, users.length)
                dispatch(fetchStatsSuccess({
                    events: updatedEvents,
                    totalParticipants,
                    currentParticipants,
                    totalWorkshops,
                    totalOrganizers
                }));
            } catch (error) {
                console.error("Error fetching events and workshops", error);
                dispatch(fetchStatsFailure(error.message));
            }
        };

        fetchEventsAndWorkshops();
    }, []);
    const getEventStatus = (startDate, endDate) => {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (currentDate > end) {
            return { status: "Done", badgeClass: "badge bg-label-success" };
        } else if (currentDate < start) {
            return { status: "Upcoming", badgeClass: "badge bg-label-primary" };
        } else {
            return { status: "Ongoing", badgeClass: "badge bg-label-warning" };
        }
    };
    return (

        <div className="card mb-6">

            <div className="table-responsive mb-4">
                <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                    <div className="card-header py-sm-0 d-flex justify-content-between mt-3 mb-4">
                        <div className="head-label text-center">
                            <h5 className="card-title mb-0 text-nowrap">All Events</h5>
                        </div>
                        <div className="d-flex">
                            <div className="d-flex align-items-center">
                                <select
                                    className="form-select me-2"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                >
                                    <option value="">All Users</option>
                                    {uniqueUsers.map(user => (
                                        <option key={user} value={user}>{user}</option>
                                    ))}
                                </select>
                            </div>

                            <div id="DataTables_Table_0_filter" className="dataTables_filter me-2">
                                <label>
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder="Search Event"
                                        aria-controls="DataTables_Table_0"
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div
                                style={{ width: "auto" }}
                                className="dataTables_length"
                                id="DataTables_Table_0_length"
                            >
                                <label>
                                    <select
                                        name="DataTables_Table_0_length"
                                        aria-controls="DataTables_Table_0"
                                        className="form-select extend-select me-2"
                                        onChange={handleEventsPageChange}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                    </select>
                                </label>
                            </div>
                            <div className="d-flex align-items-center">
                                <select
                                    className="form-select me-2"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="asc">Sort A-Z</option>
                                    <option value="desc">Sort Z-A</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    {isLoading ? (
                        <p>Loading events...</p>
                    ) : (
                        <table className="table table-sm datatables-academy-course dataTable no-footer dtr-column" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info">
                            <thead className="border-top">
                                <tr>
                                    <th className="control sorting_disabled dtr-hidden" rowSpan="1" colSpan="1" style={{ width: 0, display: 'none' }} aria-label=""></th>

                                    <th className="sorting sorting_desc" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '462px' }} aria-label="Course Name: activate to sort column ascending" aria-sort="descending">Event Name</th>
                                    <th className="sorting" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '150px' }} aria-label="Organizer: activate to sort column ascending">Organizer</th>
                                    <th className="sorting" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '95px' }} aria-label="Time: activate to sort column ascending">Time</th>
                                    <th className="w-25 sorting" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '307px' }} aria-label="Progress: activate to sort column ascending">Registration Progress</th>
                                    <th className="w-25 sorting" tabIndex="0" aria-controls="DataTables_Table_0" rowSpan="1" colSpan="1" style={{ width: '307px' }} aria-label="Status: activate to sort column ascending">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEvents &&
                                    currentEvents.map((event) => (
                                        <tr key={event.id} className="odd">
                                            <td className="control dtr-hidden" tabIndex="0" style={{ display: 'none' }}></td>

                                            <td className="sorting_1">
                                                <div className="d-flex align-items-center">
                                                    <span className="me-4">
                                                        <span className="badge bg-label-success rounded p-1_5">
                                                            <i className="bx bxs-color bx-28px m-0"></i>
                                                        </span>
                                                    </span>
                                                    <div>
                                                        <a className="text-heading text-truncate fw-medium mb-2 text-wrap" href="app-academy-course-details.html">{event.name}</a>

                                                    </div>
                                                </div>
                                            </td>
                                            <td>{event.organizerName}</td>

                                            <td>
                                                <td>
                                                    <span className="fw-medium text-nowrap text-heading">
                                                        {new Date(event.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                    </span>
                                                </td>
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
                                                        <span
                                                            className={
                                                                getEventStatus(event.startDate, event.endDate)
                                                                    .badgeClass
                                                            }
                                                        >
                                                            {
                                                                getEventStatus(event.startDate, event.endDate)
                                                                    .status
                                                            }
                                                        </span>                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                    <div className="row mt-6" id="pagination-section">
                        <div className="col-sm-12 col-md-6">
                            <div
                                className="dataTables_info"
                                id="DataTables_Table_0_info"
                                role="status"
                                aria-live="polite"
                            >
                                {`Showing ${indexOfFirstEvent + 1} to ${Math.min(
                                    indexOfLastEvent,
                                    events.length
                                )} of ${events.length} entries`}
                            </div>
                        </div>
                        <Pagination
                            unitsPerPage={eventsPerPage}
                            totalUnits={events.length}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

        </div>

    );
}
export default Events;