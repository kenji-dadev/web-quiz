import { BooksHeroIllustration } from "@/components/illustrations";

export default function WelcomeHero() {
  return (
    <section className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-[1.75rem] font-extrabold tracking-tight text-slate-800 sm:text-4xl">
          Welcome back, Kenji!{" "}
          <span aria-hidden="true" className="inline-block animate-wave">
            👋
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Let&apos;s improve your English every day.
        </p>
      </div>
      <BooksHeroIllustration className="hidden shrink-0 sm:block" />
    </section>
  );
}
