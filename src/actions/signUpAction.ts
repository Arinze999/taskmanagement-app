'use server';

import { createClient } from '@/utils/supabase/server';

export async function signUpAction(input: {
  email: string;
  password: string;
  avatarUrl?: string;
}) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          email: input.email || undefined,
          avatar_url: input.avatarUrl || undefined,
        },
      },
    });

    if (error) {
      return { ok: false, status: 400, message: error.message };
    }

    const user = data?.user as any;
    const identitiesLen = Array.isArray(user?.identities)
      ? user.identities.length
      : 0;

    // Duplicate: Supabase may return a "user" with empty identities when already registered
    if (user && identitiesLen === 0) {
      return {
        ok: false,
        status: 409,
        message: 'This email is already registered.',
      };
    }

    if (user) {
      await supabase.auth.signOut();
    }

    return {
      ok: true,
      status: 201,
      message: 'Account created.',
    };
  } catch (e: any) {
    return { ok: false, status: 500, message: e?.message ?? 'Unknown error' };
  }
}
