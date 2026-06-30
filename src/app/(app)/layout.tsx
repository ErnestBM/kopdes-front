import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { logoutAction } from "./session-actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold text-neutral-900">
            Kopdes
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-500">{user?.name}</span>
            <form action={logoutAction}>
              <button type="submit" className="font-medium text-neutral-600 underline-offset-2 hover:underline">
                Keluar
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-2xl gap-4 overflow-x-auto px-4 pb-3 text-sm font-medium text-neutral-600">
          <Link href="/" className="whitespace-nowrap hover:text-neutral-900">
            Ringkasan
          </Link>
          <Link href="/debts/new" className="whitespace-nowrap hover:text-neutral-900">
            + Catat Hutang
          </Link>
          {user?.role === "ADMIN" && (
            <Link href="/admin/users" className="whitespace-nowrap hover:text-neutral-900">
              Kelola User
            </Link>
          )}
          <Link href="/change-password" className="whitespace-nowrap hover:text-neutral-900">
            Ganti Password
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
