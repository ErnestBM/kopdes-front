"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "./api";

export interface CreateDebtState {
  error?: string;
}

export async function createDebtAction(
  _prevState: CreateDebtState,
  formData: FormData
): Promise<CreateDebtState> {
  const debtorId = String(formData.get("debtorId") ?? "");
  const amountRaw = String(formData.get("amount") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const amount = Number(amountRaw);

  if (!debtorId || !title || !date || !Number.isFinite(amount) || amount <= 0) {
    return { error: "Lengkapi semua field dengan benar" };
  }

  try {
    await apiFetch("/debts", {
      method: "POST",
      body: JSON.stringify({ debtorId, amount: Math.round(amount), title, date }),
    });
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.message };
    }
    throw e;
  }

  revalidatePath("/");
  redirect(`/debts/${debtorId}`);
}

async function transition(recordId: string, counterpartyId: string, path: string) {
  await apiFetch(`/debts/${recordId}/${path}`, { method: "POST" });
  revalidatePath("/");
  revalidatePath(`/debts/${counterpartyId}`);
}

export async function approveDebtAction(recordId: string, counterpartyId: string) {
  await transition(recordId, counterpartyId, "approve");
}

export async function rejectDebtAction(recordId: string, counterpartyId: string) {
  await transition(recordId, counterpartyId, "reject");
}

export async function confirmPaymentAction(recordId: string, counterpartyId: string) {
  await transition(recordId, counterpartyId, "confirm-payment");
}

export async function approvePaymentAction(recordId: string, counterpartyId: string) {
  await transition(recordId, counterpartyId, "approve-payment");
}

export async function rejectPaymentAction(recordId: string, counterpartyId: string) {
  await transition(recordId, counterpartyId, "reject-payment");
}
