import { Suspense } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-display text-3xl font-semibold text-primary">
            CD
          </a>
          <div className="font-body text-xs tracking-[0.2em] text-dark/50 mt-1">CLICK DECORA</div>
        </div>
        <Suspense fallback={null}>{children}</Suspense>
      </div>
    </div>
  );
}
