import Script from "next/script";

const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export function ThemeScript() {
  // The `no-before-interactive-script-outside-document` rule only knows about
  // the Pages Router's pages/_document.js. In the App Router, the root
  // layout (this one, app/[locale]/layout.tsx) is the documented, supported
  // place for a beforeInteractive script: https://nextjs.org/docs/app/api-reference/components/script#beforeinteractive
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}
