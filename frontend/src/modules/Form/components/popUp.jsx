import React from "react";
import "../components/Event.css";

function EventModal({
  isOpen,
  toggleModal,
  handleSubmit,
  newEvent,
  handleInputChange,
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
                Update Form
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
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Price
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter Name"
                    value={newEvent.name}
                    onChange={handleInputChange}
                  />
                </div>
                 {/* Dynamically generate input fields based on newEvent.data */}
                 {Object.keys(newEvent.data).map((key) => (
                  <div className="mb-3" key={key}>
                    <label htmlFor={key} className="form-label">
                      {key}
                    </label>
                    <input
                      type="text"
                      id={key}
                      className="form-control"
                      placeholder={`Enter ${key}`}
                      value={newEvent.data[key]}
                      onChange={(e) =>
                        handleInputChange({
                          target: { id: `data.${key}`, value: e.target.value },
                        })
                      }
                    />
                  </div>
                ))}
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
                  Save
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
