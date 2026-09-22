export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[28%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[140px]" />
      <div
        className="hero-grid absolute -inset-x-1/4 -inset-y-1/4"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-signal) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 60% 55% at 50% 40%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 55% at 50% 40%, black 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
