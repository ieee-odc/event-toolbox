import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function HeaderStats() {
    const { events, totalWorkshops, totalParticipants, currentParticipants } = useSelector((state) => state.statsStore);

    return (
        <div className="card mb-4">
            <div className="card-widget-separator-wrapper">
                <div className="card-body card-widget-separator">
                    <div className="row gy-4 gy-sm-1">
                        <div className="col-sm-6 col-lg-3">
                            <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                                <div>
                                    <h3 className="mb-1">{events.length}</h3>
                                    <p className="mb-0">Events</p>
                                </div>
                                <div className="avatar me-sm-4">
                                    <span className="avatar-initial rounded bg-label-secondary">
                                        <i className="bx bx-user bx-sm" />
                                    </span>
                                </div>
                            </div>
                            <hr className="d-none d-sm-block d-lg-none me-4" />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                                <div>
                                    <h3 className="mb-1">{totalWorkshops}</h3>
                                    <p className="mb-0">Workshops</p>
                                </div>
                                <div className="avatar me-sm-4">
                                    <span className="avatar-initial rounded bg-label-secondary">
                                        <i className="bx bx-user bx-sm" />
                                    </span>
                                </div>
                            </div>
                            <hr className="d-none d-sm-block d-lg-none me-4" />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <div className="d-flex justify-content-between align-items-start card-widget-2 border-end pb-3 pb-sm-0">
                                <div>
                                    <h3 className="mb-1">{currentParticipants}</h3>
                                    <p className="mb-0">Current Participants</p>
                                </div>
                                <div className="avatar me-lg-4">
                                    <span className="avatar-initial rounded bg-label-secondary">
                                        <i className="bx bx-file bx-sm" />
                                    </span>
                                </div>
                            </div>
                            <hr className="d-none d-sm-block d-lg-none" />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <div className="d-flex justify-content-between align-items-start border-end pb-3 pb-sm-0 card-widget-3">
                                <div>
                                    <h3 className="mb-1">$2.46k</h3>
                                    <p className="mb-0">Paid</p>
                                </div>
                                <div className="avatar me-sm-4">
                                    <span className="avatar-initial rounded bg-label-secondary">
                                        <i className="bx bx-check-double bx-sm" />
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
