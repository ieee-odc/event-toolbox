import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserData } from "./../../../utils/UserData";
import EventModal from "../components/popUp";
import axiosRequest from "../../../utils/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";

import "../Form.css";
import {
  initializeForms,
  addForm,
  deleteForm,
  editForm,
  toggleFormModal,
  selectForm,
} from "../../../core/Features/Forms";
const FormLandingPage = () => {
  const dispatch = useDispatch();
  const { forms, isFormModalOpen } = useSelector((store) => store.formsStore);

  const validateFields = () => {
    const { name, description, deadline } = selectedForm;
    if (!name || !description || !deadline) {
      {
        /* ADD EVENTID LATER */
      }
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const onAddFormClick = () => {
    console.log({ isFormModalOpen });
    dispatch(toggleFormModal());
  };
  const userData = UserData();
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axiosRequest.get(
          `/forms/get-organizer/${userData.id}`
        );
        console.log(response.data);
        dispatch(initializeForms(response.data.forms));
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        // dispatch(toggleEventsIsLoading());
      }
    };

    fetchForms();
  }, []);

  // const fetchForms = async () => {
  //   try {
  //     const response = await axiosRequest.get(`/form/${eventId}`);
  //     setForms(response.data);
  //   } catch (error) {
  //     console.error("Error fetching forms:", error);
  //   }
  // };

  //   const handleCreateForm = () => {
  //     setCurrentForm({
  //       eventId: eventId,
  //       description: "",
  //       name: "",
  //       data: {},
  //     });
  //     setIsEditMode(false);
  //     setIsModalOpen(true);
  //   };

  //   const handleEditForm = (form) => {
  //     setCurrentForm(form);
  //     setIsEditMode(true);
  //     setIsModalOpen(true);
  //   };

  const handleUpdateForm = async (formId, updatedData) => {
    try {
      const response = await axiosRequest.put(
        `/forms/update/${formId}`,
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

  const handleCreateNewForm = async () => {
    try {
      if (!validateFields()) {
        return;
      }
      const response = await axiosRequest.post("/forms/add", {
        ...selectForm,
        organizerId: userData.id,
      });
      dispatch(addForm(response.data));
      dispatch(toggleFormModal());
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      await axiosRequest.delete(`/forms/delete/${formId}`);
      dispatch(deleteForm(formId));
    } catch (error) {
      console.error("Error deleting event:", error);
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

  //   const addField = () => {
  //     const newField = `field${Object.keys(currentForm.data).length + 1}`;
  //     setCurrentForm((prevState) => ({
  //       ...prevState,
  //       data: {
  //         ...prevState.data,
  //         [newField]: "",
  //       },
  //     }));
  //   };

  //   const removeField = (fieldName) => {
  //     const { [fieldName]: _, ...newData } = currentForm.data;
  //     setCurrentForm((prevState) => ({
  //       ...prevState,
  //       data: newData,
  //     }));
  //   };

  return (
    <div className="container-fluid mt-4">
      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">DataTables /</span> Forms
      </h4>
      <button className="btn btn-primary mb-4" onClick={onAddFormClick}>
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
            {forms &&
              forms.map((form) => (
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
    // {/* <EventModal
    //   isOpen={isModalOpen}
    //   toggleModal={toggleModal}
    //   handleSubmit={handleSubmit}
    //   handleInputChange={handleInputChange}
    //   isEditMode={isEditMode}
    //   addField={addField}
    //   removeField={removeField}
    // /> */}
  );
};

export default FormLandingPage;
