"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import logoImage from "@/assets/logo.png";
import { getUserStats } from "@/lib/userStats";

function QuizIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={active ? "text-blue-500" : "text-slate-400"}
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="currentColor"
        strokeWidth="1.5"
        fill={active ? "#EFF6FF" : "none"}
      />
      <text
        x="10"
        y="14"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="currentColor"
      >
        ?
      </text>
    </svg>
  );
}

function FlashCardsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={active ? "text-violet-500" : "text-slate-400"}
    >
      <rect
        x="3"
        y="5"
        width="12"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill={active ? "#F5F3FF" : "none"}
      />
      <rect
        x="6"
        y="3"
        width="12"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="white"
      />
    </svg>
  );
}

type NavTab = {
  href: string;
  label: string;
  icon: (active: boolean) => ReactNode;
  activeColor: string;
};

const NAV_TABS: NavTab[] = [
  {
    href: "/",
    label: "Quiz",
    icon: (active) => <QuizIcon active={active} />,
    activeColor: "text-blue-500",
  },
  {
    href: "/flashcards",
    label: "Flash Cards",
    icon: (active) => <FlashCardsIcon active={active} />,
    activeColor: "text-violet-500",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [stats, setStats] = useState({ points: 0, streak: 0 });

  useEffect(() => {
    const userStats = getUserStats();
    setStats({ points: userStats.points, streak: userStats.streak });
  }, [pathname]);

  return (
    <header className="w-full rounded-[24px] bg-white px-4 py-3 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={logoImage}
            alt="English — Learn • Practice • Improve"
            width={52}
            height={52}
            priority
            className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-100 sm:h-12 sm:w-12"
          />
          <div className="hidden min-[420px]:block">
            <p className="text-lg font-extrabold text-slate-800 sm:text-xl">English</p>
            <p className="text-[10px] text-slate-400 sm:text-xs">
              Learn • Practice • Improve
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_TABS.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/" || pathname.startsWith("/quiz")
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex items-center gap-2 pb-2 text-sm font-semibold transition-colors ${
                  isActive ? tab.activeColor : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.icon(isActive)}
                {tab.label}
                {isActive ? (
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full ${
                      tab.href === "/" ? "bg-blue-500" : "bg-violet-500"
                    }`}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1.5 text-sm font-semibold text-orange-500 sm:px-3">
            <span aria-hidden="true">🔥</span>
            <span>{stats.streak}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1.5 text-sm font-semibold text-amber-500 sm:px-3">
            <span aria-hidden="true">⭐</span>
            <span>{stats.points}</span>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white shadow-sm shadow-blue-200 sm:h-10 sm:w-10"
            aria-label="User avatar"
          >
            K
          </div>
        </div>
      </div>

      <nav className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 md:hidden">
        {NAV_TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/" || pathname.startsWith("/quiz")
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex items-center gap-2 pb-2 text-sm font-semibold transition-colors ${
                isActive ? tab.activeColor : "text-slate-400"
              }`}
            >
              {tab.icon(isActive)}
              {tab.label}
              {isActive ? (
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full ${
                    tab.href === "/" ? "bg-blue-500" : "bg-violet-500"
                  }`}
                />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
