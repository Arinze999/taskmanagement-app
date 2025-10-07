'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SignupData } from '@/schemas/auth/signup.schema';
import { signUpAction } from '@/actions/signUpAction';
import { SIGNIN } from '@/routes/routes';
import { toast } from 'react-toastify';

type UseServerSignUpOptions = {
  redirectTo?: string;
  silent?: boolean;
};

export function useServerSignUp(opts: UseServerSignUpOptions = {}) {
  const [serving, setServing] = useState(false);
  const router = useRouter();

  const signUp = useCallback(
    async (values: SignupData) => {
      setServing(true);
      try {
        const res = await signUpAction(values);

        if (!res.ok) {
          if (!opts.silent) {
            toast.error(res.message || 'Sign up failed.', { autoClose: 6000 });
          }
          return;
        }

        if (!opts.silent) {
          toast.success(
            res.message || 'Account created, Redirecting to Login Page.',
            {
              autoClose: 3000,
            }
          );
        }

        // Navigate
        router.refresh();
        router.replace(`/${opts.redirectTo ?? SIGNIN}`);
      } catch (err: any) {
        if (!opts.silent) {
          toast.error(err?.message ?? 'Something went wrong', {
            autoClose: 6000,
          });
        }
      } finally {
        setServing(false);
      }
    },
    [router, opts.redirectTo, opts.silent]
  );

  return { signUp, serving };
}
