import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosRequest from '../../../utils/AxiosConfig';
import { UserData } from '../../../utils/UserData';
import { initializeSpaces, selectSpace, setSelectedSpace, toggleSpaceModal } from '../../../core/Features/Spaces';
import SpaceModal from './SpaceModal';

function SpaceContainer() {
    const dispatch = useDispatch();
    const { spaces, isLoading } = useSelector((store) => store.spacesStore)
    const userData = UserData();

    useEffect(() => {
        axiosRequest.get(`/space/get-organizer/${userData.id}`).then((res) => {
            dispatch(initializeSpaces(res.data.spaces))
        })
    }, [])

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={() => {
                    dispatch(toggleSpaceModal())
                }}>Add Space</button>
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
                        <div className="accordion p-2" id="fleet" data-bs-toggle="sidebar" data-overlay="" data-target="#app-logistics-fleet-sidebar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
    {
        spaces.map(space => (
            <div key={space.id} role="button" className="accordion-button shadow-none collapsed" data-bs-toggle="collapse" aria-expanded="false" onClick={() => {
                dispatch(selectSpace(space))
                dispatch(toggleSpaceModal());
            }}>
                <div className="d-flex align-items-center">
                    <div className="avatar-wrapper">
                        <div className="avatar me-3">
                            <span className="avatar-initial rounded-circle bg-label-secondary"><i className="bx bxs-truck"></i></span>
                        </div>
                    </div>
                    <span className="d-flex flex-column">
                        <span className="h6 mb-0">{space.name}</span>
                        <span className="text-muted">{space.capacity}</span>
                    </span>
                </div>
            </div>
        ))
    }
</div>

                        </div>
                        <div className="ps__rail-x" style={{ left: '0px', bottom: '0px' }}><div className="ps__thumb-x" tabIndex="0" style={{ left: '0px', width: '0px' }}></div></div>
                        <div className="ps__rail-y" style={{ top: '0px', right: '0px' }}><div className="ps__thumb-y" tabIndex="0" style={{ top: '0px', height: '0px' }}></div></div>
                    </div>
                    <div className="app-overlay d-none show"></div>
                </div>
            </div>
            <SpaceModal />

        </div>
    )
}

export default SpaceContainer