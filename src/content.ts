export type Experience = {
    title: string;
    meta?: string;
    body: string;
    href?: string;
};

export type Post = {
    title: string;
    date: string;
    slug: string;
};

export type LinkItem = {
    label: string;
    href: string;
    icon: string;
};

export const about =
    "Hello! My name is Laasya and I am a computer science/machine learning student at Carnegie Mellon University, originally from Minnesota. I have a passion for math and computer science; I am especially interested in the topics where the two fields intersect like machine learning, cryptology, and coding theory. I was previously dual enrolled at the University of Minnesota when I first started exploring these topics. My favorite authors are Jane Austen, Oscar Wilde, and Marcus Zusak. I also like to make jewelry (and other arts and crafts) and go on bike rides when I can, when six months of Minnesota winter are not leaving behind mounds of snow, black ice, and an immeasurable amount of slush.";

export const experiences: Experience[] = [
    // {
    //     title: "Student Ambassador",
    //     meta: "Google, Fall 2026",
    //     body: "Google AI Student Ambassador at my school! Updates coming soon!!",
    // },
    {
        title: "AI Software Engineering Intern",
        meta: "CyberDNA Security, Summer 2026",
        body: "Some cybersecurity, some AI... updates coming soon!",
    },
    {
        title: "RapidHandoff ER Operations Dashboard",
        meta: "Personal Project, Summer 2026",
        body: "Built multi-agent hospital operations platform that coordinates patient intake, triage, resource allocation, and staff scheduling through a multi-agent workflow architecture. Engineered MCP-integrated backend services (TypeScript, MongoDB, Google Cloud) supporting real-time bed assignment, staffing decisions, and operational analytics. Created receptionist and operations dashboards (React, Vite) with live workflow visibility, resource utilization monitoring, and agent decision tracing via Arize Phoenix.",
        href: "https://devpost.com/software/rapid-handoff-er-flow",
    },
    {
        title: "Bias Lens",
        meta: "Steelhacks 2025 3x Winner",
        body: "Using LLMs to identify biased language in medical papers. We look at the sample of people included in the study and identify any genedered language being used to help users determine whether the results of a study is generalizable. All you do is paste the study or article link and we analyze it for you, helping you catch anything you may have missed and provide a second opinion on the applicability of the study's results.",
        href: "https://devpost.com/software/the-bias-lens",
    },
    {
        title: "Software Engineering Intern",
        meta: "Dispatch, Summer 2025",
        body: "Interned on the QA team at Dispatch, a last-mile delivery logistics startup. I worked on automating mobile and web tests and explored how AI can improve migration work, including training an agent to convert legacy suites from Appium to Maestro and from Selenium to Playwright/Pytest.",
    },
    {
        title: "Automating Playbook Generation",
        meta: "CMU S3D, 2024-present",
        body: "Part of an AI and cybersecurity research project under Prof. Ehab Al-Shaer and Prof. David Garlan using the MITRE D3FEND dataset to explore how LLMs and solvers can automate cyber defense playbooks.",
    },
    {
        title: "CMUEats",
        meta: "Tech lead, 2025-2026",
        body: "Tech lead for CMUEats, CMU ScottyLabs' student-run one-stop shop for dining information and one of the club's most widely used web apps. I lead a student team building features like reviews, dietary restriction filters, and richer menu integrations.",
        href: "https://cmueats.com",
    },
    {
        title: "IIoT Intern",
        meta: "General Mills, Summer 2024",
        body: "Worked on the innovation team, experimenting with sensors and exploring how they could improve manufacturing processes inside General Mills plants. I also used Grafana to analyze live sensor data.",
    },
    {
        title: "Software Engineering Intern",
        meta: "Minnesota Twins, Summer 2023",
        body: "Built a CRUD app with React, TypeScript, Prisma, and Tailwind CSS to help executives match sales reps to ticket group types. I also completed tickets across other internal apps and worked with GraphQL endpoints.",
    },
    {
        title: "DiaBuddies",
        meta: "TechnovationMN winning app, 2024",
        body: "Created a blood sugar management app for children with a diabetes learning game, quizzes and challenges, a glucose tracker, and a tree that grew from healthy habits and app interactions.",
    },
    {
        title: "AgrID",
        meta: "TechnovationMN winning app, 2023",
        body: "Built a React Native and JavaScript app with Team Velocity to identify crop diseases with machine learning. A user takes a photo of a crop and the model classifies the disease or marks it healthy.",
        href: "https://youtu.be/VHb-8lDwb1Y",
    },
];

export const links: LinkItem[] = [
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/laasyaaki",
        icon: "in",
    },
    { label: "GitHub", href: "https://github.com/laasyaaki", icon: "GH" },
    { label: "Email", href: "mailto:laasya@cmu.edu", icon: "@" },
    {
        label: "Pinterest",
        href: "https://www.pinterest.com/pricklypearyum/",
        icon: "P",
    },
];

