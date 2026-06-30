"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = {};

export default function ChangePasswordPage() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-xl font-bold text-neutral-900">Ganti Password</h1>
      <p className="mb-5 text-sm text-neutral-500">
        Demi keamanan, ganti password default Anda sekarang.
      </p>

      <form action={formAction} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
        <div>
          <label htmlFor="oldPassword" className="mb-1 block text-sm font-medium text-neutral-700">
            Password saat ini
          </label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-neutral-700">
            Password baru
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-neutral-700">
            Ulangi password baru
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:border-neutral-500 focus:outline-none"
          />
        </div>

        {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-base font-medium text-white disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </form>
    </div>
  );
}
