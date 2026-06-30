import { apiFetch } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { formatRupiah, formatDate } from "@/lib/format";
import type { DebtRecord, CounterpartyProfile } from "@/lib/types";
import {
  approveDebtAction,
  rejectDebtAction,
  confirmPaymentAction,
  approvePaymentAction,
  rejectPaymentAction,
} from "@/lib/debt-actions";
import CopyButton from "@/components/CopyButton";

const STATUS_LABEL: Record<DebtRecord["status"], string> = {
  PENDING_APPROVAL: "Menunggu persetujuan",
  ACTIVE: "Aktif",
  REJECTED: "Ditolak",
  PENDING_PAYMENT_APPROVAL: "Menunggu konfirmasi pembayaran",
  SETTLED: "Lunas",
};

const STATUS_STYLE: Record<DebtRecord["status"], string> = {
  PENDING_APPROVAL: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-sky-100 text-sky-800",
  REJECTED: "bg-neutral-200 text-neutral-600",
  PENDING_PAYMENT_APPROVAL: "bg-violet-100 text-violet-800",
  SETTLED: "bg-emerald-100 text-emerald-800",
};

const OUTSTANDING = new Set<DebtRecord["status"]>(["ACTIVE", "PENDING_PAYMENT_APPROVAL"]);

export default async function CounterpartyDetailPage({
  params,
}: {
  params: Promise<{ counterpartyId: string }>;
}) {
  const { counterpartyId } = await params;
  const [{ counterparty, records }, me] = await Promise.all([
    apiFetch<{ counterparty: CounterpartyProfile; records: DebtRecord[] }>(`/debts/${counterpartyId}`),
    getSessionUser(),
  ]);

  // Net is computed across ALL outstanding records, not per-record -- if I owe
  // 2 and they owe me 1, only the net 1 needs to actually change hands, and
  // settling it closes both records together. See backend getNetWithCounterparty.
  let net = 0;
  let hasPendingPayment = false;
  for (const r of records) {
    if (!OUTSTANDING.has(r.status)) continue;
    net += r.creditorId === me?.id ? r.amount : -r.amount;
    if (r.status === "PENDING_PAYMENT_APPROVAL") hasPendingPayment = true;
  }

  const visibleRecords = records.filter((r) => r.status !== "SETTLED");

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-neutral-900">{counterparty.name}</h1>
      <p className="mb-5 text-sm text-neutral-500">Riwayat hutang piutang dengan {counterparty.name}</p>

      {net !== 0 && (
        <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-sm text-neutral-500">
            {net < 0 ? `Saldo bersih: Anda berutang ke ${counterparty.name}` : `Saldo bersih: ${counterparty.name} berutang ke Anda`}
          </p>
          <p className="mt-0.5 text-xl font-bold text-neutral-900">{formatRupiah(Math.abs(net))}</p>

          {net < 0 && (
            <div className="mt-3 rounded-lg bg-neutral-50 p-3">
              {counterparty.bankAccountNumber && counterparty.bankName && counterparty.bankAccountName ? (
                <>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Rekening tujuan
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {counterparty.bankName} &middot; a.n. {counterparty.bankAccountName}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="font-mono text-sm font-semibold text-neutral-900">
                      {counterparty.bankAccountNumber}
                    </p>
                    <CopyButton text={counterparty.bankAccountNumber} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-500">
                  {counterparty.name} belum mengisi info rekening.
                </p>
              )}
            </div>
          )}

          {net < 0 && !hasPendingPayment && (
            <form action={confirmPaymentAction.bind(null, counterpartyId)} className="mt-3">
              <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                Konfirmasi Sudah Bayar
              </button>
            </form>
          )}
          {net < 0 && hasPendingPayment && (
            <p className="mt-3 text-sm text-neutral-500">Menunggu konfirmasi dari {counterparty.name}.</p>
          )}
          {net > 0 && hasPendingPayment && (
            <div className="mt-3 flex gap-2">
              <form action={approvePaymentAction.bind(null, counterpartyId)}>
                <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                  Setujui Pembayaran
                </button>
              </form>
              <form action={rejectPaymentAction.bind(null, counterpartyId)}>
                <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700">
                  Belum Diterima
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {visibleRecords.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
          {records.length === 0 ? "Belum ada catatan." : "Tidak ada hutang aktif (semua sudah lunas)."}
        </p>
      ) : (
        <div className="space-y-3">
          {visibleRecords.map((r) => {
            const iAmCreditor = r.creditorId === me?.id;
            return (
              <div key={r.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-neutral-500">
                      {iAmCreditor ? `Anda meminjamkan ke ${counterparty.name}` : `Anda meminjam dari ${counterparty.name}`}
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-neutral-900">{formatRupiah(r.amount)}</p>
                    <p className="text-sm text-neutral-600">
                      {r.title} &middot; {formatDate(r.date)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>

                {r.status === "PENDING_APPROVAL" && !iAmCreditor && (
                  <div className="mt-3 flex gap-2">
                    <form action={approveDebtAction.bind(null, r.id, counterpartyId)}>
                      <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                        Setujui
                      </button>
                    </form>
                    <form action={rejectDebtAction.bind(null, r.id, counterpartyId)}>
                      <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700">
                        Tolak
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
