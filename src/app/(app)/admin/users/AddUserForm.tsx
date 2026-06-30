"use client";

import { useActionState } from "react";
import { addUserAction, type AddUserState } from "./actions";

const initialState: AddUserState = {};

export default function AddUserForm() {
  const [state, formAction, pending] = useActionState(addUserAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-700">
          Nama
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-neutral-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoCapitalize="off"
          pattern="[a-z0-9]+"
          title="Huruf kecil dan angka saja, tanpa spasi"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-neutral-500">Password awal otomatis: username + &quot;123&quot;</p>
      </div>

      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-neutral-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="USER"
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state.successMessage && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.successMessage}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-base font-medium text-white disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Tambah User"}
      </button>
    </form>
  );
}
