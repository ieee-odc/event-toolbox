import React, { useState } from 'react'
import DashboardLayout from '../../../core/components/DashboardLayout/DashboardLayout'
import WorkshopsContainer from '../components/WorkshopsContainer'

function Workshops() {


  return (
    <DashboardLayout activeTab="/workshops">
  <WorkshopsContainer />
</DashboardLayout>
  )
}

export default Workshops
