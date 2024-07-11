import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SpaceModal({ isOpen, toggleModal, orgId, spaceId, name, capacity, onSpaceCreated }) {
  const [spaceName, setSpaceName] = useState(name || ''); // Initialize with provided name or empty string
  const [spaceCapacity, setSpaceCapacity] = useState(capacity || ''); // Initialize with provided capacity or empty string
  const [isCreating, setIsCreating] = useState(!spaceId); // Determine if creating or updating based on presence of spaceId
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Effect to reset form fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setSpaceName(name || '');
      setSpaceCapacity(capacity || '');
      setIsCreating(!spaceId); // Determine if creating or updating based on presence of spaceId
    }
  }, [isOpen, spaceId, name, capacity]);

  const modalClassName = isOpen ? "modal fade show" : "modal fade";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setIsUpdating(true);

    try {
      const spaceData = {
        capacity: parseInt(spaceCapacity),
        name: spaceName,
      };

      let response;
      if (isCreating) {
        // Make POST request to create space
        response = await axios.post(`http://localhost:6001/space/create/${orgId}`, spaceData);
      } else {
        // Make PUT request to update space
        response = await axios.put(`http://localhost:6001/space/update/${spaceId}`, spaceData);
      }

      console.log(isCreating ? 'Space created:' : 'Space updated:', response.data);
      setIsSuccess(true);
      setTimeout(() => {
        toggleModal();
        setIsSuccess(false);
        onSpaceCreated(); // Notify parent component of space creation/update
      }, 2000); // Close modal and reset success state after 2 seconds
    } catch (error) {
      console.error(isCreating ? 'Error creating space:' : 'Error updating space:', error);
      setError(error.message || `Failed to ${isCreating ? 'create' : 'update'} space`);
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:6001/space/delete/${spaceId}`);
      console.log('Space deleted:', response.data);
      setIsSuccess(true);

      setTimeout(() => {
        toggleModal();
        setIsSuccess(false);
        onSpaceCreated(); // Notify parent component of space deletion
      }, 2000);
    } catch (error) {
      console.error('Error deleting space:', error);
      setError(error.message || 'Failed to delete space');
    }
  };

  return (
    <>
      {isOpen && <div className="modal-backdrop fade show"></div>}
      <div className={modalClassName} id="spaceModal" tabIndex="-1" style={{ display: isOpen ? "block" : "none", zIndex: 99999 }} aria-modal="true" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isCreating ? 'Create New Space' : 'Update Space'}</h5>
              <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {isSuccess && (
                  <div className="alert alert-success" role="alert">
                    {isCreating ? 'Space created successfully!' : 'Space updated successfully!'}
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
                  <label htmlFor="spaceCapacity" className="form-label">Capacity</label>
                  <input
                    type="number"
                    id="spaceCapacity"
                    className="form-control"
                    placeholder="Enter Capacity"
                    value={spaceCapacity}
                    onChange={(e) => setSpaceCapacity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-label-secondary" onClick={toggleModal}>Close</button>
                <button type="submit" className="btn btn-primary">
                  {isCreating ? 'Create' : 'Update'}
                </button>
                {spaceId && (
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpaceModal;
