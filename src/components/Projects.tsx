import { getTranslations } from "next-intl/server";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/ssr";
import { projects } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProjectGallery } from "@/components/ProjectGallery";

export async function Projects() {
  const t = await getTranslations("projects");

  return (
    <section id="proyecto" className="border-t border-line-soft py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="flex flex-col gap-2" stagger={0.08} y={16}>
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
            {t("title")}
          </h2>
        </ScrollReveal>

        <div className="mt-14 flex flex-col gap-24">
          {projects.map((item) => {
            const tagline = t(`items.${item.id}.tagline` as never);
            const description = t(`items.${item.id}.description` as never);
            const bullets = t.raw(`items.${item.id}.bullets` as never) as string[];

            return (
              <div key={item.id} className="grid gap-14 lg:grid-cols-2 lg:items-start">
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-paper">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-paper-dim">{tagline}</p>

                  <p className="mt-6 text-paper-dim">{description}</p>

                  <ul className="mt-5 flex flex-col gap-2">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-sm text-paper-dim">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {item.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-line-soft px-2.5 py-1 text-xs text-paper-dim"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href={item.liveHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink"
                    >
                      {t("openCta")}
                      <ArrowUpRight size={16} weight="bold" />
                    </a>
                    <a
                      href={item.repoHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-paper transition-colors hover:border-signal hover:text-signal-ink"
                    >
                      <GithubLogo size={16} weight="bold" />
                      {t("codeCta")}
                    </a>
                  </div>
                </div>

                <ProjectGallery images={item.images} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
