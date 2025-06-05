import { Job, JobType, ExperienceLevel } from '../model/job.model';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'We are seeking a skilled Frontend Developer to join our team. You will be responsible for implementing visual elements and user interactions that users see and interact with in a web application.',
    responsibilities: 'Build responsive and interactive user interfaces, implement UI components, collaborate with designers and backend developers, optimize application performance.',
    qualifications: 'Bachelor\'s degree in Computer Science or related field, strong JavaScript knowledge, and experience with modern frontend frameworks.',
    companyName: 'TechSolutions Inc.',
    location: 'Paris, France',
    jobType: JobType.FULL_TIME,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 45000,
    salaryMax: 70000,
    requirements: [
      'Proficient in HTML, CSS, and JavaScript',
      '3+ years of experience with Angular',
      'Understanding of responsive design principles',
      'Knowledge of RESTful APIs and how to connect to them'
    ],
    benefits: [
      'Health insurance',
      'Flexible working hours',
      'Remote work options',
      'Professional development budget'
    ],
    createdAt: new Date('2023-10-01')
  },
  {
    id: '2',
    title: 'Backend Developer',
    description: 'Looking for a talented Backend Developer to design, build, and maintain efficient, reusable, and reliable server-side code.',
    responsibilities: 'Develop and maintain backend services, design and implement database schemas, optimize application performance, write clean and maintainable code.',
    qualifications: 'Bachelor\'s degree in Computer Science, 5+ years of backend development experience, strong knowledge of Java and Spring ecosystem.',
    companyName: 'DataWorks',
    location: 'Lyon, France',
    jobType: JobType.FULL_TIME,
    experienceLevel: ExperienceLevel.SENIOR,
    salaryMin: 60000,
    salaryMax: 90000,
    requirements: [
      'Strong proficiency in Java, Spring Framework',
      'Experience with database design and ORM technologies',
      'Knowledge of API design and development',
      'Understanding of server-side templating languages'
    ],
    benefits: [
      'Competitive salary',
      '25 days annual leave',
      'Company pension scheme',
      'Gym membership'
    ],
    createdAt: new Date('2023-09-28')
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    description: 'We are looking for a UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills, and be able to translate high-level requirements into interaction flows.',
    responsibilities: 'Create wireframes, prototypes, and user flows, conduct user research, collaborate with developers, ensure design consistency across platforms.',
    qualifications: 'Degree in Design, Human-Computer Interaction, or related field, portfolio demonstrating UX/UI capabilities, experience with design tools.',
    companyName: 'CreativeMinds',
    location: 'Marseille, France',
    jobType: JobType.CONTRACT,
    experienceLevel: ExperienceLevel.JUNIOR,
    salaryMin: 35000,
    salaryMax: 50000,
    requirements: [
      'Portfolio demonstrating UX/UI design capabilities',
      'Experience with Figma, Sketch, or Adobe XD',
      'Understanding of user-centered design principles',
      'Ability to work with cross-functional teams'
    ],
    benefits: [
      'Flexible schedule',
      'Modern office space',
      'Team building events',
      'Career advancement opportunities'
    ],
    createdAt: new Date('2023-10-05')
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    description: 'Seeking a DevOps Engineer to automate and streamline our operations and processes. Build and maintain tools for deployment, monitoring and operations.',
    responsibilities: 'Implement CI/CD pipelines, manage cloud infrastructure, automate deployment processes, monitor system performance and troubleshoot issues.',
    qualifications: 'Bachelor\'s degree in Computer Science or equivalent, 5+ years of DevOps experience, strong knowledge of cloud platforms and containerization.',
    companyName: 'CloudNative Ltd',
    location: 'Bordeaux, France',
    jobType: JobType.FULL_TIME,
    experienceLevel: ExperienceLevel.SENIOR,
    salaryMin: 65000,
    salaryMax: 95000,
    requirements: [
      'Experience with AWS, Docker, and Kubernetes',
      'Strong knowledge of CI/CD pipelines',
      'Familiarity with infrastructure as code tools like Terraform',
      'Scripting skills (Python, Bash)'
    ],
    benefits: [
      'Remote-first culture',
      'Unlimited PTO',
      'Latest hardware',
      'Conference budget'
    ],
    createdAt: new Date('2023-09-15')
  },
  {
    id: '5',
    title: 'Data Scientist',
    description: 'Join our data team to extract and interpret meaning from data using a variety of machine learning tools and techniques.',
    responsibilities: 'Develop machine learning models, analyze large datasets, create data visualizations, collaborate with stakeholders to identify business opportunities.',
    qualifications: 'Advanced degree in Statistics, Mathematics, Computer Science or related field, proficiency in Python, experience with machine learning libraries.',
    companyName: 'AnalyticsPro',
    location: 'Nice, France',
    jobType: JobType.PART_TIME,
    experienceLevel: ExperienceLevel.MID_LEVEL,
    salaryMin: 50000,
    salaryMax: 75000,
    requirements: [
      'Strong background in statistics and mathematics',
      'Experience with Python and data libraries (Pandas, NumPy)',
      'Knowledge of machine learning algorithms',
      'Data visualization skills'
    ],
    benefits: [
      'Flexible working hours',
      'Professional development opportunities',
      'Collaborative work environment',
      'Performance bonuses'
    ],
    createdAt: new Date('2023-10-10')
  }
];
