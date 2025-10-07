'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import type { SigninData } from '@/schemas/auth/signin.schema';
import { signInAction } from '@/actions/signInAction';
import { setUser } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';
import { DASHBOARD } from '@/routes/routes';

type UseServerSignInOptions = {
  redirectTo?: string;
  silent?: boolean;
};

export function useServerSignIn(opts: UseServerSignInOptions = {}) {
  const [serving, setServing] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const signIn = useCallback(
    async (values: SigninData) => {
      setServing(true);
      try {
        const res = await signInAction(values);

        if (!res.ok) {
          if (!opts.silent)
            toast.error(res.message || 'Sign in failed.', { autoClose: 5000 });
          return;
        }

        // hydrate Redux (safe user payload from server action)
        if (res.user) dispatch(setUser(res.user));

        if (!opts.silent)
          toast.success(res.message || 'Signed in successfully.', {
            autoClose: 3000,
          });

        //navigate
        router.refresh();
        router.replace(`${opts.redirectTo ?? DASHBOARD}`);
      } catch (err: any) {
        if (!opts.silent)
          toast.error(err?.message ?? 'Something went wrong', {
            autoClose: 6000,
          });
      } finally {
        setServing(false);
      }
    },
    [dispatch, router, opts.redirectTo, opts.silent]
  );

  return { signIn, serving };
}
