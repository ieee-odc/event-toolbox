import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom

const FormLandingPage = () => {
    const { eventId } = useParams(); // Get eventId from URL path
    const [forms, setForms] = useState([]);

    useEffect(() => {
        fetchFormsByEventId();
    }, [eventId]);

    const fetchFormsByEventId = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/form/${eventId}`); // Use eventId from useParams
            setForms(response.data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Event's Forms : </h2> {/* Display the eventId */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        
                        <th scope="col">Price</th>
                        <th scope="col">Data</th>
                    </tr>
                </thead>
                <tbody>
                    {forms.map((form) => (
                        <tr>
                            <td>{form.price}</td>
                            <td>{JSON.stringify(form.data)}</td> {/* Adjust display based on your data structure */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FormLandingPage;
