"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";
import type { Role } from "@/lib/types";

export interface AddUserState {
  error?: string;
  successMessage?: string;
}

export async function addUserAction(
  _prevState: AddUserState,
  formData: FormData
): Promise<AddUserState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "USER") as Role;

  if (!username || !name) {
    return { error: "Lengkapi semua field" };
  }

  try {
    const data = await apiFetch<{ defaultPassword: string }>("/admin/users", {
      method: "POST",
      body: JSON.stringify({ username, name, role }),
    });
    revalidatePath("/admin/users");
    return {
      successMessage: `User "${username}" dibuat. Password awal: ${data.defaultPassword} (wajib diganti saat login pertama).`,
    };
  } catch (e) {
    if (e instanceof ApiError) {
      return { error: e.message };
    }
    throw e;
  }
}
