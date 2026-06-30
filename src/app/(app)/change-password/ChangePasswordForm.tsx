"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = {};

export default function ChangePasswordForm({
  defaultBankName,
  defaultBankAccountName,
  defaultBankAccountNumber,
}: {
  defaultBankName: string;
  defaultBankAccountName: string;
  defaultBankAccountNumber: string;
}) {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
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
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
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
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
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
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div className="border-t border-neutral-200 pt-4">
        <p className="mb-3 text-sm font-medium text-neutral-700">Info rekening (untuk menerima pembayaran)</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="bankName" className="mb-1 block text-sm font-medium text-neutral-700">
              Nama bank
            </label>
            <input
              id="bankName"
              name="bankName"
              type="text"
              placeholder="cth. BCA"
              defaultValue={defaultBankName}
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="bankAccountName" className="mb-1 block text-sm font-medium text-neutral-700">
              Nama pemilik rekening
            </label>
            <input
              id="bankAccountName"
              name="bankAccountName"
              type="text"
              defaultValue={defaultBankAccountName}
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="bankAccountNumber" className="mb-1 block text-sm font-medium text-neutral-700">
              Nomor rekening
            </label>
            <input
              id="bankAccountNumber"
              name="bankAccountNumber"
              type="text"
              inputMode="numeric"
              defaultValue={defaultBankAccountNumber}
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-base font-medium text-white disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