export const posts: Post[] = [
    {
        title: "Can AI Create Better Classrooms?",
        date: "2024-06-12",
        slug: "ai-in-education",
    },
    {
        title: "Moravec's Paradox",
        date: "2024-05-10",
        slug: "moravecs-paradox",
    },
    {
        title: "The Potential of Precision Agriculture",
        date: "2024-04-11",
        slug: "precision-agriculture",
    },
    {
        title: "The Imperative of Fairness in AI for Economic Decision-Making",
        date: "2024-03-15",
        slug: "wef-data-bias",
    },
    {
        title: "Data Bias Against People of Color in Housing Loan Applications",
        date: "2024-02-09",
        slug: "data-bias-housing-loans",
    },
    {
        title: "Why is Adaptive Tech Legislation Important?",
        date: "2024-01-25",
        slug: "gov-adaptation-in-tech",
    },
    {
        title: "Data Bias Against Women in Healthcare",
        date: "2024-01-11",
        slug: "data-bias-healthcare-against-women",
    },
    {
        title: "Kimberly Bryant and Black Girls Code",
        date: "2023-12-10",
        slug: "kimberly-bryant",
    },
    {
        title: "Reshma Saujani: The Founder of Girls Who Code",
        date: "2023-11-19",
        slug: "reshma-saujani",
    },
    {
        title: "Joy Buolamwini: Fighting Data Bias in AI",
        date: "2023-11-08",
        slug: "joy-buolamwini",
    },
    {
        title: "How Social Media Helps and Hinders Activists",
        date: "2023-10-28",
        slug: "social-media-activism",
    },
    {
        title: "Exploring Data Bias Against Women",
        date: "2023-06-25",
        slug: "exploring-databias-against-women",
    },
    {
        title: "The Pandemic's Impact on the Gaming Industry",
        date: "2023-05-03",
        slug: "gaming-industry-pandemic",
    },
    {
        title: "SPHEREx: The NASA Space Observatory",
        date: "2023-01-14",
        slug: "spherex",
    },
    {
        title: "Genetic Scissors: Editing the Genome with CRISPR",
        date: "2022-12-07",
        slug: "geneticscissors",
    },
    {
        title: "The Fountain of Youth: Reprogramming Cells",
        date: "2022-11-28",
        slug: "fountain-of-youth",
    },
    {
        title: "The Cost of Going Green",
        date: "2022-10-05",
        slug: "cost-of-going-green",
    },
    {
        title: "Computing Carbon Emissions",
        date: "2022-09-14",
        slug: "computing-carbon-emissions",
    },
    {
        title: "The Traffic Light and Other Everyday Technology",
        date: "2022-08-22",
        slug: "traffic-light",
    },
    {
        title: "3 of The Most Important Women in Technology",
        date: "2022-07-25",
        slug: "3-women-in-tech",
    },
    {
        title: "The Most Popular Operating Systems",
        date: "2022-06-15",
        slug: "operating-sys",
    },
    {
        title: "The Everlasting Success of Minecraft",
        date: "2022-05-30",
        slug: "minecraft-success",
    },
    {
        title: "2022 Technology Predictions",
        date: "2022-04-18",
        slug: "2022-tech-predictions",
    },
    {
        title: "The Many Inventions of Nikola Tesla",
        date: "2022-04-04",
        slug: "nikola-tesla",
    },
    {
        title: "Artificial Organic Matter",
        date: "2022-03-16",
        slug: "artifical-organic-matter",
    },
    {
        title: "The Future of Video Games",
        date: "2022-03-07",
        slug: "future-of-video-games",
    },
    { title: "Authentication", date: "2021-12-22", slug: "authentication" },
    {
        title: "The Future of Clean-Energy: Geothermal Energy",
        date: "2021-12-20",
        slug: "geothermal-energy",
    },
    {
        title: "The Future of Robot Caregivers",
        date: "2021-12-13",
        slug: "robot-caregivers",
    },
    { title: "Cryptology", date: "2021-11-01", slug: "cryptology" },
    {
        title: "The Impact of Technology on Human Interactions",
        date: "2021-10-29",
        slug: "technology-on-human",
    },
    {
        title: "Frances Haugen: Facebook Whistleblower",
        date: "2021-10-20",
        slug: "frances-haugen",
    },
    {
        title: "Video Games: A New Prescription",
        date: "2021-10-04",
        slug: "video-games-perscription",
    },
    {
        title: "Dependence on Technology",
        date: "2021-09-15",
        slug: "dependence-on-technology",
    },
    {
        title: "The Enigma Machine",
        date: "2021-09-08",
        slug: "the-enigma-machine",
    },
    {
        title: "Meredith Whittaker",
        date: "2021-08-25",
        slug: "meredith-whittaker",
    },
    {
        title: "The Strongest AIs",
        date: "2021-08-16",
        slug: "the-strongest-ais",
    },
    {
        title: "The Rise of Google Search",
        date: "2021-08-09",
        slug: "the-rise-of-google-search",
    },
    {
        title: "The Importance of Randomness",
        date: "2021-08-04",
        slug: "the-importance-of-randomness",
    },
];
