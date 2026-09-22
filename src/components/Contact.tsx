import { getTranslations } from "next-intl/server";
import { EnvelopeSimple, LinkedinLogo, GithubLogo, ArrowUpRight } from "@phosphor-icons/react/ssr";
import { profile } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";

export async function Contact() {
  const t = await getTranslations("contact");

  const links = [
    { label: t("email"), href: `mailto:${profile.email}`, icon: EnvelopeSimple, external: false },
    { label: t("linkedin"), href: profile.linkedin, icon: LinkedinLogo, external: true },
    { label: t("github"), href: profile.github, icon: GithubLogo, external: true },
  ];

  return (
    <section id="contacto" className="border-t border-line-soft py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <ScrollReveal className="flex flex-col items-center gap-4" stagger={0.1} y={18}>
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-md text-paper-dim">{t("subtitle")}</p>
        </ScrollReveal>

        <div className="mt-9">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3 text-sm font-semibold text-ink"
          >
            {t("cta")}
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>

        <ScrollReveal className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3" stagger={0.08}>
          {links.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-paper-dim transition-colors hover:border-signal hover:text-signal-ink"
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
