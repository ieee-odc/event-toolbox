import React from 'react';

const SpaceInfo = ({ Name, capacity, accordionId }) => {
  return (
    <div role="button" className="accordion-button shadow-none collapsed" data-bs-toggle="collapse" data-bs-target={`#${accordionId}`} aria-expanded="false" aria-controls={accordionId}>
      <div className="d-flex align-items-center">
        <div className="avatar-wrapper">
          <div className="avatar me-3">
            <span className="avatar-initial rounded-circle bg-label-secondary"><i className="bx bxs-truck"></i></span>
          </div>
        </div>
        <span className="d-flex flex-column">
          <span className="h6 mb-0">{Name}</span>
          <span className="text-muted">{capacity}</span>
        </span>
      </div>
    </div>
  );
};

export default SpaceInfo;
