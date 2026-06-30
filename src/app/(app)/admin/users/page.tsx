import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { AdminUser } from "@/lib/types";
import AddUserForm from "./AddUserForm";

export default async function AdminUsersPage() {
  const { users } = await apiFetch<{ users: AdminUser[] }>("/admin/users");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-xl font-bold text-neutral-900">Tambah User</h1>
        <AddUserForm />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Daftar User
        </h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4"
            >
              <div>
                <p className="font-medium text-neutral-900">
                  {u.name} <span className="text-sm font-normal text-neutral-500">@{u.username}</span>
                </p>
                <p className="text-xs text-neutral-500">
                  {u.role === "ADMIN" ? "Admin" : "User"} &middot; bergabung {formatDate(u.createdAt)}
                </p>
              </div>
              {u.mustChangePassword && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                  Belum ganti password
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
