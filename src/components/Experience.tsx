import { getTranslations } from "next-intl/server";
import { experience } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";

export async function Experience() {
  const t = await getTranslations("experience");

  return (
    <section id="experiencia" className="border-t border-line-soft py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="flex flex-col gap-2" stagger={0.08} y={16}>
          <h2 className="font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">
            {t("title")}
          </h2>
        </ScrollReveal>

        <ScrollReveal className="mt-12 flex flex-col gap-10" stagger={0.1} y={20}>
          {experience.map((job) => {
            const place = t(`items.${job.id}.place` as never);
            const period = t(`items.${job.id}.period` as never);
            const summary = t(`items.${job.id}.summary` as never);
            const bullets = job.bullets
              ? (t.raw(`items.${job.id}.bullets` as never) as string[])
              : null;

            return (
              <article
                key={job.id}
                className="grid gap-3 border-b border-line-soft pb-10 transition-colors last:border-b-0 last:pb-0 hover:border-signal/30 md:grid-cols-[220px_1fr]"
              >
                <div>
                  <p className="font-display text-sm text-paper-dim">{period}</p>
                  {job.current && (
                    <span className="mt-2 inline-flex items-center rounded-full border border-signal/40 bg-signal-soft px-2.5 py-0.5 text-xs text-signal-ink">
                      {t("current")}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-paper">
                    {job.role} <span className="text-paper-dim">· {job.company}</span>
                  </h3>
                  <p className="text-sm text-paper-faint">{place}</p>
                  <p className="mt-3 max-w-2xl text-paper-dim">{summary}</p>

                  {bullets && (
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 text-sm text-paper-dim">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {job.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-line-soft px-2.5 py-1 text-xs text-paper-dim"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
