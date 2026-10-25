/**
 * Skills Dictionary for RecruitIQ Resume Screening and Job Matching
 * Categorized, normalized, and regex-safe to avoid false positive substring matches.
 */

export const SKILL_CATEGORIES = {
  PROGRAMMING: 'Programming Languages',
  FRONTEND: 'Frontend Development',
  BACKEND: 'Backend Development',
  DATABASES: 'Databases & Storage',
  DEVOPS_CLOUD: 'DevOps & Cloud',
  AI_DATA: 'AI, Machine Learning & Data',
  TOOLS_CONCEPTS: 'Tools, Architecture & Concepts',
  TESTING: 'Testing & QA',
  MOBILE: 'Mobile Development'
};

export const SKILLS_MASTER_LIST = [
  // Programming Languages
  {
    name: 'JavaScript',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['js', 'es6', 'es2015', 'ecmascript'],
    pattern: /\b(?:javascript|es6|es2015|ecmascript)\b/i
  },
  {
    name: 'TypeScript',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['ts'],
    pattern: /\b(?:typescript|ts)\b/i
  },
  {
    name: 'Python',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['py', 'python3'],
    pattern: /\b(?:python|python3)\b/i
  },
  {
    name: 'Java',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['java8', 'java11', 'java17', 'core java'],
    // Ensure Java does not match JavaScript
    pattern: /\b(?:java|core\s+java)(?!\s*script)\b/i
  },
  {
    name: 'C',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['c language'],
    // Strictly isolate "C" - word boundary, not followed by ++, #, or letters
    pattern: /(?:^|[\s,;:(/])C(?![\w+#])(?:[\s,;:)/]|$)/
  },
  {
    name: 'C++',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['cpp'],
    pattern: /(?:\bcpp\b|C\+\+)/i
  },
  {
    name: 'C#',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['csharp'],
    pattern: /(?:\bcsharp\b|C#)/i
  },
  {
    name: 'SQL',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['t-sql', 'pl-sql', 'structured query language'],
    pattern: /\b(?:sql|t-sql|pl-sql)\b/i
  },
  {
    name: 'Go',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['golang'],
    pattern: /\b(?:golang|go\s+language)\b|\bGo\b(?=[\s,;:(/].*(?:developer|backend|microservices|concurrency))/i
  },
  {
    name: 'Rust',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['rustlang'],
    pattern: /\b(?:rust|rustlang)\b/i
  },
  {
    name: 'PHP',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['php7', 'php8'],
    pattern: /\b(?:php|php7|php8)\b/i
  },
  {
    name: 'Ruby',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: ['ruby on rails'],
    pattern: /\bruby(?:\s+on\s+rails)?\b/i
  },
  {
    name: 'Kotlin',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: [],
    pattern: /\bkotlin\b/i
  },
  {
    name: 'Swift',
    category: SKILL_CATEGORIES.PROGRAMMING,
    aliases: [],
    pattern: /\bswift\b/i
  },

  // Frontend
  {
    name: 'HTML',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['html5'],
    pattern: /\bhtml5?\b/i
  },
  {
    name: 'CSS',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['css3'],
    pattern: /\bcss3?\b/i
  },
  {
    name: 'React',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['react.js', 'reactjs'],
    pattern: /\breact(?:\.?js)?\b/i
  },
  {
    name: 'Tailwind CSS',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['tailwind', 'tailwindcss'],
    pattern: /\btailwind(?:\s*css)?\b/i
  },
  {
    name: 'Bootstrap',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['bootstrap4', 'bootstrap5'],
    pattern: /\bbootstrap[45]?\b/i
  },
  {
    name: 'Next.js',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['nextjs', 'next'],
    pattern: /\bnext(?:\.?js)?\b/i
  },
  {
    name: 'Vue.js',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['vue', 'vuejs'],
    pattern: /\bvue(?:\.?js)?\b/i
  },
  {
    name: 'Angular',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['angularjs', 'angular2+'],
    pattern: /\bangular(?:\.?js)?\b/i
  },
  {
    name: 'Redux',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['redux toolkit', 'rtk'],
    pattern: /\bredux(?:\s*toolkit)?\b/i
  },
  {
    name: 'Sass',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['scss'],
    pattern: /\b(?:sass|scss)\b/i
  },

  // Backend
  {
    name: 'Node.js',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['nodejs', 'node'],
    pattern: /\bnode(?:\.?js)?\b/i
  },
  {
    name: 'Express.js',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['express', 'expressjs'],
    pattern: /\bexpress(?:\.?js)?\b/i
  },
  {
    name: 'REST API',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['restful api', 'rest', 'rest apis'],
    pattern: /\brest(?:ful)?\s*(?:api|apis)?\b/i
  },
  {
    name: 'GraphQL',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['apollo graphql'],
    pattern: /\bgraphql\b/i
  },
  {
    name: 'Spring Boot',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['spring', 'springboot'],
    pattern: /\bspring(?:\s*boot)?\b/i
  },
  {
    name: 'Django',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['django rest framework', 'drf'],
    pattern: /\bdjango\b/i
  },
  {
    name: 'FastAPI',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['fast api'],
    pattern: /\bfast\s*api\b/i
  },
  {
    name: 'Flask',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: [],
    pattern: /\bflask\b/i
  },
  {
    name: '.NET',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['dotnet', 'asp.net', '.net core'],
    pattern: /(?:\.net\s*core|asp\.net|\bdotnet\b)/i
  },

  // Databases & Storage
  {
    name: 'MongoDB',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: ['mongo', 'mongoose'],
    pattern: /\b(?:mongodb|mongo|mongoose)\b/i
  },
  {
    name: 'MySQL',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: [],
    pattern: /\bmysql\b/i
  },
  {
    name: 'PostgreSQL',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: ['postgres', 'psql'],
    pattern: /\b(?:postgresql|postgres|psql)\b/i
  },
  {
    name: 'Redis',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: [],
    pattern: /\bredis\b/i
  },
  {
    name: 'SQLite',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: [],
    pattern: /\bsqlite\b/i
  },
  {
    name: 'Oracle DB',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: ['oracle'],
    pattern: /\boracle(?:\s*(?:db|database))?\b/i
  },
  {
    name: 'Cassandra',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: ['apache cassandra'],
    pattern: /\bcassandra\b/i
  },

  // DevOps & Cloud
  {
    name: 'Git',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['git vcs'],
    pattern: /\bgit\b(?!\s*hub|\s*lab)/i
  },
  {
    name: 'GitHub',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['gitlab', 'bitbucket'],
    pattern: /\b(?:github|gitlab|bitbucket)\b/i
  },
  {
    name: 'Docker',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['containerization', 'containers'],
    pattern: /\bdocker(?:ization)?\b/i
  },
  {
    name: 'Kubernetes',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['k8s'],
    pattern: /\b(?:kubernetes|k8s)\b/i
  },
  {
    name: 'AWS',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['amazon web services', 'ec2', 's3', 'lambda'],
    pattern: /\b(?:aws|amazon\s+web\s+services)\b/i
  },
  {
    name: 'Azure',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['microsoft azure'],
    pattern: /\b(?:azure|microsoft\s+azure)\b/i
  },
  {
    name: 'GCP',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['google cloud platform', 'google cloud'],
    pattern: /\b(?:gcp|google\s+cloud(?:\s+platform)?)\b/i
  },
  {
    name: 'CI/CD',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['continuous integration', 'github actions', 'jenkins'],
    pattern: /\b(?:ci\/cd|continuous\s+integration|jenkins|github\s+actions)\b/i
  },
  {
    name: 'Linux',
    category: SKILL_CATEGORIES.DEVOPS_CLOUD,
    aliases: ['ubuntu', 'bash', 'shell scripting'],
    pattern: /\b(?:linux|ubuntu|bash|shell\s+scripting)\b/i
  },

  // AI & Data Science
  {
    name: 'Machine Learning',
    category: SKILL_CATEGORIES.AI_DATA,
    aliases: ['ml', 'supervised learning'],
    pattern: /\b(?:machine\s+learning|\bml\b)\b/i
  },
  {
    name: 'Artificial Intelligence',
    category: SKILL_CATEGORIES.AI_DATA,
    aliases: ['ai', 'genai', 'generative ai', 'llm'],
    pattern: /\b(?:artificial\s+intelligence|\bai\b|generative\s+ai|llm|large\s+language\s+models)\b/i
  },
  {
    name: 'Deep Learning',
    category: SKILL_CATEGORIES.AI_DATA,
    aliases: ['neural networks', 'cnn', 'rnn'],
    pattern: /\b(?:deep\s+learning|neural\s+networks)\b/i
  },
  {
    name: 'Data Structures',
    category: SKILL_CATEGORIES.TOOLS_CONCEPTS,
    aliases: ['dsa', 'algorithms'],
    pattern: /\b(?:data\s+structures|dsa|algorithms)\b/i
  },
  {
    name: 'TensorFlow',
    category: SKILL_CATEGORIES.AI_DATA,
    aliases: ['tf'],
    pattern: /\btensorflow\b/i
  },
  {
    name: 'PyTorch',
    category: SKILL_CATEGORIES.AI_DATA,
    aliases: [],
    pattern: /\bpytorch\b/i
  },
  {
    name: 'Pandas',
    category: SKILL_CATEGORIES.AI_DATA,
    aliases: [],
    pattern: /\bpandas\b/i
  },
  {
    name: 'NumPy',
    category: SKILL_CATEGORIES.AI_DATA,
    aliases: [],
    pattern: /\bnumpy\b/i
  },

  // Tools & Architecture
  {
    name: 'Microservices',
    category: SKILL_CATEGORIES.TOOLS_CONCEPTS,
    aliases: ['microservice architecture'],
    pattern: /\bmicroservices?\b/i
  },
  {
    name: 'Agile',
    category: SKILL_CATEGORIES.TOOLS_CONCEPTS,
    aliases: ['scrum', 'kanban'],
    pattern: /\b(?:agile|scrum|kanban)\b/i
  },
  {
    name: 'Postman',
    category: SKILL_CATEGORIES.TOOLS_CONCEPTS,
    aliases: ['api testing'],
    pattern: /\bpostman\b/i
  },
  {
    name: 'Jira',
    category: SKILL_CATEGORIES.TOOLS_CONCEPTS,
    aliases: [],
    pattern: /\bjira\b/i
  },

  // Testing & QA
  {
    name: 'Unit Testing',
    category: SKILL_CATEGORIES.TESTING,
    aliases: ['jest', 'vitest', 'mocha', 'pytest', 'junit'],
    pattern: /\b(?:unit\s+testing|jest|vitest|mocha|pytest|junit)\b/i
  },
  {
    name: 'Cypress',
    category: SKILL_CATEGORIES.TESTING,
    aliases: ['playwright', 'selenium'],
    pattern: /\b(?:cypress|playwright|selenium)\b/i
  }
];

/**
 * Normalizes skill string against known dictionary
 */
export const normalizeSkillName = (rawSkill) => {
  if (!rawSkill || typeof rawSkill !== 'string') return '';
  const trimmed = rawSkill.trim();
  
  for (const skill of SKILLS_MASTER_LIST) {
    if (skill.name.toLowerCase() === trimmed.toLowerCase()) {
      return skill.name;
    }
    if (skill.aliases.some(alias => alias.toLowerCase() === trimmed.toLowerCase())) {
      return skill.name;
    }
    if (skill.pattern.test(trimmed)) {
      return skill.name;
    }
  }
  return trimmed;
};
