import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BaseLayout from '../pages/base';
import EventModal from '../components/popUp';

const FormLandingPage = () => {
    const { eventId } = useParams();
    const [forms, setForms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentForm, setCurrentForm] = useState({
        price: '',
        data: {}
    });

    useEffect(() => {
        fetchFormsByEventId();
    }, [eventId]);

    const fetchFormsByEventId = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/form/${eventId}`);
            setForms(response.data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const handleEditForm = (form) => {
        setCurrentForm(form);
        setIsModalOpen(true);
    };

    const handleUpdateForm = async (formId, updatedData) => {
        try {
            console.log('Sending data for update:', updatedData);  // Log data being sent

            const response = await axios.put(`http://localhost:5000/form/update/${formId}`, updatedData);

            console.log('Received response from update:', response.data);  // Log response data

            const updatedForms = forms.map(form => {
                if (form._id === formId) {
                    return { ...form, ...response.data };
                }
                return form;
            });
            setForms(updatedForms);
        } catch (error) {
            console.error('Error updating form:', error);
        }
    };

    const handleDeleteForm = async (formId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/form/delete/${formId}`);
            const updatedForms = forms.filter(form => form._id !== formId);
            setForms(updatedForms);
        } catch (error) {
            console.error('Error deleting form:', error);
        }
    };

    const handleSubmit = () => {
        handleUpdateForm(currentForm._id, currentForm);
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id.startsWith('data.')) {
            const field = id.split('.')[1];
            setCurrentForm(prevState => ({
                ...prevState,
                data: {
                    ...prevState.data,
                    [field]: value
                }
            }));
        } else {
            setCurrentForm(prevState => ({
                ...prevState,
                [id]: value
            }));
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <BaseLayout>
            <div className="container mt-4">
                <h4 className="py-3 mb-4">
                    <span className="text-muted fw-light">DataTables /</span> Forms
                </h4>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Price</th>
                                {forms.length > 0 && Object.keys(forms[0].data).map((field) => (
                                    <th scope="col" key={field}>{field}</th>
                                ))}
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forms.map((form) => (
                                <tr key={form._id}>
                                    <td>{form.price}</td>
                                    {Object.keys(form.data).map((field) => (
                                        <td key={field}>{form.data[field]}</td>
                                    ))}
                                    <td>
                                        <div className="dropdown">
                                            <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                <i className="bx bx-dots-vertical-rounded"></i>
                                            </button>
                                            <div className="dropdown-menu">
                                                <a className="dropdown-item" href="javascript:void(0);" onClick={() => handleEditForm(form)}><i className="bx bx-edit-alt me-2"></i>Edit</a>
                                                <a className="dropdown-item" href="javascript:void(0);" onClick={() => handleDeleteForm(form._id)}><i className="bx bx-trash me-2"></i>Delete</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {forms.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center">No forms available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <EventModal
                isOpen={isModalOpen}
                toggleModal={toggleModal}
                handleSubmit={handleSubmit}
                newEvent={currentForm}
                handleInputChange={handleInputChange}
            />
        </BaseLayout>
    );
};

export default FormLandingPage;
