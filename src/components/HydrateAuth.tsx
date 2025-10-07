'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/authSlice';
import { AuthUser } from '@/schemas/auth/signin.schema';

export default function HydrateAuth({ user }: { user: AuthUser }) {
  const dispatch = useDispatch();

  console.log('user:', user)

  useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);
  return null;
}
