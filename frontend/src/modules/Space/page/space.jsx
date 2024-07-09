import React from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import DashboardLayout from '../../../core/components/DashboardLayout/DashboardLayout';
import SpaceInfo from '../component/spaceContainer'; // Assuming this imports your SpaceInfo component

const Space = () => {
  const handleAddSpace = async () => {
    const orgId = "66867772bf26448f9611c07c"; // Replace with actual organization ID or fetch dynamically
    const spaceData = {
      name: 'New Space', // Example name, replace with actual data
      capacity: 7, // Example capacity, replace with actual data
    };

    try {
      // Make POST request to create space
      const response = await axios.post(`http://localhost:6001/space/create/${orgId}`, spaceData);

      // Handle successful response (optional)
      console.log('Space created:', response.data);

      // Optionally, you can navigate or update state upon successful creation
      // Example: reload or update space list
    } catch (error) {
      // Handle error
      console.error('Error creating space:', error);
      // Optionally, handle error state or display error message
    }
  };

  return (
    <DashboardLayout>
      <div className="container-xxl flex-grow-1 container-p-y">
      <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-primary" onClick={handleAddSpace}>Add Space</button>
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
                  <SpaceInfo Name="VOL-342808" location="Midtown East, NY, USA" accordionId="fleet3" />
                  <SpaceInfo Name="VOL-343908" location="Hoboken, NY, USA" accordionId="fleet4" />
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