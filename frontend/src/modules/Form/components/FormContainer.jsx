import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteForm, initializeForms, resetFormModal, setSelectedForm, toggleFormModal } from '../../../core/Features/Forms';
import FormModal from './FormModal';
import axiosRequest from '../../../utils/AxiosConfig';
import toast from 'react-hot-toast';
import { UserData } from '../../../utils/UserData';

function FormContainer() {
    const dispatch = useDispatch();
    const userData=UserData();
    const { filteredForms, forms } = useSelector((store) => store.formsStore)

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

      const handleDeleteForm=(formId)=>{
        axiosRequest.delete(`/form/delete/${formId}`).then((res)=>{
            dispatch(deleteForm(formId))
            toast.success("Form deleted successfully")
        })
      }

      const handleEditClick=(form)=>{
        dispatch(setSelectedForm(form))
        dispatch(toggleFormModal())
      }

      useEffect(()=>{
        axiosRequest.get(`/form/get-organizer/${userData.id}`).then((res)=>{
            console.log(res.data.forms)
            dispatch(initializeForms(res.data.forms))
        });
      },[])
    return (
        <div className="container-fluid mt-4">
            <h4 className="py-3 mb-4">
                <span className="text-muted fw-light">DataTables /</span> Forms
            </h4>
            <button className="btn btn-primary mb-4" onClick={() => {
                dispatch(toggleFormModal())
                // dispatch(resetFormModal());
            }}>
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
                                <tr key={form.id}>
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
                                                className={`bx bx-edit-alt bx-sm ${hoveredIcon === `edit_${form._id}` ? "transform" : ""
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
                                                className={`bx bx-trash bx-sm ${hoveredIcon === `delete_${form._id}`
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
                                                className={`bx bx-share bx-sm ${hoveredIcon === `share_${form._id}` ? "transform" : ""
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
            <FormModal/>
        </div>
    )
}

export default FormContainer