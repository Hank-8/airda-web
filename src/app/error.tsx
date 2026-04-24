"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">發生錯誤</h2>
        <p className="text-sm text-text-secondary">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue-light transition-all"
        >
          重新載入
        </button>
      </div>
    </div>
  );
}
