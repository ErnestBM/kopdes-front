import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { formatRupiah, formatDate } from "@/lib/format";
import type { DebtSummaryResponse } from "@/lib/types";
import {
  approveDebtAction,
  rejectDebtAction,
  approvePaymentAction,
  rejectPaymentAction,
} from "@/lib/debt-actions";

export default async function DashboardPage() {
  const { summary, inbox } = await apiFetch<DebtSummaryResponse>("/debts/summary");

  const hasInbox = inbox.pendingApprovals.length > 0 || inbox.pendingPaymentApprovals.length > 0;

  return (
    <div className="space-y-8">
      {hasInbox && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Perlu tindakan Anda
          </h2>
          <div className="space-y-3">
            {inbox.pendingApprovals.map((item) => (
              <div key={item.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold text-neutral-900">{item.creditor?.name}</span> mencatat
                  Anda berutang
                </p>
                <p className="mt-1 text-lg font-bold text-neutral-900">{formatRupiah(item.amount)}</p>
                <p className="text-sm text-neutral-600">
                  {item.title} &middot; {formatDate(item.date)}
                </p>
                <div className="mt-3 flex gap-2">
                  <form action={approveDebtAction.bind(null, item.id, item.creditor!.id)}>
                    <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                      Setujui
                    </button>
                  </form>
                  <form action={rejectDebtAction.bind(null, item.id, item.creditor!.id)}>
                    <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700">
                      Tolak
                    </button>
                  </form>
                </div>
              </div>
            ))}

            {inbox.pendingPaymentApprovals.map((item) => (
              <div key={item.id} className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold text-neutral-900">{item.debtor?.name}</span> konfirmasi
                  sudah membayar
                </p>
                <p className="mt-1 text-lg font-bold text-neutral-900">{formatRupiah(item.amount)}</p>
                <p className="text-sm text-neutral-600">
                  {item.title} &middot; {formatDate(item.date)}
                </p>
                <div className="mt-3 flex gap-2">
                  <form action={approvePaymentAction.bind(null, item.id, item.debtor!.id)}>
                    <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                      Setujui Pembayaran
                    </button>
                  </form>
                  <form action={rejectPaymentAction.bind(null, item.id, item.debtor!.id)}>
                    <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700">
                      Belum Diterima
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Posisi Anda
        </h2>

        {summary.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
            Belum ada catatan hutang piutang.
          </p>
        ) : (
          <div className="space-y-2">
            {summary.map((s) => (
              <Link
                key={s.counterpartyId}
                href={`/debts/${s.counterpartyId}`}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300"
              >
                <span className="font-medium text-neutral-900">{s.counterpartyName}</span>
                {s.net === 0 ? (
                  <span className="text-sm text-neutral-500">Lunas</span>
                ) : s.net > 0 ? (
                  <span className="font-semibold text-emerald-600">
                    Piutang {formatRupiah(s.net)}
                  </span>
                ) : (
                  <span className="font-semibold text-rose-600">Hutang {formatRupiah(-s.net)}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
