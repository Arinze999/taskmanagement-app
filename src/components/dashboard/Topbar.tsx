'use client';
import React from 'react';
import SignOutButton from '../buttons/SignOutButton';
import { useAppSelector } from '@/redux/store';
import { selectAuth } from '@/redux/slices/authSlice';

const Topbar = () => {
  const auth = useAppSelector(selectAuth);

  return (
    <div className="border-b-2 border-b-gray-400 sticky z-5 top-0 py-3 flex-between bg-white">
      <div>
        {auth?.email ?? 'no user logged in'} <SignOutButton />
      </div>
    </div>
  );
};

export default Topbar;
