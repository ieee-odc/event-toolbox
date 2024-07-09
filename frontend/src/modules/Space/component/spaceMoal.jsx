import React, { useState } from "react";
import axios from "axios";

function SpaceModal({ isOpen, toggleModal, orgId }) {
  const [spaceName, setSpaceName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const modalClassName = isOpen ? "modal fade show" : "modal fade";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const spaceData = {
        capacity: parseInt(capacity),
        name: spaceName
      };

      // Make POST request to create space
      const response = await axios.post(`http://localhost:6001/space/create/${orgId}`, spaceData);

      console.log('Space created:', response.data);
      setIsSuccess(true);

      // Optionally, close modal or handle success state
      setTimeout(() => {
        toggleModal();
        setIsSuccess(false);
      }, 2000); // Close modal and reset success state after 2 seconds
    } catch (error) {
      console.error('Error creating space:', error);
      setError(error.message || 'Failed to create space');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {isOpen && <div className="modal-backdrop fade show"></div>}
      <div className={modalClassName} id="spaceModal" tabIndex="-1" style={{ display: isOpen ? "block" : "none", zIndex: 99999 }} aria-modal="true" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Space</h5>
              <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {isSuccess && (
                  <div className="alert alert-success" role="alert">
                    Space created successfully!
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="spaceName" className="form-label">Space Name</label>
                  <input
                    type="text"
                    id="spaceName"
                    className="form-control"
                    placeholder="Enter Space Name"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="capacity" className="form-label">Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    className="form-control"
                    placeholder="Enter Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-label-secondary" onClick={toggleModal}>Close</button>
                <button type="submit" className="btn btn-primary" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpaceModal;
