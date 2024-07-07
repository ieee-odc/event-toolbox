import React from "react";
import "../components/Event.css";

function EventModal({
  isOpen,
  toggleModal,
  handleSubmit,
  newEvent,
  handleInputChange,
  isEditMode,
  addField,
  removeField
}) {
  const modalClassName = isOpen ? "modal fade show" : "modal fade";

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <>
      {isOpen && <div className="modal-backdrop fade show"></div>}
      <div
        className={modalClassName}
        id="basicModal"
        tabIndex="-1"
        style={{ display: isOpen ? "block" : "none" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel1">
                {isEditMode ? "Update Form" : "Create Form"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={toggleModal}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                {!isEditMode && (
                  <div className="mb-3">
                    
                    
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="text"
                    id="price"
                    className="form-control"
                    placeholder="Enter Price"
                    value={newEvent.price || ''}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Dynamically generate input fields based on newEvent.data */}
                {Object.keys(newEvent.data || {}).map((key) => (
                  <div className="mb-3" key={key}>
                    <label htmlFor={key} className="form-label">
                      {key}
                    </label>
                    <div className="d-flex">
                      <input
                        type="text"
                        id={`data.${key}`}
                        className="form-control"
                        placeholder={`Enter ${key}`}
                        value={newEvent.data[key] || ''}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => removeField(key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addField}
                >
                  Add Field
                </button>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-label-secondary"
                  onClick={toggleModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventModal;
