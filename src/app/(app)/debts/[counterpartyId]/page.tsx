import { apiFetch } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { formatRupiah, formatDate } from "@/lib/format";
import type { DebtRecord, SimpleUser } from "@/lib/types";
import {
  approveDebtAction,
  rejectDebtAction,
  confirmPaymentAction,
  approvePaymentAction,
  rejectPaymentAction,
} from "@/lib/debt-actions";

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

export default async function CounterpartyDetailPage({
  params,
}: {
  params: Promise<{ counterpartyId: string }>;
}) {
  const { counterpartyId } = await params;
  const [{ counterparty, records }, me] = await Promise.all([
    apiFetch<{ counterparty: SimpleUser; records: DebtRecord[] }>(`/debts/${counterpartyId}`),
    getSessionUser(),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-neutral-900">{counterparty.name}</h1>
      <p className="mb-5 text-sm text-neutral-500">Riwayat hutang piutang dengan {counterparty.name}</p>

      {records.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
          Belum ada catatan.
        </p>
      ) : (
        <div className="space-y-3">
          {records.map((r) => {
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

                {r.status === "ACTIVE" && !iAmCreditor && (
                  <div className="mt-3">
                    <form action={confirmPaymentAction.bind(null, r.id, counterpartyId)}>
                      <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                        Konfirmasi Sudah Bayar
                      </button>
                    </form>
                  </div>
                )}

                {r.status === "PENDING_PAYMENT_APPROVAL" && iAmCreditor && (
                  <div className="mt-3 flex gap-2">
                    <form action={approvePaymentAction.bind(null, r.id, counterpartyId)}>
                      <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                        Setujui Pembayaran
                      </button>
                    </form>
                    <form action={rejectPaymentAction.bind(null, r.id, counterpartyId)}>
                      <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700">
                        Belum Diterima
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
