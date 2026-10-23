// Single source of truth for everything the site says.
// All facts come from Khushi's resume — edit here, not in components.

export const profile = {
  name: 'Khushi Panu',
  firstName: 'Khushi',
  lastName: 'Panu',
  role: 'Full Stack Developer',
  stack: 'MERN Stack · React.js · Node.js',
  location: 'Haldwani, Uttarakhand, India',
  timeZone: 'Asia/Kolkata',
  email: 'Khushipanu007@gmail.com',
  phone: '+91 8057324830',
  phoneHref: 'tel:+918057324830',
  intro:
    'Full Stack Developer building web applications with the MERN stack — MongoDB, Express.js, React.js and Node.js. Currently developing ERP modules and RESTful APIs that support real business workflows.',
}

export const socials = [
  { label: 'LinkedIn', handle: 'khushi-panu', href: 'https://www.linkedin.com/in/khushi-panu-419157294' },
  { label: 'GitHub', handle: 'khushipanu', href: 'https://github.com/khushipanu' },
  { label: 'LeetCode', handle: 'khushipanu', href: 'https://leetcode.com/khushipanu' },
]

export const about = {
  lead: [
    { text: 'I turn ' },
    { text: 'ideas', serif: true },
    { text: ' into fast, maintainable web applications — from ' },
    { text: 'interfaces', serif: true },
    { text: ' people enjoy using to the ' },
    { text: 'APIs', serif: true },
    { text: ' and data that power them.' },
  ],
  body:
    'I work across the stack with JavaScript, React.js, Node.js, Express.js and MongoDB, with a strong foundation in Data Structures and Algorithms and Object-Oriented Programming. I care about clean component architecture, reliable data flow and code that stays easy to change.',
}

// "What I do" cards, in the order they stack. The last one is drawn in the accent colour.
export const services = [
  {
    title: 'Frontend Development',
    description:
      'Responsive, component-based interfaces in React.js and Tailwind CSS that look right on every screen and stay easy to extend.',
    points: [
      'Reusable React.js components for pages, forms and data views',
      'State handled with Redux Toolkit, Context API and React Hooks',
      'Mobile-first layouts and interactive web animations',
    ],
    tags: ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript (ES6+)'],
  },
  {
    title: 'Backend & REST APIs',
    description:
      'Secure, well-structured server code with Node.js and Express.js, so the data behind the interface is reliable.',
    points: [
      'RESTful APIs with clear routes and error handling',
      'JWT authentication and role-based access control (RBAC)',
      'MongoDB schema design for real application data',
    ],
    tags: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'RBAC'],
  },
  {
    title: 'ERP Web Applications',
    description:
      'At Ruhanix I develop and maintain a production ERP web application that streamlines day-to-day business operations.',
    points: [
      'ERP modules, forms and data views built in React.js',
      'Frontend connected to backend services through RESTful APIs',
      'Debugging across the stack, new features and ongoing maintenance',
    ],
    tags: ['React.js', 'RESTful APIs', 'Debugging'],
  },
  {
    title: 'Performance & Web Animations',
    description:
      'Fast, smooth websites that respond well on any device, with motion that adds to the experience instead of slowing it down.',
    points: [
      'Performance and responsiveness optimisation',
      'Interactive web animations',
      'Clean, maintainable code that is easy to hand over',
    ],
    tags: ['Optimisation', 'Responsive Design', 'Web Animations', 'Vite'],
  },
  {
    title: 'Generative AI & System Design',
    description:
      'Working knowledge of Generative AI and the fundamentals of designing systems that scale.',
    points: [
      'LLMs, Retrieval-Augmented Generation (RAG) and prompt engineering',
      'Client-server architecture, caching, load balancing and indexing',
      'A strong foundation in Data Structures and Algorithms',
    ],
    tags: ['LLMs', 'RAG', 'Prompt Engineering', 'Scalability'],
  },
  {
    title: 'Full-Stack MERN Apps',
    description:
      'End-to-end web applications on MongoDB, Express.js, React.js and Node.js — from the database schema to the final screen.',
    points: [
      'Learning Management System with course purchasing and video streaming',
      'MovieThrill, a movie discovery app on the TMDB API',
      'Multiple full-stack websites built at Sheryians Coding School',
    ],
    tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
  },
]

