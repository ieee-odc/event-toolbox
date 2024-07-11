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
  toggleFormModal,
  selectForm,
} from "../../../core/Features/Forms";

const FormsList = () => {
  const dispatch = useDispatch();
  const { forms, filteredForms } = useSelector((store) => store.formsStore);

  const userData = UserData();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const onAddFormClick = () => {
    dispatch(toggleFormModal());
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axiosRequest.get(
          `/forms/get-organizer/${userData.id}`
        );
        dispatch(initializeForms(response.data.forms));
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        // dispatch(toggleEventsIsLoading());
      }
    };

    fetchForms();
  }, []);

  const handleEditClick = (form) => {
    dispatch(selectForm(form));
    dispatch(toggleFormModal());
  };

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

  function formatDate(originalDate) {
    const date = new Date(originalDate);

    const day = String(date.getDate()).padStart(2, "0"); // padStart utility: 11/7 -> 11/07
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDate;
  }

  const handleMouseEnter = (iconId) => {
    setHoveredIcon(iconId);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

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
              <th>Deadline</th>
              <th>Event</th>
              <th style={{ textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredForms &&
              filteredForms.map((form) => (
                <tr key={form._id}>
                  <td>
                    <a href="">{form.name}</a>
                  </td>
                  <td>
                    <a href="">{formatDate(form.deadline)}</a>
                  </td>
                  <td></td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleEditClick(form)}
                    >
                      <i
                        className={`bx bx-edit-alt bx-sm ${
                          hoveredIcon === `edit_${form._id}` ? "transform" : ""
                        }`}
                        onMouseEnter={() =>
                          handleMouseEnter(`edit_${form._id}`)
                        }
                        onMouseLeave={handleMouseLeave}
                      ></i>
                    </button>
                    <button
                      className="btn btn-link p-0"
                      onClick={() => handleDeleteForm(form._id)}
                    >
                      <i
                        className={`bx bx-trash bx-sm ${
                          hoveredIcon === `delete_${form._id}`
                            ? "transform"
                            : ""
                        }`}
                        onMouseEnter={() =>
                          handleMouseEnter(`delete_${form._id}`)
                        }
                        onMouseLeave={handleMouseLeave}
                      ></i>
                    </button>
                    <button className="btn btn-link p-0">
                      <i
                        className={`bx bx-share bx-sm ${
                          hoveredIcon === `share_${form._id}` ? "transform" : ""
                        }`}
                        onMouseEnter={() =>
                          handleMouseEnter(`share_${form._id}`)
                        }
                        onMouseLeave={handleMouseLeave}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormsList;
