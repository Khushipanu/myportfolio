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

export const services = [
  {
    title: 'Frontend Development',
    description:
      'Responsive, component-based interfaces with React.js and Tailwind CSS, with state managed through Redux Toolkit, Context API and React Hooks.',
    tags: ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'React Router'],
  },
  {
    title: 'Backend & APIs',
    description:
      'RESTful APIs with Node.js and Express.js, JWT authentication, role-based access control and MongoDB schema design.',
    tags: ['Node.js', 'Express.js', 'JWT', 'RBAC', 'MongoDB'],
  },
  {
    title: 'ERP Systems',
    description:
      'Building and maintaining ERP modules that support business workflows, data management and operational processes.',
    tags: ['ERP Modules', 'REST APIs', 'Debugging'],
  },
  {
    title: 'Technical Content',
    description:
      'Explaining web development and programming fundamentals clearly — turning complex concepts into accessible content for developers.',
    tags: ['Web Development', 'JavaScript', 'Teaching'],
  },
]

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
    points: [
      'Develop and maintain ERP (Enterprise Resource Planning) modules supporting business workflows, data management and operational processes.',
      'Build RESTful APIs and application components, connecting frontend interfaces with backend services for reliable data flow.',
      'Troubleshoot and debug application issues, and collaborate on feature implementation and maintenance.',
    ],
  },
  {
    company: 'Sheryians Coding School',
    role: 'Web Developer Intern',
    period: 'Dec 2025 — Feb 2026',
    points: [
      'Developed reusable React.js components and responsive user interfaces using Tailwind CSS.',
      'Built and integrated Node.js and Express.js endpoints for dynamic web functionality.',
      'Created technical and educational content on web development and programming fundamentals.',
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
