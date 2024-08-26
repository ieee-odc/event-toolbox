import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axiosRequest from '../../../utils/AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setEventId } from '../../../core/Features/Stats';

export default function GlobalParticipationChart() {
    const [participantsData, setParticipantsData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [range, setRange] = useState(7);
    const { events, eventId } = useSelector((state) => state.statsStore);
    const dispatch = useDispatch();
    const [organizers, setOrganizers] = useState([]);
    const [selectedOrganizer, setSelectedOrganizer] = useState(0);

    useEffect(() => {
        const fetchOrganizers = async () => {
            try {
                const response = await axiosRequest.get(`/organizers/`);
                setOrganizers(response.data);
                console.log("organizers", organizers)
            } catch (error) {
                console.error("Error fetching organizers", error);
            }
        };

        fetchOrganizers();
    }, []);

    useEffect(() => {
        const filteredEvents = selectedOrganizer === 0
            ? events
            : events.filter(event => event.organizerId === selectedOrganizer);

        // Set eventId to 0 (All Events) when the organizer changes
        if (selectedOrganizer !== 0) {
            dispatch(setEventId(0));
        }
    }, [selectedOrganizer, events, dispatch]);




    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const currentDate = new Date();
                const dates = [];
                const labels = [];

                for (let i = range - 1; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(currentDate.getDate() - i);
                    dates.push(date.toISOString().split('T')[0]);
                    labels.push(
                        i === 0 ? 'Today' :
                            i === 1 ? 'Yesterday' :
                                `${i} days ago`
                    );
                }

                let rangeParticipants = new Array(range).fill(0);

                const filteredEvents = selectedOrganizer === 0
                    ? events
                    : events.filter(event => event.organizerId === selectedOrganizer);




                if (eventId && eventId !== 0) {
                    // Fetch participants for a specific event
                    const response = await axiosRequest.get(`/participant/get-event/${eventId}`);
                    const participants = response.data.participants;

                    rangeParticipants = dates.map(date => {
                        return participants.filter(participant => {
                            const participantDate = new Date(participant.createdAt).toISOString().split('T')[0];
                            return participantDate === date;
                        }).length;
                    });
                } else {
                    const allEventsData = await Promise.all(filteredEvents.map(event =>
                        axiosRequest.get(`/participant/get-event/${event.id}`)
                    ));

                    allEventsData.forEach(response => {
                        const participants = response.data.participants;
                        dates.forEach((date, index) => {
                            const count = participants.filter(participant => {
                                const participantDate = new Date(participant.createdAt).toISOString().split('T')[0];
                                return participantDate === date;
                            }).length;
                            rangeParticipants[index] += count;
                        });
                    });
                }

                setParticipantsData(rangeParticipants);
                setLabels(labels);

            } catch (error) {
                console.error("Error fetching participants", error);
            }
        };

        fetchParticipants();
    }, [eventId, events, range, selectedOrganizer]);


    const handleEventChange = (e) => {
        dispatch(setEventId(Number(e.target.value)));
    };

    const handleRangeChange = (e) => {
        setRange(Number(e.target.value));
    };

    const filteredEvents = selectedOrganizer === 0
        ? events
        : events.filter(event => event.organizerId === selectedOrganizer);

    const handleOrganizerChange = (e) => {
        setSelectedOrganizer(Number(e.target.value));
        dispatch(setEventId(0));  // Reset eventId when organizer changes
    };

    return (
        <div className="card mb-4 w-100">
            <div className='d-flex justify-content-between m-4 mb-1'>
                <h5 className="card-title mb-0">Participation</h5>
                <div className="d-flex">
                    <div style={{ width: "auto" }} className="dataTables_length me-3">
                        <label>
                            <select
                                name="organizer_select"
                                aria-controls="organizer_select"
                                className="form-select extend-select"
                                onChange={(e) => { console.log(e.target.value), handleOrganizerChange(e) }}
                                value={selectedOrganizer}
                            >
                                <option value="0">All Organizers</option>
                                {organizers.map((organizer) => (
                                    <option key={organizer.id} value={organizer.id}>
                                        {organizer.username}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div style={{ width: "auto" }} className="dataTables_length me-3">
                        <label>
                            <select
                                name="DataTables_Table_0_length"
                                aria-controls="DataTables_Table_0"
                                className="form-select extend-select"
                                onChange={handleEventChange}
                                value={eventId}
                            >
                                <option value="0">All Events</option>
                                {filteredEvents.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.name}
                                    </option>
                                ))}


                            </select>
                        </label>
                    </div>
                    <div style={{ width: "auto" }} className="dataTables_length">
                        <label>
                            <select
                                name="range_select"
                                aria-controls="range_select"
                                className="form-select extend-select"
                                onChange={handleRangeChange}
                                value={range}
                            >
                                <option value="7">Past Week</option>
                                <option value="14">Past 2 Weeks</option>
                                <option value="30">Past Month</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
            <div className="card-widget-separator-wrapper">
                <div className="card-body d-flex align-items-center card-widget-separator">
                    {participantsData.length > 0 && labels.length > 0 ? (
                        <LineChart
                            xAxis={[{ scaleType: 'point', data: labels }]}
                            yAxis={[{ tickFormat: (value) => Math.floor(value) }]}
                            series={[
                                {
                                    data: participantsData,
                                    area: false,
                                    color: "#1976d2"
                                },
                            ]}
                            width={500}
                            height={300}
                            color={"#1976d2"}
                        />
                    ) : (
                        <p>Loading data...</p>
                    )}
                </div>
            </div>
        </div >
    );
}
