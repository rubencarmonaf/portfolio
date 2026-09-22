import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { profile, skillGroups } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";

export async function About() {
  const t = await getTranslations("about");
  const tSkills = await getTranslations("skills");

  return (
    <section id="sobre-mi" className="border-t border-line-soft py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="grid gap-12 md:grid-cols-[280px_1fr] md:items-start" stagger={0.12}>
          <div className="relative mx-auto w-56 overflow-hidden rounded-2xl border border-line bg-surface md:mx-0 md:w-full">
            <Image
              src={profile.photo}
              alt={profile.name}
              width={640}
              height={800}
              priority
              className="aspect-[4/5] w-full object-cover object-top grayscale-[15%] transition-[filter] duration-500 hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-6 max-w-lg text-paper-dim">{t("p1")}</p>
            <p className="mt-4 max-w-lg text-paper-dim">{t("p2")}</p>
            <a
              href={profile.cvHref}
              download
              className="mt-8 inline-flex items-center gap-2 text-sm text-signal-ink transition-opacity hover:opacity-80"
            >
              {t("cvLink")} →
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4" stagger={0.08} rotate={-2}>
          {skillGroups.map((group) => (
            <div
              key={group.key}
              className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-signal/40"
            >
              <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-paper-dim">
                {tSkills(group.key)}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line-soft px-2.5 py-1 text-xs text-paper"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
