import { apiFetch } from "@/lib/api";
import type { PublicUser } from "@/lib/types";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePasswordPage() {
  const { user } = await apiFetch<{ user: PublicUser }>("/auth/me");

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-xl font-bold text-neutral-900">Ganti Password</h1>
      <p className="mb-5 text-sm text-neutral-500">
        Demi keamanan, ganti password default Anda sekarang. Info rekening dipakai supaya orang lain tahu
        ke mana harus bayar hutang ke Anda.
      </p>

      <ChangePasswordForm
        defaultBankName={user.bankName ?? ""}
        defaultBankAccountName={user.bankAccountName ?? ""}
        defaultBankAccountNumber={user.bankAccountNumber ?? ""}
      />
    </div>
  );
}
