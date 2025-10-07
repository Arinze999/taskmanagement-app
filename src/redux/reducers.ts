import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/tasksSlice';

const appReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
