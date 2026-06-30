"use client";

import { useActionState } from "react";
import { createDebtAction, type CreateDebtState } from "@/lib/debt-actions";
import type { SimpleUser } from "@/lib/types";

const initialState: CreateDebtState = {};

export default function NewDebtForm({ users }: { users: SimpleUser[] }) {
  const [state, formAction, pending] = useActionState(createDebtAction, initialState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div>
        <label htmlFor="debtorId" className="mb-1 block text-sm font-medium text-neutral-700">
          Siapa yang berutang ke Anda?
        </label>
        <select
          id="debtorId"
          name="debtorId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
        >
          <option value="" disabled>
            Pilih orang
          </option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-neutral-700">
          Jumlah (Rp)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-neutral-700">
          Untuk apa
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="cth. Pinjam buat makan"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium text-neutral-700">
          Tanggal
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={today}
          className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-base font-medium text-white disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Catat Hutang"}
      </button>
    </form>
  );
}
