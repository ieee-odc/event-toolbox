import React, { useState } from 'react'
import axiosRequest from '../../../utils/AxiosConfig'
import toast from 'react-hot-toast';

function ParticipantModal({isModalOpen,setIsModalOpen,setParticipants}) {
    const [email,setEmail]=useState("");
    const [fullName,setFullName]=useState("");
    const [eventId,setEventId]=useState("1"); // set the first even id after fetching it
    const handleAddParticipant=()=>{
        const reqBody={
            email,fullName,eventId
        }
        console.log(reqBody)
        axiosRequest.post("/participant/add",reqBody).then((res)=>{
            toast.success('Successfully created!');
            console.log(res.data)
            setIsModalOpen(false);
            setParticipants(participants=>[...participants,res.data.participant])
        }).catch((err)=>{
            toast.error("Failed to add participant")
        })
    }


    // TODO: add fetching events based on organizerID
  return (
isModalOpen && (<div
    className="modal fade show"
    id="modalCenter"
    tabIndex={-1}
    style={{ display: "block" }}
    aria-modal="true"
    role="dialog"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="modalCenterTitle">
            Add Participant
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={()=>{
                setIsModalOpen(false)
            }}
          />
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col mb-3">
              <label htmlFor="nameWithTitle" className="form-label">
                Full Name
              </label>
              <input
              value={fullName
              }
              onChange={(e)=>setFullName(e.target.value)}
                type="text"
                id="nameWithTitle"
                className="form-control"
                placeholder="Enter Name"
              />
            </div>
          </div>
          <div className="row g-2">
            <div className="col mb-0">
              <label htmlFor="emailWithTitle" className="form-label">
                Email
              </label>
              <input
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
                type="email"
                id="emailWithTitle"
                className="form-control"
                placeholder="xxxx@xxx.xx"
              />
            </div>
            <div className="col mb-0">
            <label htmlFor="emailWithTitle" className="form-label">
                Event
              </label>
  <select
    id="select2Basic"
    className="select2 form-select form-select-md select2-hidden-accessible"
    data-allow-clear="true"
    data-select2-id="select2Basic"
    tabIndex={-1}
    aria-hidden="true"
    value={eventId}
    onChange={(e)=>setEventId(e.target.value)}
  >
    <option value="1" data-select2-id={2}>
      Alaska
    </option>
    <option value="2" data-select2-id={54}>
      Hawaii
    </option>
    <option value="3" data-select2-id={55}>
      California
    </option>

  </select>

</div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-label-secondary"
            data-bs-dismiss="modal"
            onClick={()=>{
                setIsModalOpen(false)
            }}
          >
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handleAddParticipant}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
  )
  )
}

export default ParticipantModal
