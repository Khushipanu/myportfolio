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

// Experience cards, newest first. The internship at Sheryians is shown as two
// cards: the web development work and the technical content.
export const experience = [
  {
    company: 'Ruhanix OPC Private Limited',
    role: 'Full Stack Developer',
    period: 'Apr 2026 — Present',
    summary: 'Building and maintaining a production ERP web application that streamlines day-to-day business operations.',
    points: [
      'Develop and maintain an ERP (Enterprise Resource Planning) web application',
      'Build responsive, reusable React.js components for ERP modules, forms and data views',
      'Integrate the React.js frontend with backend services through RESTful APIs for reliable data flow',
      'Debug across the frontend and backend, and collaborate on new features and maintenance',
    ],
    stack: ['React.js', 'JavaScript', 'RESTful APIs'],
  },
  {
    company: 'Sheryians Coding School',
    role: 'Web Developer Intern',
    period: 'Dec 2025 — Feb 2026',
    summary: 'Full-stack web development internship — building, optimising and animating real websites.',
    points: [
      'Built multiple full-stack websites with React.js, Tailwind CSS, Node.js and Express.js',
      'Optimised websites for performance and responsiveness across devices',
      'Implemented interactive web animations',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
  },
  {
    company: 'Sheryians Coding School',
    role: 'Technical Content Creator',
    period: 'Dec 2025 — Feb 2026',
    summary: 'Creating technical content on web development for a developer audience.',
    points: [
      'Created technical content on web development',
      'Explained complex programming concepts clearly for developers',
    ],
    stack: ['Web Development', 'JavaScript', 'Teaching'],
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