export const resume = { href: 'Khushi_Panu_Resume.pdf', file: 'Khushi_Panu_Resume.pdf' }

export const projects = [
  {
    id: 'moviethrill',
    index: '01',
    title: 'MovieThrill',
    kind: 'Movie Discovery Web Application',
    summary:
      'A movie discovery app in React.js that retrieves and displays movie data from The Movie Database (TMDB) API.',
    tech: ['React.js', 'Redux Toolkit', 'React-Redux', 'Tailwind CSS', 'Axios', 'TMDB API'],
    points: [
      'Integrated The Movie Database (TMDB) API to retrieve and display movie data, with requests handled through Axios.',
      'Centralized application state with Redux Toolkit and React-Redux across components.',
      'Built a responsive Tailwind CSS interface from reusable components to keep features simple to extend.',
    ],
    art: 'movie',
    // Add real links here when available, e.g. live: 'https://…', code: 'https://github.com/…'
    live: null,
    code: null,
  },
  {
    id: 'lms',
    index: '02',
    title: 'Learning Management System',
    kind: 'Full-Stack MERN Application',
    summary:
      'A full-stack learning platform supporting instructor-led course creation and student learning workflows.',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'RESTful APIs', 'JWT'],
    points: [
      'Implemented authentication and role-based access control with distinct student and instructor permissions.',
      'Designed MongoDB schemas for course data and integrated React.js components with backend APIs.',
      'Implemented course purchasing and streaming to support the student learning experience.',
    ],
    art: 'lms',
    live: null,
    code: null,
  },
]

export const experience = [
  {
    company: 'Ruhanix OPC Private Limited',
    role: 'Full Stack Developer',
    period: 'Apr 2026 — Present',
    stack: ['React.js', 'JavaScript', 'RESTful APIs'],
    points: [
      'Develop and maintain an ERP (Enterprise Resource Planning) web application that streamlines business operations.',
      'Build responsive, reusable React.js components for ERP modules, forms and data views.',
      'Integrate the frontend with backend services through RESTful APIs, and debug across the stack.',
    ],
  },
  {
    company: 'Sheryians Coding School',
    role: 'Web Developer Intern',
    period: 'Dec 2025 — Feb 2026',
    stack: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
    points: [
      'Built multiple full-stack websites with React.js, Tailwind CSS, Node.js and Express.js.',
      'Optimized websites for performance and responsiveness, and implemented interactive web animations.',
      'Created technical content on web development, explaining complex programming concepts clearly.',
    ],
  },
]

export const education = [
  { degree: 'Master of Computer Applications (MCA)', school: 'Graphic Era Deemed to be University', period: '2026 — 2028', note: 'Pursuing' },
  { degree: 'Bachelor of Computer Applications (BCA)', school: 'Graphic Era Hill University, Haldwani', period: '2023 — 2026', note: 'CGPA 9.0 / 10' },
  { degree: 'Class XII · Class X (CBSE)', school: "The Master's Sr. Sec. School", period: '2023 · 2021', note: '89.2% · 92.2%' },
]

export const skillWords = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'JavaScript', 'REST APIs']

export const skillGroups = [
  { label: 'Languages', items: ['JavaScript (ES6+)', 'Java', 'SQL', 'HTML5', 'CSS3'] },
  { label: 'Frontend', items: ['React.js', 'JSX', 'React Router', 'Tailwind CSS', 'Responsive Design'] },
  { label: 'State', items: ['Redux Toolkit', 'React-Redux', 'Context API', 'React Hooks'] },
  { label: 'Backend', items: ['Node.js', 'Express.js', 'RESTful APIs', 'JWT', 'RBAC'] },
  { label: 'Data & Tools', items: ['MongoDB', 'SQL', 'Git', 'GitHub', 'Postman', 'Axios', 'Vite'] },
  { label: 'Foundations', items: ['Data Structures & Algorithms', 'OOP', 'Operating Systems', 'Computer Networks'] },
]
