import { PottedPlant } from "@/components/illustrations";

export default function FooterQuote() {
  return (
    <footer className="rounded-[24px] bg-white px-5 py-4 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-100 sm:px-6 sm:py-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="shrink-0 text-3xl font-serif leading-none text-blue-400" aria-hidden="true">
            &ldquo;
          </span>
          <p className="text-sm italic text-slate-500 sm:text-base">
            The beautiful thing about learning is that no one can take it away from you.
            <span className="not-italic font-medium text-slate-400"> — B.B. King</span>
          </p>
        </div>
        <PottedPlant className="hidden shrink-0 sm:block" />
      </div>
    </footer>
  );
}
