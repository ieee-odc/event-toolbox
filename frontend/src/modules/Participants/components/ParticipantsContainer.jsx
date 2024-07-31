import React, { useState } from 'react'
import ParticipantsCard from './ParticipantsCard'

function ParticipantsContainer() {

  return (
    <div className="flex-grow-1" style={{padding:"0 !important"}}>
          {/* Invoice List Widget */}
          <div className="card mb-4">
            <div className="card-widget-separator-wrapper">
              <div className="card-body card-widget-separator">
                <div className="row gy-4 gy-sm-1">
                  <div className="col-sm-6 col-lg-3">
                    <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                      <div>
                        <h3 className="mb-1">24</h3>
                        <p className="mb-0">Clients</p>
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
                        <h3 className="mb-1">165</h3>
                        <p className="mb-0">Invoices</p>
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
                  <div className="col-sm-6 col-lg-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h3 className="mb-1">$876</h3>
                        <p className="mb-0">Unpaid</p>
                      </div>
                      <div className="avatar">
                        <span className="avatar-initial rounded bg-label-secondary">
                          <i className="bx bx-error-circle bx-sm" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Invoice List Table */}
          <ParticipantsCard/>
        </div>
  )
}

export default ParticipantsContainer