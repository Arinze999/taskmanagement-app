'use client';
import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { useAppSelector } from '@/redux/store';
import { selectTasksByStatus } from '@/redux/slices/tasksSlice';

const Tasks = () => {
  const todo = useAppSelector(selectTasksByStatus('TODO'));

  const doing = useAppSelector(selectTasksByStatus('DOING'));

  const done = useAppSelector(selectTasksByStatus('DONE'));

  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col md:flex-row justify-center  gap-4 my-4">
      <div className="flex-1">
        <h3>TO-DO</h3>
        <div className="flex flex-col gap-3">
          {todo.map((task) => (
            <TaskCard
              {...task}
              key={task.id}
              className="border-2 rounded-md border-red-600/70 bg-red-400/10 p-3"
              onToggle={() => setOpenId(openId === task.id ? null : task.id)}
              open={openId === task.id}
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h3>DOING</h3>
        <div className="flex flex-col gap-3">
          {doing.map((task) => (
            <TaskCard
              {...task}
              key={task.id}
              className="border-2 rounded-md border-blue-600/70 bg-blue-400/10 p-3"
              onToggle={() => setOpenId(openId === task.id ? null : task.id)}
              open={openId === task.id}
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h3>DONE</h3>
        <div className="flex flex-col gap-3">
          {done.map((task) => (
            <TaskCard
              {...task}
              key={task.id}
              className="border-2 rounded-md border-green-600/70 bg-green-400/10 p-3"
              onToggle={() => setOpenId(openId === task.id ? null : task.id)}
              open={openId === task.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
