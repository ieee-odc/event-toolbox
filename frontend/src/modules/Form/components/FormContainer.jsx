import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteForm,
  initializeForms,
  resetFormModal,
  setSelectedForm,
  toggleFormModal,
} from "../../../core/Features/Forms";
import FormModal from "./FormModal";
import axiosRequest from "../../../utils/AxiosConfig";
import toast from "react-hot-toast";
import { UserData } from "../../../utils/UserData";

function FormContainer() {
  const dispatch = useDispatch();
  const userData = UserData();
  const { filteredForms, forms } = useSelector((store) => store.formsStore);

  function formatDate(originalDate) {
    const date = new Date(originalDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDate;
  }
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleMouseEnter = (iconId) => {
    setHoveredIcon(iconId);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  const handleDeleteForm = (formId) => {
    axiosRequest.delete(`/form/delete/${formId}`).then((res) => {
      dispatch(deleteForm(formId));
      toast.success("Form deleted successfully");
    });
  };

  const handleEditClick = (form) => {
    dispatch(setSelectedForm(form));
    dispatch(toggleFormModal());
  };

  return (
    <div className="flex-grow-1 container-p-y">
      <div className="card mb-4">
        <div className="card-widget-separator-wrapper">
          <div className="card-body card-widget-separator">
            <div className="row gy-4 gy-sm-1">
              <div className="col-sm-6 col-lg-3">
                <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                  <div>
                    <h3 className="mb-1">24</h3>
                    <p className="mb-0">Clients</p>
                  </div>
                  <div className="avatar me-sm-4">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-user bx-sm" />
                    </span>
                  </div>
                </div>
                <hr className="d-none d-sm-block d-lg-none me-4" />
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="d-flex justify-content-between align-items-start card-widget-2 border-end pb-3 pb-sm-0">
                  <div>
                    <h3 className="mb-1">165</h3>
                    <p className="mb-0">Invoices</p>
                  </div>
                  <div className="avatar me-lg-4">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-file bx-sm" />
                    </span>
                  </div>
                </div>
                <hr className="d-none d-sm-block d-lg-none" />
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="d-flex justify-content-between align-items-start border-end pb-3 pb-sm-0 card-widget-3">
                  <div>
                    <h3 className="mb-1">$2.46k</h3>
                    <p className="mb-0">Paid</p>
                  </div>
                  <div className="avatar me-sm-4">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-check-double bx-sm" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h3 className="mb-1">$876</h3>
                    <p className="mb-0">Unpaid</p>
                  </div>
                  <div className="avatar">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-error-circle bx-sm" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="container-fluid mt-4">
          <div style={{display:"flex",justifyContent:"end"}}>
          <button
            className="btn btn-primary mb-4"
            onClick={() => {
              dispatch(toggleFormModal());
              // dispatch(resetFormModal());
            }}
          >
            Create Form
          </button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th>Deadline</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredForms &&
                  filteredForms.map((form) => (
                    <tr key={form.id}>
                      <td>
                        <a href="">{form.name}</a>
                      </td>
                      <td>
                        <a href="">{formatDate(form.deadline)}</a>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-link p-0"
                          onClick={() => handleEditClick(form)}
                        >
                          <i
                            className={`bx bx-edit-alt bx-sm ${
                              hoveredIcon === `edit_${form._id}`
                                ? "transform"
                                : ""
                            }`}
                            onMouseEnter={() =>
                              handleMouseEnter(`edit_${form._id}`)
                            }
                            onMouseLeave={handleMouseLeave}
                          ></i>
                        </button>
                        <button
                          className="btn btn-link p-0"
                          onClick={() => handleDeleteForm(form.id)}
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
                              hoveredIcon === `share_${form._id}`
                                ? "transform"
                                : ""
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

                  {filteredForms&&
                    filteredForms.length===0&& (
                      <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        <span>There is no data currently</span>
                      </td>
                    </tr>
                    )
                  }
              </tbody>
            </table>
          </div>
          <FormModal />
        </div>
      </div>
    </div>
  );
}

export default FormContainer;
