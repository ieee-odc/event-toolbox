import React, { useEffect, useState } from 'react';

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { UserData } from '../../../utils/UserData';
import { useDispatch, useSelector } from 'react-redux';
import { setWorkshopId, fetchWorkshops } from '../../../core/Features/Stats';
import axiosRequest from '../../../utils/AxiosConfig';
import "../Dashboard.css"

function SpaceChart() {
    const { workshopId, workshops } = useSelector((state) => state.statsStore);
    const dispatch = useDispatch();
    const userdata = UserData();
    const organizerId = userdata.id;
    const [workshop, setWorkshop] = useState(null);
    useEffect(() => {
        const fetchOrganizerWorkshops = async () => {
            try {
                const response = await axiosRequest.get(`/workshop/get-organizer/${organizerId}`);

                dispatch(fetchWorkshops({ workshops: response.data.workshops }))
            } catch (error) {
                console.error("Error fetching workshops", error);
            }
        };

        fetchOrganizerWorkshops();
    }, [organizerId]);
    useEffect(() => {
        const fetchWorkshopDetails = async () => {
            try {
                const response = await axiosRequest.get(`/workshop/${workshopId}`);
                setWorkshop(response.data.workshop);
                console.log(response.data.workshop.numberOfAttendees)
            } catch (error) {
                console.error("Error fetching workshop details", error);
            }
        };
        fetchWorkshopDetails();
    }, [workshopId]);

    const handleWorkshopChange = (e) => {
        dispatch(setWorkshopId(Number(e.target.value)));
    };

    return (

        <div className="card mb-4 ms-6" style={{
            minWidth: '30%',
        }}>
            <div className='d-flex justify-content-between m-4 mb-1'>
                <h5 className="card-title mb-0">Your Sessions</h5>
                <div style={{ width: "auto" }} className="dataTables_length" id="DataTables_Table_0_length">
                    <label>
                        <select
                            name="DataTables_Table_0_length"
                            aria-controls="DataTables_Table_0"
                            className="form-select extend-select"
                            onChange={handleWorkshopChange}
                            value={workshopId}
                        >
                            {workshops.map((workshop) => (
                                <option key={workshop.id} value={workshop.id}>
                                    {workshop.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            <div className="card-widget-separator-wrapper">
                <div className="card-body d-flex align-items-center card-widget-separator">
                    {workshop ? (
                        <Gauge
                            value={workshop.currentParticipants}
                            valueMax={workshop.numberOfAttendees}
                            startAngle={-110}

                            endAngle={110}
                            sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                    fontSize: "2.3rem",
                                    transform: 'translate(0px, 0px)',
                                },
                            }}
                            text={({ value }) => `${value} / ${workshop.numberOfAttendees}`}
                            width={250}
                            height={300}
                        />

                    ) : (
                        <p>Loading data...</p>
                    )}
                </div>

            </div>
        </div>
    )
}
export default SpaceChart;