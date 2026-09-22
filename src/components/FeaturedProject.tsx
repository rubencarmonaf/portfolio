import { getTranslations } from "next-intl/server";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/ssr";
import { project } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProjectGallery } from "@/components/ProjectGallery";

export async function FeaturedProject() {
  const t = await getTranslations("project");
  const bullets = t.raw("bullets") as string[];

  return (
    <section id="proyecto" className="border-t border-line-soft py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <ScrollReveal className="flex flex-col gap-2" stagger={0.08} y={16}>
              <h2 className="font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
                {project.name}
              </h2>
              <p className="text-paper-dim">{t("tagline")}</p>
            </ScrollReveal>

            <p className="mt-6 text-paper-dim">{t("description")}</p>

            <ScrollReveal as="ul" className="mt-5 flex flex-col gap-2" stagger={0.06} y={12}>
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm text-paper-dim">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line" />
                  {bullet}
                </li>
              ))}
            </ScrollReveal>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
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
                href={project.liveHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink"
              >
                {t("openCta")}
                <ArrowUpRight size={16} weight="bold" />
              </a>
              <a
                href={project.repoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-paper transition-colors hover:border-signal hover:text-signal-ink"
              >
                <GithubLogo size={16} weight="bold" />
                {t("codeCta")}
              </a>
            </div>
          </div>

          <ProjectGallery images={project.images} />
        </div>
      </div>
    </section>
  );
}
