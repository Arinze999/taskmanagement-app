import TaskCenter from '@/components/dashboard/TaskCenter';
import Topbar from '@/components/dashboard/Topbar';
import { EditTaskProvider } from '@/context/EditTaskContext';
import React from 'react';

const Dashboard = () => {
  return (
    <div className="default-margin">
      <Topbar />
      <EditTaskProvider>
        {' '}
        <TaskCenter />
      </EditTaskProvider>
    </div>
  );
};

export default Dashboard;
