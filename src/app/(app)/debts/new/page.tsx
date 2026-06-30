import { apiFetch } from "@/lib/api";
import type { SimpleUser } from "@/lib/types";
import NewDebtForm from "./NewDebtForm";

export default async function NewDebtPage() {
  const { users } = await apiFetch<{ users: SimpleUser[] }>("/users");

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-neutral-900">Catat Hutang Baru</h1>
      <p className="mb-4 text-sm text-neutral-500">
        Anda akan tercatat sebagai pemberi pinjaman. Orang yang dipilih perlu menyetujui catatan ini.
      </p>
      <NewDebtForm users={users} />
    </div>
  );
}
