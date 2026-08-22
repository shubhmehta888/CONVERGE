// In-memory "database" of student profiles.
// Swap this module out for a real DB (Postgres, Mongo, etc.) later —
// every route only ever imports `profiles` from here.

export const profiles = [
  {
    id: "aisha-rahman",
    name: "Aisha Rahman",
    initials: "AR",
    role: "Frontend engineer",
    skills: ["React", "TypeScript", "CSS", "Framer Motion", "Accessibility"],
    tags: ["frontend"],
    bio: "Ships fast, obsesses over micro-interactions. Won 3 of her last 5 hackathons on frontend.",
    availability: "Free tonight · till 4am",
    availabilityTags: ["tonight", "late-night"],
    remote: false
  },
  {
    id: "daniel-osei",
    name: "Daniel Osei",
    initials: "DO",
    role: "Full-stack developer",
    skills: ["React", "Node.js", "Express", "PostgreSQL", "Auth", "Deploy/DevOps"],
    tags: ["frontend", "backend"],
    bio: "Comfortable across the stack — will happily own auth and deploy while you build UI.",
    availability: "Free tonight · after 8pm",
    availabilityTags: ["tonight", "evening"],
    remote: false
  },
  {
    id: "leo-fernandes",
    name: "Leo Fernandes",
    initials: "LF",
    role: "ML engineer",
    skills: ["Python", "LLMs", "RAG", "Evals", "Vector DBs", "PyTorch"],
    tags: ["ml", "ai"],
    bio: "Builds retrieval pipelines and evals that actually hold up in a demo.",
    availability: "Free tonight · remote",
    availabilityTags: ["tonight", "remote"],
    remote: true
  },
  {
    id: "sana-kapoor",
    name: "Sana Kapoor",
    initials: "SK",
    role: "Product designer",
    skills: ["Figma", "UI/UX", "Design systems", "Prototyping", "User research"],
    tags: ["design"],
    bio: "Makes hackathon projects look like funded products. Fast at design-to-dev handoff.",
    availability: "Free tonight · till 2am",
    availabilityTags: ["tonight", "late-night"],
    remote: false
  },
  {
    id: "priya-shetty",
    name: "Priya Shetty",
    initials: "PS",
    role: "Growth + pitch specialist",
    skills: ["Pitching", "Storytelling", "Go-to-market", "Slides", "Public speaking"],
    tags: ["growth", "pitch"],
    bio: "The reason judges remember your demo. Writes and delivers the 3-minute pitch.",
    availability: "Free tonight",
    availabilityTags: ["tonight"],
    remote: false
  },
  {
    id: "rhea-malhotra",
    name: "Rhea Malhotra",
    initials: "RM",
    role: "Data scientist",
    skills: ["Python", "SQL", "Pandas", "Data viz", "Recommendation systems"],
    tags: ["data", "ml"],
    bio: "Turns messy datasets into the model that actually ships in a demo.",
    availability: "Free this week · afternoons",
    availabilityTags: ["this-week", "daytime"],
    remote: false
  },
  {
    id: "marcus-webb",
    name: "Marcus Webb",
    initials: "MW",
    role: "Backend engineer",
    skills: ["Node.js", "PostgreSQL", "REST APIs", "Redis", "System design"],
    tags: ["backend"],
    bio: "Designs APIs that don't fall over the moment judges start clicking around.",
    availability: "Free tonight · till midnight",
    availabilityTags: ["tonight", "late-night"],
    remote: false
  },
  {
    id: "yuki-tanaka",
    name: "Yuki Tanaka",
    initials: "YT",
    role: "Mobile developer",
    skills: ["React Native", "Swift", "Mobile UX", "Push notifications"],
    tags: ["mobile", "frontend"],
    bio: "Gets a working iOS build onto a judge's phone before anyone else has opened Xcode.",
    availability: "Free tonight · remote",
    availabilityTags: ["tonight", "remote"],
    remote: true
  },
  {
    id: "carlos-mendes",
    name: "Carlos Mendes",
    initials: "CM",
    role: "DevOps / infra",
    skills: ["Docker", "AWS", "CI/CD", "Deploy/DevOps", "Monitoring"],
    tags: ["backend", "infra"],
    bio: "Has the demo live on a real URL an hour before the deadline, every time.",
    availability: "Free this weekend",
    availabilityTags: ["weekend"],
    remote: false
  },
  {
    id: "nadia-hassan",
    name: "Nadia Hassan",
    initials: "NH",
    role: "UI/UX designer",
    skills: ["Figma", "Branding", "Motion design", "Illustration"],
    tags: ["design"],
    bio: "Can turn a rough idea into a clickable prototype in under an hour.",
    availability: "Free tonight · till 3am",
    availabilityTags: ["tonight", "late-night"],
    remote: false
  },
  {
    id: "ben-oconnor",
    name: "Ben O'Connor",
    initials: "BO",
    role: "Full-stack developer",
    skills: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe"],
    tags: ["frontend", "backend"],
    bio: "Wires up payments and databases fast enough that you forget it was hard.",
    availability: "Free tonight · after 7pm",
    availabilityTags: ["tonight", "evening"],
    remote: false
  },
  {
    id: "meera-iyer",
    name: "Meera Iyer",
    initials: "MI",
    role: "ML engineer",
    skills: ["LLMs", "RAG", "LangChain", "Python", "Prompt engineering"],
    tags: ["ml", "ai"],
    bio: "Has an opinion about your RAG pipeline and it's usually the right one.",
    availability: "Free this week · evenings",
    availabilityTags: ["this-week", "evening"],
    remote: true
  },
  {
    id: "tomasz-nowak",
    name: "Tomasz Nowak",
    initials: "TN",
    role: "Backend engineer",
    skills: ["Go", "PostgreSQL", "Kafka", "System design", "APIs"],
    tags: ["backend"],
    bio: "Thinks in schemas and queues; your API won't be the bottleneck.",
    availability: "Free tonight · remote",
    availabilityTags: ["tonight", "remote"],
    remote: true
  },
  {
    id: "grace-lin",
    name: "Grace Lin",
    initials: "GL",
    role: "Product manager",
    skills: ["Roadmapping", "User research", "Pitching", "Prioritization"],
    tags: ["growth", "pitch", "product"],
    bio: "Keeps a 36-hour hackathon team scoped to something that actually finishes.",
    availability: "Free this weekend",
    availabilityTags: ["weekend"],
    remote: false
  },
  {
    id: "arjun-desai",
    name: "Arjun Desai",
    initials: "AD",
    role: "Frontend engineer",
    skills: ["Vue", "React", "Tailwind", "Animation", "Design systems"],
    tags: ["frontend"],
    bio: "Turns a Figma file into pixel-accurate UI faster than most people finish coffee.",
    availability: "Free tonight · till 1am",
    availabilityTags: ["tonight", "late-night"],
    remote: false
  }
];
