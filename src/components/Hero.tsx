"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { DownloadSimple } from "@phosphor-icons/react/ssr";
import { profile, heroStack, navHrefs } from "@/lib/data";
import { Marquee } from "@/components/Marquee";
import { HeroBackground } from "@/components/HeroBackground";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const reduce = useReducedMotion();
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-24"
    >
      <HeroBackground />

      <motion.div
        className="mx-auto w-full max-w-5xl px-6"
        variants={container}
        initial={reduce ? "show" : "hidden"}
        animate="show"
      >
        <motion.p variants={item} className="font-display text-sm text-paper-dim">
          {profile.name}
        </motion.p>
        <motion.p variants={item} className="mt-1 text-sm text-paper-faint">
          {profile.location}, {t("country")}
          <span className="mx-2 text-line">·</span>
          {t("availability")}
        </motion.p>

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-paper sm:text-5xl md:text-6xl">
          <motion.span variants={item} className="block">
            {t("headline1")}
          </motion.span>
          <motion.span variants={item} className="block">
            {t("headline2")}
          </motion.span>
        </h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-lg text-paper-dim">
          {t("subtitle")}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href={navHrefs.project}
            className="rounded-full bg-signal px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {t("ctaProject")}
          </a>
          <a
            href={profile.cvHref}
            download
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-paper transition-colors hover:border-signal hover:text-signal-ink"
          >
            <DownloadSimple size={16} weight="bold" />
            {t("ctaCv")}
          </a>
        </motion.div>
      </motion.div>

      <div className="mt-16">
        <Marquee items={heroStack} />
      </div>
    </section>
  );
}
