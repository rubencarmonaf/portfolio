export const profile = {
  name: "Rubén Carmona Fortuño",
  role: "Full Stack Developer",
  location: "Vila-real, Comunidad Valenciana",
  email: "rubencarmonaf@gmail.com",
  github: "https://github.com/rubencarmonaf",
  linkedin: "https://linkedin.com/in/ruben-carmona-in",
  cvHref: "/CV_Ruben_Carmona.pdf",
  photo: "/profile.webp",
};

export const heroStack = [
  "Node.js",
  "Angular",
  "TypeScript",
  "Express",
  "MySQL",
  "Docker",
  "GCP",
  "React",
  "Next.js",
  "Socket.IO",
  "MongoDB",
  "Terraform",
];

export const skillGroups = [
  {
    key: "backend" as const,
    items: ["Node.js", "Express", "REST APIs", "PHP", "Symfony", "Python", "Java", "Elixir"],
  },
  {
    key: "frontend" as const,
    items: ["Angular 19", "AngularJS", "TypeScript", "RxJS", "SSR", "React"],
  },
  {
    key: "data" as const,
    items: ["MySQL", "MongoDB", "Redis"],
  },
  {
    key: "cloud" as const,
    items: ["GCP", "Docker", "Terraform", "GitHub Actions", "CI/CD"],
  },
];

export type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  current?: boolean;
  bullets?: boolean;
  stack: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "revenueLabs",
    role: "Software Developer",
    company: "The Revenue Labs",
    bullets: true,
    stack: ["Node.js", "Express", "Angular 19", "TypeScript", "MySQL", "RxJS", "Redsys", "Docker", "GCP", "Terraform"],
  },
  {
    id: "nttData",
    role: "Center Developer",
    company: "NTT DATA Europe & Latam",
    stack: ["PHP", "Symfony", "Angular"],
  },
  {
    id: "anaimo",
    role: "Artificial Intelligence Developer",
    company: "Anaimo",
    stack: ["JavaScript", "PHP", "Machine Learning"],
  },
  {
    id: "arenaStack",
    role: "CIO & Full Stack Developer",
    company: "Arena Stack",
    stack: ["Node.js", "Elixir", "Phoenix", "Angular"],
  },
];

export type ProjectEntry = {
  id: string;
  name: string;
  stack: string[];
  liveHref: string;
  repoHref: string;
  // width/height must match the real file so the gallery never crops it.
  images: { src: string; alt: string; width: number; height: number }[];
};

// Add future projects here; each needs a matching "items.<id>" block in
// messages/es.json and messages/en.json under the "projects" namespace.
export const projects: ProjectEntry[] = [
  {
    id: "uplift",
    name: "Uplift",
    stack: ["React 19", "NestJS", "PostgreSQL", "Drizzle", "Claude API", "Playwright", "TypeScript", "Docker"],
    liveHref: "https://uplift-web.onrender.com/",
    repoHref: "https://github.com/rubencarmonaf/Uplift",
    images: [
      { src: "/projects/uplift/results.jpg", alt: "Uplift A/B test results with the winning variant", width: 1568, height: 733 },
      { src: "/projects/uplift/variants.jpg", alt: "AI-generated copy variants scored against brand rules", width: 1568, height: 733 },
      { src: "/projects/uplift/projects.jpg", alt: "Uplift project list", width: 1568, height: 733 },
    ],
  },
  {
    id: "wordwars",
    name: "WordWars",
    stack: ["Node.js", "Express", "Socket.IO", "MongoDB", "Angular", "TypeScript", "JWT"],
    liveHref: "https://wordwars-ab0f.onrender.com/",
    repoHref: "https://github.com/rubencarmonaf/words-game",
    images: [
      { src: "/projects/wordwars/menu.jpg", alt: "WordWars main menu with the game modes", width: 1568, height: 778 },
      { src: "/projects/wordwars/setup.jpg", alt: "Solo practice mode setup screen", width: 1568, height: 778 },
      { src: "/projects/wordwars/gameplay.jpg", alt: "A match in progress with the PRE prefix active", width: 1568, height: 778 },
    ],
  },
];

export const navKeys = ["about", "experience", "project", "contact"] as const;

export const navHrefs: Record<(typeof navKeys)[number], string> = {
  about: "#sobre-mi",
  experience: "#experiencia",
  project: "#proyecto",
  contact: "#contacto",
};
