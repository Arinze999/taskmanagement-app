import TaskCenter from '@/components/dashboard/TaskCenter';
import Topbar from '@/components/dashboard/Topbar';
import React from 'react';

const Dashboard = () => {

  return (
    <div className="default-margin">
      <Topbar/>
      <TaskCenter/>
    </div>
  );
};

export default Dashboard;
