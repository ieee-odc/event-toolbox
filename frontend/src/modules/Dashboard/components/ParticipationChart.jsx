import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axiosRequest from '../../../utils/AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setEventId } from '../../../core/Features/Stats';

export default function ParticipationChart() {
    const [participantsData, setParticipantsData] = useState([]);
    const [pastWeekLabels, setPastWeekLabels] = useState([]);
    const { events, eventId } = useSelector((state) => state.statsStore);
    const dispatch = useDispatch();


    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const currentDate = new Date();
                const pastWeekDates = [];
                const labels = [];

                // Get dates for the past week and create labels
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(currentDate.getDate() - i);
                    pastWeekDates.push(date.toISOString().split('T')[0]);
                    labels.push(i === 0 ? 'Today' : i === 1 ? 'Yesterday' : `${i} days ago`);
                }

                if (eventId) {
                    const response = await axiosRequest.get(`/participant/get-event/${eventId}`);
                    const participants = response.data.participants;

                    const weeklyParticipants = pastWeekDates.map(date => {
                        return participants.filter(participant => {
                            const participantDate = new Date(participant.createdAt).toISOString().split('T')[0];
                            return participantDate === date;
                        }).length;
                    });

                    setParticipantsData(weeklyParticipants);
                } else {
                    const weeklyParticipants = new Array(7).fill(0);

                    // Fetch participants for all events
                    const allEventsData = await Promise.all(events.map(event =>
                        axiosRequest.get(`/participant/get-event/${event.id}`)
                    ));

                    allEventsData.forEach(response => {
                        const participants = response.data.participants;
                        pastWeekDates.forEach((date, index) => {
                            const count = participants.filter(participant => {
                                const participantDate = new Date(participant.createdAt).toISOString().split('T')[0];
                                return participantDate === date;
                            }).length;
                            weeklyParticipants[index] += count;
                        });
                    });

                    setParticipantsData(weeklyParticipants);
                }

                setPastWeekLabels(labels);
            } catch (error) {
                console.error("Error fetching participants", error);
            }
        };

        fetchParticipants();
    }, [eventId, events]);

    const handleEventChange = (e) => {
        dispatch(setEventId(Number(e.target.value)));
    };

    return (
        <div className="card mb-4 w-100">
            <div className='d-flex justify-content-between m-4 mb-1'>
                <h5 className="card-title mb-0">Daily Participants</h5>
                <div style={{ width: "auto" }} className="dataTables_length" id="DataTables_Table_0_length">
                    <label>
                        <select
                            name="DataTables_Table_0_length"
                            aria-controls="DataTables_Table_0"
                            className="form-select extend-select"
                            onChange={handleEventChange}
                            value={eventId}
                        >
                            <option value="0">All Events</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            <div className="card-widget-separator-wrapper">
                <div className="card-body d-flex align-items-center card-widget-separator">
                    {participantsData.length > 0 && pastWeekLabels.length > 0 ? (
                        <LineChart
                            xAxis={[{ scaleType: 'point', data: pastWeekLabels }]}
                            yAxis={[{ tickFormat: (value) => Math.floor(value) }]}
                            series={[
                                {
                                    data: participantsData,
                                    area: true,
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
        </div>
    );
}
