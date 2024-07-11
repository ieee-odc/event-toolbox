import React, { useState } from 'react';
import SpaceModal from '../../Space/component/spaceMoal';

function SpaceInfo({ name, capacity, spaceId, accordionId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div role="button" className="accordion-button shadow-none collapsed" data-bs-toggle="collapse" data-bs-target={`#${accordionId}`} aria-expanded="false" aria-controls={accordionId} onClick={toggleModal}>
        <div className="d-flex align-items-center">
          <div className="avatar-wrapper">
            <div className="avatar me-3">
              <span className="avatar-initial rounded-circle bg-label-secondary"><i className="bx bxs-truck"></i></span>
            </div>
          </div>
          <span className="d-flex flex-column">
            <span className="h6 mb-0">{name}</span>
            <span className="text-muted">{capacity}</span>
          </span>
        </div>
      </div>
      <SpaceModal isOpen={isModalOpen} toggleModal={toggleModal} mode="update" spaceId={spaceId} name={name} capacity={capacity} />
    </>
  );
};

export default SpaceInfo;
