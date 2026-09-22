"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { List, X } from "@phosphor-icons/react/ssr";
import { navKeys, navHrefs, profile } from "@/lib/data";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Nav() {
  const t = useTranslations("nav");
  const tTheme = useTranslations("theme");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const trigger = ScrollTrigger.create({
      start: 72,
      end: "max",
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => trigger.kill();
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "border-line bg-ink-raised/95 px-4 py-2.5 shadow-lg shadow-black/30"
            : "border-line/70 bg-ink-raised/70 px-5 py-3"
        }`}
      >
        <a href="#top" className="font-display text-sm font-bold tracking-tight text-paper">
          {"<"}RC<span className="text-signal-ink">/</span>{">"}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navKeys.map((key) => (
            <a
              key={key}
              href={navHrefs[key]}
              className="text-sm text-paper-dim transition-colors hover:text-paper"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle label={tTheme("toggle")} />
          <a
            href={profile.cvHref}
            download
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-paper transition-colors hover:border-signal hover:text-signal-ink"
          >
            {t("cv")}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-paper md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <List size={18} />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 flex max-w-5xl flex-col gap-1 rounded-3xl border border-line bg-ink-raised/95 p-4 backdrop-blur-md md:hidden">
          {navKeys.map((key) => (
            <a
              key={key}
              href={navHrefs[key]}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm text-paper-dim transition-colors hover:bg-surface hover:text-paper"
            >
              {t(key)}
            </a>
          ))}
          <div className="mt-1 flex items-center justify-between gap-3 px-1">
            <LanguageSwitcher />
            <ThemeToggle label={tTheme("toggle")} />
          </div>
          <a
            href={profile.cvHref}
            download
            className="mt-1 rounded-xl border border-line px-3 py-2.5 text-center text-sm text-paper"
          >
            {t("downloadCv")}
          </a>
        </div>
      )}
    </header>
  );
}
