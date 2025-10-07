'use client';

import { SIGNOUT } from '@/routes/routes';

export default function SignOutButton() {
  return (
    <form action={`/${SIGNOUT}`} method="post">
      <button
        type="submit"
        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 text-sm md:text-[16px] cursor-pointer"
      >
        Sign out
      </button>
    </form>
  );
}
