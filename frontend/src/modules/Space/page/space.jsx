import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../core/components/DashboardLayout/DashboardLayout';
import SpaceInfo from '../component/spaceContainer'; // Assuming this imports your SpaceInfo component
import SpaceModal from '../component/spaceMoal';

function Space() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgId, setOrgId] = useState(''); // State to hold dynamic orgId
  const [spaces, setSpaces] = useState([]); // State to hold spaces
  const [isFetching, setIsFetching] = useState(false); // State to indicate fetching

  // Function to handle opening and closing modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    
  };

  // Example function to get orgId dynamically
  const fetchOrgId = () => {
    // Implement logic to fetch orgId dynamically
    const fetchedOrgId = '66867772bf26448f9611c07c';
    setOrgId(fetchedOrgId);
  };

  // Function to fetch spaces by orgId
  const fetchSpaces = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`http://localhost:6001/space/${orgId}`);
      setSpaces(response.data);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch spaces when orgId changes
  useEffect(() => {
    if (orgId) {
      fetchSpaces();
    }
  }, [orgId]);

  // Fetch orgId on component mount
  useEffect(() => {
    fetchOrgId();
  }, []);

  // Function to handle space creation success or update
  const handleSpaceCreatedOrUpdated = () => {
    fetchSpaces(); // Refresh the space list
    setIsModalOpen(false); // Close the modal after creation/update
    window.location.reload(); // Reload the page after space creation

  };

  return (
    <DashboardLayout>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-primary" onClick={toggleModal}>Add Space</button>
          <SpaceModal
            isOpen={isModalOpen}
            toggleModal={toggleModal}
            orgId={orgId}
            onSpaceCreated={handleSpaceCreatedOrUpdated}
          />
        </div>
        <div className="card overflow-hidden">
          <div className="d-flex app-logistics-fleet-wrapper">
            <div className="flex-shrink-0 position-fixed m-4 d-md-none w-auto z-1">
              <button className="btn btn-label-white border border-2 z-2 p-2" data-bs-toggle="sidebar" data-overlay="" data-target="#app-logistics-fleet-sidebar">
                <i className="bx bx-menu"></i>
              </button>
            </div>
            <div className="app-logistics-fleet-sidebar col h-100 show" id="app-logistics-fleet-sidebar">
              <div className="card-header border-0 pt-4 pb-2 d-flex justify-content-between">
                <h5 className="mb-0 card-title">Spaces</h5>
                <i className="bx bx-x bx-sm cursor-pointer close-sidebar d-md-none" data-bs-toggle="sidebar" data-overlay="" data-target="#app-logistics-fleet-sidebar"></i>
              </div>
              <div className="card-body p-0 logistics-fleet-sidebar-body ps">
                <div className="accordion p-2" id="fleet" data-bs-toggle="sidebar" data-overlay="" data-target="#app-logistics-fleet-sidebar" style={{ display: 'flex' }}>
                  {isFetching ? (
                    <p>Loading spaces...</p>
                  ) : (
                    spaces.map(space => (
                      <SpaceInfo key={space._id} name={space.name} capacity={space.capacity} spaceId={space._id} />
                    ))
                  )}
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
}

export default Space;