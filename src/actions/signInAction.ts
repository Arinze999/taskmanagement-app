'use server';

import { createClient } from '@/utils/supabase/server';
import { SigninData } from '@/schemas/auth/signin.schema';

export async function signInAction(input: SigninData) {
  try {
    const supabase = await createClient();

    const usingEmail = input.email.includes('@');
    const creds = usingEmail
      ? { email: input.email }
      : { phone: normalizePhone(input.email) };

    const { data, error } = await supabase.auth.signInWithPassword({
      ...creds,
      password: input.password,
    });

    console.log(data);

    if (error) {
      return { ok: false, message: error.message };
    }
                                                                                 
    // SAFE user payload
    const u = data.user;
    const user = {
      id: u?.id ?? null,
      email: u?.email ?? null,
    };

    return { ok: true, message: 'Signed in successfully.', user };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? 'Unknown error' };
  }
}

function normalizePhone(raw: string) {
  const trimmed = raw.replace(/\s+/g, '');
  if (trimmed.startsWith('+')) return trimmed;
  return `+${trimmed}`;
}
