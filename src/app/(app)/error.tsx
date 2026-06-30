"use client";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="font-medium text-red-800">Terjadi kesalahan</p>
      <p className="text-sm text-red-700">{error.message || "Silakan coba lagi."}</p>
      <button
        onClick={reset}
        className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
      >
        Coba Lagi
      </button>
    </div>
  );
}
