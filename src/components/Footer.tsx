import { getTranslations } from "next-intl/server";
import { profile, navKeys, navHrefs } from "@/lib/data";

export async function Footer() {
  const t = await getTranslations("nav");

  return (
    <footer className="border-t border-line-soft py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-sm text-paper-faint md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {navKeys.map((key) => (
            <a key={key} href={navHrefs[key]} className="transition-colors hover:text-paper">
              {t(key)}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
