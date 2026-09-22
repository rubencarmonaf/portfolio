"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const locales = [
  { code: "es" as const, label: "ES" },
  { code: "en" as const, label: "EN" },
];

export function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-line p-0.5 text-xs">
      {locales.map(({ code, label }) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          className={`rounded-full px-2 py-1 transition-colors ${
            active === code ? "bg-surface text-paper" : "text-paper-faint hover:text-paper-dim"
          }`}
          aria-current={active === code}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
