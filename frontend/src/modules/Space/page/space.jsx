import React, { useState } from 'react';
//import axios from 'axios'; // Import axios for making HTTP requests
import DashboardLayout from '../../../core/components/DashboardLayout/DashboardLayout';
import SpaceInfo from '../component/spaceContainer'; // Assuming this imports your SpaceInfo component
import SpaceModal from '../component/spaceMoal';

function Space () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgId, setOrgId] = useState(''); // State to hold dynamic orgId

  // Function to handle opening and closing modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Example function to get orgId dynamically
  const fetchOrgId = () => {
    // Implement logic to fetch orgId dynamically
    const fetchedOrgId = '66867772bf26448f9611c07c';
    setOrgId(fetchedOrgId);
    toggleModal(); // Open modal after orgId is fetched
  };

  return (
    <DashboardLayout>
      <div className="container-xxl flex-grow-1 container-p-y">
        
      <div className="d-flex justify-content-end mb-3">
      <button className="btn btn-primary" onClick={fetchOrgId}>Add Space</button>
      <SpaceModal isOpen={isModalOpen} toggleModal={toggleModal} orgId={orgId} />
    </div>
        <div className="card overflow-hidden">
          
          <div className="d-flex app-logistics-fleet-wrapper">
          
            <div className="flex-shrink-0 position-fixed m-4 d-md-none w-auto z-1">
              <button className="btn btn-label-white border border-2 z-2 p-2" data-bs-toggle="sidebar" data-overlay="" data-target="#app-logistics-fleet-sidebar"><i className="bx bx-menu"></i></button>
            </div>
            
            <div className="app-logistics-fleet-sidebar col h-100 show" id="app-logistics-fleet-sidebar">
              <div className="card-header border-0 pt-4 pb-2 d-flex justify-content-between">
                <h5 className="mb-0 card-title">Spaces</h5>
                <i className="bx bx-x bx-sm cursor-pointer close-sidebar d-md-none" data-bs-toggle="sidebar" data-overlay="" data-target="#app-logistics-fleet-sidebar"></i>
              </div>
              <div className="card-body p-0 logistics-fleet-sidebar-body ps">
                <div className="accordion p-2" id="fleet" data-bs-toggle="sidebar" data-overlay="" data-target="#app-logistics-fleet-sidebar" style={{ display: 'flex' }}>
                  {/* Example SpaceInfo instances */}
                  <SpaceInfo Name="VOL-342808" capacity="Chelsea, NY, USA" accordionId="fleet1" />
                  <SpaceInfo Name="VOL-954784" capacity="Lincoln Harbor, NY, USA" accordionId="fleet2" />
                  <SpaceInfo Name="VOL-342808" capacity="Midtown East, NY, USA" accordionId="fleet3" />
                </div>
              </div>
              <div className="ps__rail-x" style={{ left: '0px', bottom: '0px' }}><div className="ps__thumb-x" tabIndex="0" style={{ left: '0px', width: '0px' }}></div></div>
              <div className="ps__rail-y" style={{ top: '0px', right: '0px' }}><div className="ps__thumb-y" tabIndex="0" style={{ top: '0px', height: '0px' }}></div></div>
            </div>
            <div className="app-overlay d-none show"></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Space;