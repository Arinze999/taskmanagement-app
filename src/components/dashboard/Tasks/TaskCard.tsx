import React from 'react';
import { Task } from '@/redux/slices/tasksSlice';

interface TaskCardProps extends Task {
  className?: string;
  open: boolean;
  onToggle: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  className,
  open,
  onToggle,
  id,
}) => {
  return (
    <div className={`${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-sm font-medium">{title}</span>

        {/* Chevron */}
        <svg
          className={`h-5 w-5 transform transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" />
        </svg>
      </button>

      {/* Animated answer: height + opacity + slight rise */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        aria-hidden={!open}
      >
        <div id={id} className="overflow-hidden pr-1">
          <p
            className={`mt-3 text-xs leading-6 text-gray-700 transition-all duration-300 ${
              open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
