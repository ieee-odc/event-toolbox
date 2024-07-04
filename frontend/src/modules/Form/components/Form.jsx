import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
    const [eventId, setEventId] = useState('');
    const [price, setPrice] = useState(0);
    const [formData, setFormData] = useState([]);
    const [message, setMessage] = useState('');

    const handleAddField = () => {
        setFormData([...formData, { label: '', }]);
    };

    const handleRemoveField = (index) => {
        const newFormData = [...formData];
        newFormData.splice(index, 1);
        setFormData(newFormData);
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newFormData = [...formData];
        newFormData[index][name] = value;
        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Format formData to match backend expectation
        const formattedData = {};
        formData.forEach((field, index) => {
            formattedData[`field${index + 1}`] = field.label;
        });

            const response = await axios.post('http://localhost:5000/form/createform', {
                eventId,
                price,
                data: formattedData // Send formatted data to backend
            });

            setMessage('Form created successfully!');
            console.log(response.data); // Log the created form data
        } catch (error) {
            setMessage('Error creating form');
            console.error('Error:', error);
        }
    };

    return (
        <div className="card mb-4">
            <h5 className="card-header">Create Form</h5>
            <div className="card-body">
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="eventId" className="form-label">Event ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="eventId"
                            value={eventId}
                            onChange={(e) => setEventId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Customize Form Fields</label>
                        {formData.map((field, index) => (
                            <div key={index} className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="label"
                                    placeholder="Label"
                                    value={field.label}
                                    onChange={(e) => handleInputChange(index, e)}
                                    required
                                />
                                <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveField(index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-outline-primary" onClick={handleAddField}>Add Field</button>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Form;
