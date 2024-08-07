import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axiosRequest from '../../../utils/AxiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setEventId } from '../../../core/Features/Stats';

export default function ParticipationChart() {
    const [participantsData, setParticipantsData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [range, setRange] = useState(7);
    const { events, eventId } = useSelector((state) => state.statsStore);
    const dispatch = useDispatch();

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

                if (eventId) {
                    const response = await axiosRequest.get(`/participant/get-event/${eventId}`);
                    const participants = response.data.participants;

                    const rangeParticipants = dates.map(date => {
                        return participants.filter(participant => {
                            const participantDate = new Date(participant.createdAt).toISOString().split('T')[0];
                            return participantDate === date;
                        }).length;
                    });

                    setParticipantsData(rangeParticipants);
                } else {
                    const rangeParticipants = new Array(range).fill(0);

                    const allEventsData = await Promise.all(events.map(event =>
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

                    setParticipantsData(rangeParticipants);
                }

                setLabels(labels);
            } catch (error) {
                console.error("Error fetching participants", error);
            }
        };

        fetchParticipants();
    }, [eventId, events, range]);

    const handleEventChange = (e) => {
        dispatch(setEventId(Number(e.target.value)));
    };

    const handleRangeChange = (e) => {
        setRange(Number(e.target.value));
    };

    return (
        <div className="card mb-4 w-100">
            <div className='d-flex justify-content-between m-4 mb-1'>
                <h5 className="card-title mb-0">Daily Participants</h5>
                <div className="d-flex">
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
                                {events.map((event) => (
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
        </div>
    );
}
