import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EventModal from "../components/popUp";
import axiosRequest from "../../../utils/AxiosConfig";
import DashboardLayout from "../../../core/components/DashboardLayout/DashboardLayout";
import "../Form.css";
const FormLandingPage = () => {
  const { eventId } = useParams();
  const [forms, setForms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentForm, setCurrentForm] = useState({
    eventId: eventId,
    name: "",
    description: "",
    // price: '',
    data: {},
  });

  useEffect(() => {
    fetchFormsByEventId();
  }, [eventId]);

  const fetchFormsByEventId = async () => {
    try {
      const response = await axiosRequest.get(`/form/${eventId}`);
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const handleCreateForm = () => {
    setCurrentForm({
      eventId: eventId,
      description: "",
      name: "",
      //   price: "",
      data: {},
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditForm = (form) => {
    setCurrentForm(form);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleUpdateForm = async (formId, updatedData) => {
    try {
      const response = await axiosRequest.put(
        `/form/update/${formId}`,
        updatedData
      );
      const updatedForms = forms.map((form) => {
        if (form._id === formId) {
          return { ...form, ...response.data };
        }
        return form;
      });
      setForms(updatedForms);
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  const handleCreateNewForm = async (newData) => {
    try {
      const response = await axiosRequest.post(`/form/createform`, newData);
      setForms([...forms, response.data]);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      const response = await axiosRequest.delete(`/form/delete/${formId}`);
      const updatedForms = forms.filter((form) => form._id !== formId);
      setForms(updatedForms);
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const handleSubmit = () => {
    if (isEditMode) {
      handleUpdateForm(currentForm._id, currentForm);
    } else {
      handleCreateNewForm(currentForm);
    }
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith("data.")) {
      const field = id.split(".")[1];
      setCurrentForm((prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          [field]: value,
        },
      }));
    } else {
      setCurrentForm((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const addField = () => {
    const newField = `field${Object.keys(currentForm.data).length + 1}`;
    setCurrentForm((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        [newField]: "",
      },
    }));
  };

  const removeField = (fieldName) => {
    const { [fieldName]: _, ...newData } = currentForm.data;
    setCurrentForm((prevState) => ({
      ...prevState,
      data: newData,
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [openSideBar, setOpenSideBar] = useState(true);

  const toggleSideBar = () => {
    console.log("clicked");
    setOpenSideBar((prev) => !prev);
  };

  return (
    <DashboardLayout
      openSideBar={openSideBar}
      setOpenSideBar={openSideBar}
      isModalOpen={isModalOpen}
      toggleSideBar={toggleSideBar}
    >
      <div className="container-fluid mt-4">
        <h4 className="py-3 mb-4">
          <span className="text-muted fw-light">DataTables /</span> Forms
        </h4>
        <button className="btn btn-primary mb-4" onClick={handleCreateForm}>
          Create Form
        </button>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th>Actions</th>
                {/* {forms.length > 0 &&
                  Object.keys(forms[0].data).map((field) => (
                    <th scope="col" key={field}>
                      {field}
                    </th>
                  ))} */}
                {/* <th scope="col">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form._id}>
                  <td>
                    <a href="">{form.name}</a>
                  </td>
                  {/* {Object.keys(form.data).map((field) => (
                    <td key={field}>{form.data[field]}</td>
                  ))} */}
                  <td>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleEditForm(form)}
                    >
                      <i className="bx bx-edit-alt"></i>
                    </button>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleDeleteForm(form._id)}
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                    <button className="btn btn-link p-0">
                      <i className="bx bx-share"></i>
                    </button>
                  </td>
                </tr>
              ))}
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
        isEditMode={isEditMode}
        addField={addField}
        removeField={removeField}
        eventId={eventId}
      />
    </DashboardLayout>
  );
};

export default FormLandingPage;
