/**
 * NexMeet Database Seeder
 * Creates realistic test data for development
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// ─────────────────────────────────────────────────────────────────────────────
// Reference Data
// ─────────────────────────────────────────────────────────────────────────────

const networkingIntentOptions = [
  { value: 'meet_people', label: 'Meet new people', icon: '🤝', sortOrder: 1 },
  { value: 'learn', label: 'Learn from others', icon: '📚', sortOrder: 2 },
  { value: 'find_mentor', label: 'Find a mentor', icon: '🧑‍🏫', sortOrder: 3 },
  { value: 'career_opportunities', label: 'Explore career opportunities', icon: '💼', sortOrder: 4 },
  { value: 'startup_collaborators', label: 'Find startup collaborators', icon: '🚀', sortOrder: 5 },
  { value: 'research_collaborators', label: 'Find research collaborators', icon: '🔬', sortOrder: 6 },
  { value: 'meet_professionals', label: 'Meet professionals', icon: '👥', sortOrder: 7 },
  { value: 'meet_students', label: 'Meet students', icon: '🎓', sortOrder: 8 },
  { value: 'project_teammates', label: 'Find project teammates', icon: '💻', sortOrder: 9 },
  { value: 'build_network', label: 'Build professional network', icon: '🌐', sortOrder: 10 },
]

const lookingForOptions = [
  { value: 'mentors', label: 'Mentors', description: 'Experienced professionals to guide my career', sortOrder: 1 },
  { value: 'collaborators', label: 'Collaborators', description: 'Partners for projects and ideas', sortOrder: 2 },
  { value: 'teammates', label: 'Project teammates', description: 'People to work with on specific projects', sortOrder: 3 },
  { value: 'internships', label: 'Internship opportunities', description: 'Companies offering internship positions', sortOrder: 4 },
  { value: 'career_connections', label: 'Career connections', description: 'Professional contacts in my field', sortOrder: 5 },
  { value: 'startup_connections', label: 'Startup connections', description: 'Entrepreneurs and startup ecosystem contacts', sortOrder: 6 },
  { value: 'researchers', label: 'Researchers', description: 'Academic and industry researchers', sortOrder: 7 },
  { value: 'professionals', label: 'Industry professionals', description: 'Working professionals in my domain', sortOrder: 8 },
  { value: 'students', label: 'Students', description: 'Fellow students and learners', sortOrder: 9 },
  { value: 'investors', label: 'Investors', description: 'People interested in funding projects', sortOrder: 10 },
]

const skillNames = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL',
  'Machine Learning', 'Data Science', 'AI/ML', 'DevOps', 'Cloud Computing',
  'Project Management', 'Product Management', 'UX/UI Design', 'Graphic Design',
  'Digital Marketing', 'Content Marketing', 'SEO', 'Social Media Marketing',
  'Business Analysis', 'Financial Analysis', 'Accounting', 'Consulting',
  'Leadership', 'Team Management', 'Communication', 'Public Speaking',
  'Research', 'Writing', 'Teaching', 'Mentoring', 'TypeScript', 'Go',
  'Kubernetes', 'Docker', 'AWS', 'Figma', 'TensorFlow', 'PyTorch',
  'Data Analysis', 'Statistics', 'R Programming', 'Entrepreneurship',
]

const interestNames = [
  'Artificial Intelligence', 'Machine Learning', 'Blockchain', 'Cybersecurity',
  'Web Development', 'Mobile Development', 'Data Science', 'Cloud Computing',
  'Startup Ecosystem', 'Entrepreneurship', 'Product Development', 'Innovation',
  'Digital Transformation', 'Fintech', 'Healthtech', 'Edtech', 'Sustainability',
  'Renewable Energy', 'Climate Change', 'Social Impact', 'Leadership',
  'Personal Development', 'Investing', 'Gaming', 'Robotics', 'AI Ethics',
]

// ─────────────────────────────────────────────────────────────────────────────
// Seed Functions
// ─────────────────────────────────────────────────────────────────────────────

async function seedReferenceData() {
  console.log('Seeding reference data...')

  // Networking intent options
  for (const opt of networkingIntentOptions) {
    await prisma.networkingIntentOption.upsert({
      where: { value: opt.value },
      create: opt,
      update: opt,
    })
  }

  // Looking for options
  for (const opt of lookingForOptions) {
    await prisma.lookingForOption.upsert({
      where: { value: opt.value },
      create: opt,
      update: opt,
    })
  }

  // Skills
  for (const name of skillNames) {
    await prisma.skill.upsert({
      where: { name },
      create: { name },
      update: {},
    })
  }

  // Interests
  for (const name of interestNames) {
    await prisma.interest.upsert({
      where: { name },
      create: { name },
      update: {},
    })
  }

  console.log('Reference data seeded.')
}

async function seedUsers() {
  console.log('Seeding users...')

  const password = await bcrypt.hash('password123', 12)

  const usersData = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@nexmeet.com',
      role: 'ADMIN',
      profile: {
        about: 'NexMeet Platform Administrator',
        city: 'Hyderabad',
        jobTitle: 'Platform Admin',
      },
    },
    {
      firstName: 'Arjun',
      lastName: 'Reddy',
      email: 'arjun.reddy@techcorp.com',
      role: 'USER',
      profile: {
        college: null,
        company: 'TechCorp India',
        jobTitle: 'Senior Software Engineer',
        field: 'technology',
        about: 'Passionate about AI and building scalable systems. Love mentoring junior developers.',
        careerGoals: 'Lead AI engineering teams and build impactful products',
        city: 'Hyderabad',
        experienceLevel: 'advanced',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'AWS', 'Node.js'],
        interests: ['Artificial Intelligence', 'Startup Ecosystem', 'Mentoring'],
        networkingIntents: ['find_mentor', 'meet_professionals', 'build_network'],
        lookingFor: ['mentors', 'collaborators'],
      },
    },
    {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@university.edu',
      role: 'USER',
      profile: {
        college: 'IIT Hyderabad',
        company: null,
        jobTitle: 'CS Student & Researcher',
        field: 'technology',
        about: 'CS student interested in AI research and startup opportunities. Always building something.',
        city: 'Hyderabad',
        experienceLevel: 'beginner',
        skills: ['Python', 'AI/ML', 'Research', 'PyTorch', 'Machine Learning'],
        interests: ['Artificial Intelligence', 'Machine Learning', 'Startup Ecosystem'],
        networkingIntents: ['learn', 'research_collaborators', 'career_opportunities'],
        lookingFor: ['mentors', 'researchers', 'startup_connections'],
      },
    },
    {
      firstName: 'Sneha',
      lastName: 'Kulkarni',
      email: 'sneha.k@startup.io',
      role: 'USER',
      profile: {
        college: null,
        company: 'InnovateLab',
        jobTitle: 'Product Manager',
        field: 'business',
        about: 'PM at a health-tech startup. Looking to connect with entrepreneurs and developers.',
        city: 'Pune',
        experienceLevel: 'intermediate',
        skills: ['Product Management', 'Strategy', 'User Research', 'Entrepreneurship'],
        interests: ['Startup Ecosystem', 'Healthtech', 'Product Development'],
        networkingIntents: ['startup_collaborators', 'meet_professionals', 'build_network'],
        lookingFor: ['startup_connections', 'investors', 'collaborators'],
      },
    },
    {
      firstName: 'Karthik',
      lastName: 'Nair',
      email: 'karthik.nair@design.co',
      role: 'USER',
      profile: {
        college: null,
        company: 'DesignStudio',
        jobTitle: 'UX Designer',
        field: 'design',
        about: 'UX Designer passionate about accessible design and delightful user experiences.',
        city: 'Bangalore',
        experienceLevel: 'intermediate',
        skills: ['UX/UI Design', 'Figma', 'User Research', 'Prototyping'],
        interests: ['Web Development', 'Innovation', 'Product Development'],
        networkingIntents: ['meet_professionals', 'project_teammates', 'build_network'],
        lookingFor: ['collaborators', 'teammates', 'career_connections'],
      },
    },
    {
      firstName: 'Meera',
      lastName: 'Iyer',
      email: 'meera.iyer@fintech.com',
      role: 'USER',
      profile: {
        college: null,
        company: 'FinTech Innovations',
        jobTitle: 'Data Scientist',
        field: 'technology',
        about: 'Data scientist working on financial ML models. Love hackathons!',
        city: 'Mumbai',
        experienceLevel: 'intermediate',
        skills: ['Data Science', 'Python', 'Statistics', 'Machine Learning', 'SQL'],
        interests: ['Data Science', 'Fintech', 'Machine Learning'],
        networkingIntents: ['learn', 'project_teammates', 'meet_professionals'],
        lookingFor: ['teammates', 'collaborators', 'career_connections'],
      },
    },
    {
      firstName: 'Rohit',
      lastName: 'Gupta',
      email: 'rohit.gupta@iimb.ac.in',
      role: 'USER',
      profile: {
        college: 'IIM Bangalore',
        company: null,
        jobTitle: 'MBA Student',
        field: 'business',
        about: 'MBA student focusing on tech entrepreneurship and venture building.',
        city: 'Bangalore',
        experienceLevel: 'beginner',
        skills: ['Business Analysis', 'Financial Analysis', 'Consulting', 'Leadership'],
        interests: ['Entrepreneurship', 'Startup Ecosystem', 'Investing'],
        networkingIntents: ['startup_collaborators', 'find_mentor', 'career_opportunities'],
        lookingFor: ['mentors', 'startup_connections', 'investors'],
      },
    },
    // Organizer user
    {
      firstName: 'TechEvents',
      lastName: 'Hyderabad',
      email: 'organizer@techevents.com',
      role: 'ORGANIZER',
      profile: {
        company: 'TechEvents Hyderabad',
        jobTitle: 'Event Organizer',
        city: 'Hyderabad',
        about: 'Organizing tech events across Hyderabad',
      },
    },
    {
      firstName: 'Google',
      lastName: 'DevFest',
      email: 'devfest@google.com',
      role: 'ORGANIZER',
      profile: {
        company: 'Google',
        jobTitle: 'Developer Relations',
        city: 'Hyderabad',
        about: 'Google Developer Groups and DevFest organizers',
      },
    },
    {
      firstName: 'Startup',
      lastName: 'Hub',
      email: 'events@startuphub.in',
      role: 'ORGANIZER',
      profile: {
        company: 'Startup Hub India',
        jobTitle: 'Community Manager',
        city: 'Bangalore',
        about: 'India\'s largest startup community',
      },
    },
  ]

  const createdUsers = []

  for (const userData of usersData) {
    const { profile, ...userFields } = userData
    const { skills, interests, networkingIntents, lookingFor, ...profileFields } = profile || {}

    // Create user
    const user = await prisma.user.upsert({
      where: { email: userFields.email },
      create: { ...userFields, password },
      update: {},
      include: { profile: true },
    })

    if (!user.profile) {
      await prisma.profile.create({ data: { userId: user.id, ...profileFields } })
    }

    const userProfile = await prisma.profile.findUnique({ where: { userId: user.id } })

    // Add skills
    if (skills?.length > 0) {
      await prisma.userSkill.deleteMany({ where: { profileId: userProfile.id } })
      for (const skillName of skills) {
        const skill = await prisma.skill.findUnique({ where: { name: skillName } })
        if (skill) {
          await prisma.userSkill.upsert({
            where: { profileId_skillId: { profileId: userProfile.id, skillId: skill.id } },
            create: { profileId: userProfile.id, skillId: skill.id },
            update: {},
          })
        }
      }
    }

    // Add interests
    if (interests?.length > 0) {
      await prisma.userInterest.deleteMany({ where: { profileId: userProfile.id } })
      for (const interestName of interests) {
        const interest = await prisma.interest.findUnique({ where: { name: interestName } })
        if (interest) {
          await prisma.userInterest.upsert({
            where: { profileId_interestId: { profileId: userProfile.id, interestId: interest.id } },
            create: { profileId: userProfile.id, interestId: interest.id },
            update: {},
          })
        }
      }
    }

    // Add networking intents
    if (networkingIntents?.length > 0) {
      await prisma.userNetworkingIntent.deleteMany({ where: { profileId: userProfile.id } })
      for (const intentValue of networkingIntents) {
        const intent = await prisma.networkingIntentOption.findUnique({ where: { value: intentValue } })
        if (intent) {
          await prisma.userNetworkingIntent.upsert({
            where: { profileId_intentId: { profileId: userProfile.id, intentId: intent.id } },
            create: { profileId: userProfile.id, intentId: intent.id },
            update: {},
          })
        }
      }
    }

    // Add looking for
    if (lookingFor?.length > 0) {
      await prisma.userLookingFor.deleteMany({ where: { profileId: userProfile.id } })
      for (const lfoValue of lookingFor) {
        const lfo = await prisma.lookingForOption.findUnique({ where: { value: lfoValue } })
        if (lfo) {
          await prisma.userLookingFor.upsert({
            where: { profileId_lookingForId: { profileId: userProfile.id, lookingForId: lfo.id } },
            create: { profileId: userProfile.id, lookingForId: lfo.id },
            update: {},
          })
        }
      }
    }

    createdUsers.push(user)
  }

  console.log(`Seeded ${createdUsers.length} users.`)
  return createdUsers
}

async function seedOrganizers(users) {
  console.log('Seeding organizers...')

  const orgUser1 = users.find((u) => u.email === 'organizer@techevents.com')
  const orgUser2 = users.find((u) => u.email === 'devfest@google.com')
  const orgUser3 = users.find((u) => u.email === 'events@startuphub.in')

  const organizers = []

  const org1 = await prisma.organizer.upsert({
    where: { userId: orgUser1.id },
    create: {
      userId: orgUser1.id,
      organizationName: 'TechEvents Hyderabad',
      description: 'Premier tech event organizer in Hyderabad. We host workshops, hackathons, and networking events.',
      website: 'https://techevents.hyd.com',
      email: 'info@techevents.hyd.com',
      city: 'Hyderabad',
      verificationStatus: 'VERIFIED',
    },
    update: {},
  })

  const org2 = await prisma.organizer.upsert({
    where: { userId: orgUser2.id },
    create: {
      userId: orgUser2.id,
      organizationName: 'Google Developer Groups',
      description: 'Official Google Developer Groups organizing DevFest and tech workshops.',
      website: 'https://gdg.community.dev',
      email: 'gdg@google.com',
      city: 'Hyderabad',
      verificationStatus: 'VERIFIED',
    },
    update: {},
  })

  const org3 = await prisma.organizer.upsert({
    where: { userId: orgUser3.id },
    create: {
      userId: orgUser3.id,
      organizationName: 'Startup Hub India',
      description: 'India\'s largest startup community. Connecting founders, investors, and mentors.',
      website: 'https://startuphub.in',
      email: 'events@startuphub.in',
      city: 'Bangalore',
      verificationStatus: 'VERIFIED',
    },
    update: {},
  })

  organizers.push(org1, org2, org3)
  console.log(`Seeded ${organizers.length} organizers.`)
  return organizers
}

async function seedEvents(organizers) {
  console.log('Seeding events...')

  const now = new Date()
  
  // Helper to create a date relative to now
  const daysFromNow = (days, hours = 10) => {
    const d = new Date(now)
    d.setDate(d.getDate() + days)
    d.setHours(hours, 0, 0, 0)
    return d
  }

  const eventsData = [
    // ─── Same Day Events (Tomorrow - test multiple events/day) ───────────────
    {
      title: 'AI/ML Workshop for Beginners',
      description: 'Learn the fundamentals of Artificial Intelligence and Machine Learning with hands-on exercises using Python and TensorFlow. Perfect for students and professionals looking to enter the AI field.',
      category: 'workshop',
      startDateTime: daysFromNow(1, 9),
      endDateTime: daysFromNow(1, 13),
      timezone: 'Asia/Kolkata',
      location: 'IIIT Hyderabad, Gachibowli',
      city: 'Hyderabad',
      area: 'Gachibowli',
      isOnline: false,
      capacity: 100,
      price: 0,
      experienceLevel: 'beginner',
      networkingAvailable: true,
      certificateAvailable: true,
      status: 'PUBLISHED',
      tags: ['AI', 'ML', 'Python', 'Beginners'],
      organizerIdx: 0,
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
    },
    {
      title: 'React Developer Meetup',
      description: 'Monthly meetup for React developers to share knowledge, discuss latest trends, and network. This month\'s focus: React 19 and Server Components.',
      category: 'meetup',
      startDateTime: daysFromNow(1, 11),
      endDateTime: daysFromNow(1, 14),
      timezone: 'Asia/Kolkata',
      location: 'T-Hub, IIIT Hyderabad',
      city: 'Hyderabad',
      area: 'Gachibowli',
      isOnline: false,
      capacity: 50,
      price: 0,
      experienceLevel: 'intermediate',
      networkingAvailable: true,
      certificateAvailable: false,
      status: 'PUBLISHED',
      tags: ['React', 'JavaScript', 'Frontend'],
      organizerIdx: 0,
      skills: ['React', 'JavaScript', 'TypeScript'],
    },
    {
      title: 'Tech Networking Lunch',
      description: 'Join us for a networking lunch with tech professionals from across Hyderabad. Great food, great people, great conversations.',
      category: 'networking',
      startDateTime: daysFromNow(1, 13),
      endDateTime: daysFromNow(1, 15),
      timezone: 'Asia/Kolkata',
      location: 'Cyber Towers, Hitech City',
      city: 'Hyderabad',
      area: 'Hitech City',
      isOnline: false,
      capacity: 80,
      price: 499,
      experienceLevel: 'all',
      networkingAvailable: true,
      certificateAvailable: false,
      status: 'PUBLISHED',
      tags: ['Networking', 'Lunch', 'Tech'],
      organizerIdx: 0,
      skills: [],
    },
    {
      title: 'Cloud Computing Seminar',
      description: 'An evening seminar on cloud computing, DevOps best practices, and multi-cloud strategies by industry experts.',
      category: 'seminar',
      startDateTime: daysFromNow(1, 17),
      endDateTime: daysFromNow(1, 20),
      timezone: 'Asia/Kolkata',
      location: 'Microsoft Office, Gachibowli',
      city: 'Hyderabad',
      area: 'Gachibowli',
      isOnline: false,
      capacity: 150,
      price: 0,
      experienceLevel: 'intermediate',
      networkingAvailable: true,
      certificateAvailable: true,
      status: 'PUBLISHED',
      tags: ['Cloud', 'DevOps', 'AWS'],
      organizerIdx: 1,
      skills: ['Cloud Computing', 'DevOps', 'AWS', 'Docker', 'Kubernetes'],
    },
    // ─── Upcoming Events ─────────────────────────────────────────────────────
    {
      title: 'Google DevFest Hyderabad 2024',
      description: 'The annual Google DevFest is back! Join 1000+ developers for talks on Android, Flutter, Firebase, ML Kit, and Google Cloud. World-class speakers, hands-on codelabs, and amazing networking.',
      category: 'conference',
      startDateTime: daysFromNow(7, 9),
      endDateTime: daysFromNow(7, 18),
      timezone: 'Asia/Kolkata',
      location: 'HICC, Novotel Hyderabad',
      city: 'Hyderabad',
      area: 'Madhapur',
      isOnline: false,
      capacity: 1000,
      price: 0,
      experienceLevel: 'all',
      networkingAvailable: true,
      certificateAvailable: true,
      status: 'PUBLISHED',
      tags: ['Google', 'DevFest', 'Android', 'Flutter', 'Firebase'],
      organizerIdx: 1,
      skills: ['JavaScript', 'Python', 'Machine Learning', 'Cloud Computing'],
    },
    {
      title: 'Startup Pitch Competition',
      description: 'Present your startup idea to a panel of investors and mentors. Win prizes, get funding leads, and connect with the startup ecosystem. 30 startups will compete for ₹5L prize money.',
      category: 'startup',
      startDateTime: daysFromNow(10, 10),
      endDateTime: daysFromNow(10, 17),
      timezone: 'Asia/Kolkata',
      location: 'Startup Hub, Koramangala',
      city: 'Bangalore',
      area: 'Koramangala',
      isOnline: false,
      capacity: 200,
      price: 1000,
      experienceLevel: 'all',
      networkingAvailable: true,
      certificateAvailable: true,
      status: 'PUBLISHED',
      tags: ['Startup', 'Pitch', 'Funding', 'Entrepreneurship'],
      organizerIdx: 2,
      skills: ['Entrepreneurship', 'Business Analysis', 'Public Speaking'],
    },
    {
      title: 'Data Science Bootcamp - 3 Days',
      description: 'Intensive 3-day bootcamp covering data science fundamentals, Python, pandas, scikit-learn, and ML deployment. Hands-on projects, mentorship, and certification.',
      category: 'workshop',
      startDateTime: daysFromNow(14, 9),
      endDateTime: daysFromNow(16, 18),
      timezone: 'Asia/Kolkata',
      location: 'Online',
      city: null,
      area: null,
      isOnline: true,
      onlineUrl: 'https://zoom.us/j/nexmeet-ds-bootcamp',
      capacity: 30,
      price: 4999,
      experienceLevel: 'intermediate',
      networkingAvailable: true,
      certificateAvailable: true,
      status: 'PUBLISHED',
      tags: ['Data Science', 'Python', 'ML', 'Bootcamp', 'Online'],
      organizerIdx: 0,
      skills: ['Data Science', 'Python', 'Statistics', 'Machine Learning', 'R Programming'],
    },
    {
      title: 'UX Design Workshop',
      description: 'A full-day workshop on user experience design principles, Figma, design thinking, and building user-centered products. Suitable for beginners and intermediate designers.',
      category: 'workshop',
      startDateTime: daysFromNow(5, 10),
      endDateTime: daysFromNow(5, 17),
      timezone: 'Asia/Kolkata',
      location: 'Design Hub, Indiranagar',
      city: 'Bangalore',
      area: 'Indiranagar',
      isOnline: false,
      capacity: 40,
      price: 1500,
      experienceLevel: 'beginner',
      networkingAvailable: true,
      certificateAvailable: true,
      status: 'PUBLISHED',
      tags: ['UX', 'Design', 'Figma', 'Workshop'],
      organizerIdx: 2,
      skills: ['UX/UI Design', 'Figma', 'User Research', 'Prototyping'],
    },
    {
      title: 'Web3 & Blockchain Summit',
      description: 'Explore the world of Web3, DeFi, NFTs, and blockchain technology with industry pioneers.',
      category: 'conference',
      startDateTime: daysFromNow(21, 9),
      endDateTime: daysFromNow(22, 18),
      timezone: 'Asia/Kolkata',
      location: 'Taj Vivanta, Mumbai',
      city: 'Mumbai',
      area: 'BKC',
      isOnline: false,
      capacity: 500,
      price: 2499,
      experienceLevel: 'advanced',
      networkingAvailable: true,
      certificateAvailable: false,
      status: 'PUBLISHED',
      tags: ['Web3', 'Blockchain', 'DeFi', 'Crypto'],
      organizerIdx: 2,
      skills: ['Blockchain', 'JavaScript', 'Entrepreneurship'],
    },
    {
      title: 'Python for Data Analysis',
      description: 'Online workshop on using Python for data analysis. Cover pandas, numpy, matplotlib, and seaborn.',
      category: 'webinar',
      startDateTime: daysFromNow(3, 19),
      endDateTime: daysFromNow(3, 21),
      timezone: 'Asia/Kolkata',
      location: 'Online',
      city: null,
      isOnline: true,
      onlineUrl: 'https://meet.google.com/nexmeet-python',
      capacity: 200,
      price: 0,
      experienceLevel: 'beginner',
      networkingAvailable: false,
      certificateAvailable: false,
      status: 'PUBLISHED',
      tags: ['Python', 'Data', 'Online', 'Free'],
      organizerIdx: 1,
      skills: ['Python', 'Data Analysis', 'Statistics'],
    },
    {
      title: 'Career Fair 2024 - Tech Edition',
      description: 'Connect with 50+ top companies hiring for tech roles. Resume reviews, mock interviews, networking sessions with HR managers.',
      category: 'career',
      startDateTime: daysFromNow(30, 10),
      endDateTime: daysFromNow(30, 18),
      timezone: 'Asia/Kolkata',
      location: 'HITEX Exhibition Centre',
      city: 'Hyderabad',
      area: 'Izzathnagar',
      isOnline: false,
      capacity: 2000,
      price: 0,
      experienceLevel: 'all',
      networkingAvailable: true,
      certificateAvailable: false,
      status: 'PUBLISHED',
      tags: ['Career', 'Jobs', 'Hiring', 'Tech'],
      organizerIdx: 0,
      skills: [],
    },
    // ─── Draft Event ──────────────────────────────────────────────────────────
    {
      title: 'Hackathon 2024 (Coming Soon)',
      description: '48-hour hackathon. Build for social impact.',
      category: 'hackathon',
      startDateTime: daysFromNow(60, 9),
      endDateTime: daysFromNow(62, 17),
      timezone: 'Asia/Kolkata',
      location: 'TBD',
      city: 'Hyderabad',
      isOnline: false,
      capacity: 300,
      price: 0,
      experienceLevel: 'all',
      networkingAvailable: true,
      certificateAvailable: true,
      status: 'DRAFT',
      tags: ['Hackathon', 'Social Impact'],
      organizerIdx: 0,
      skills: ['JavaScript', 'Python', 'React'],
    },
    // ─── Past/Completed Events ────────────────────────────────────────────────
    {
      title: 'Tech Conference 2024',
      description: 'Annual technology conference with industry leaders. Covering AI, Cloud, and the future of tech.',
      category: 'conference',
      startDateTime: daysFromNow(-30, 9),
      endDateTime: daysFromNow(-30, 18),
      timezone: 'Asia/Kolkata',
      location: 'Hyderabad International Convention Centre',
      city: 'Hyderabad',
      area: 'Madhapur',
      isOnline: false,
      capacity: 500,
      price: 0,
      experienceLevel: 'all',
      networkingAvailable: true,
      certificateAvailable: true,
      status: 'PUBLISHED',
      tags: ['Tech', 'Conference', 'Annual'],
      organizerIdx: 1,
      skills: ['Leadership', 'Cloud Computing', 'Machine Learning'],
    },
    {
      title: 'Cancelled: React Workshop',
      description: 'This event was cancelled due to unforeseen circumstances.',
      category: 'workshop',
      startDateTime: daysFromNow(2, 14),
      endDateTime: daysFromNow(2, 17),
      timezone: 'Asia/Kolkata',
      location: 'Tech Park, Hyderabad',
      city: 'Hyderabad',
      isOnline: false,
      capacity: 30,
      price: 0,
      experienceLevel: 'intermediate',
      networkingAvailable: false,
      certificateAvailable: false,
      status: 'CANCELLED',
      tags: ['React', 'Cancelled'],
      organizerIdx: 0,
      skills: ['React', 'JavaScript'],
    },
  ]

  const createdEvents = []

  for (const eventData of eventsData) {
    const { skills, organizerIdx, ...fields } = eventData
    const organizer = organizers[organizerIdx]

    const event = await prisma.event.create({
      data: {
        ...fields,
        organizerId: organizer.id,
      },
    })

    // Add skills
    if (skills.length > 0) {
      for (const skillName of skills) {
        const skill = await prisma.skill.findUnique({ where: { name: skillName } })
        if (skill) {
          await prisma.eventSkill.upsert({
            where: { eventId_skillId: { eventId: event.id, skillId: skill.id } },
            create: { eventId: event.id, skillId: skill.id },
            update: {},
          })
        }
      }
    }

    // Add certificate for events that have it
    if (fields.certificateAvailable && fields.status === 'PUBLISHED') {
      await prisma.eventCertificate.upsert({
        where: { eventId: event.id },
        create: {
          eventId: event.id,
          issuedBy: organizer.organizationName,
          certificateType: 'completion',
          skillsCovered: skills.slice(0, 3),
          eligibility: 'Attend the full event and complete any required assessments.',
          isPaid: false,
          deliveryMethod: 'after_attending',
          additionalInfo: 'Certificate will be emailed within 5 business days.',
        },
        update: {},
      })
    }

    createdEvents.push(event)
  }

  console.log(`Seeded ${createdEvents.length} events.`)
  return createdEvents
}

async function seedRegistrations(users, events) {
  console.log('Seeding registrations...')

  const nonOrgUsers = users.filter((u) => u.role === 'USER')
  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED')

  let count = 0
  for (const user of nonOrgUsers) {
    // Register each user for 2-4 random events
    const numEvents = Math.floor(Math.random() * 3) + 2
    const shuffled = publishedEvents.sort(() => Math.random() - 0.5)
    const toRegister = shuffled.slice(0, numEvents)

    for (const event of toRegister) {
      await prisma.eventRegistration.upsert({
        where: { userId_eventId: { userId: user.id, eventId: event.id } },
        create: { userId: user.id, eventId: event.id, status: 'REGISTERED' },
        update: {},
      })
      count++
    }
  }

  console.log(`Seeded ${count} registrations.`)
}

async function seedCommunityPosts(users, events) {
  console.log('Seeding community posts...')

  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED').slice(0, 3)
  const nonOrgUsers = users.filter((u) => u.role === 'USER')

  for (const event of publishedEvents) {
    // Create community
    const community = await prisma.community.upsert({
      where: { eventId: event.id },
      create: {
        eventId: event.id,
        name: `${event.title} Community`,
        description: `Official community for ${event.title}. Share updates, questions, and connect with other attendees.`,
      },
      update: {},
    })

    // Add posts
    const posts = [
      `Excited for ${event.title}! Anyone else attending?`,
      'What should we prepare beforehand? Any prerequisites?',
      'Is there parking available near the venue?',
      'Looking forward to the networking session. Will there be breakout rooms?',
    ]

    for (let i = 0; i < Math.min(posts.length, nonOrgUsers.length); i++) {
      const post = await prisma.communityPost.create({
        data: {
          communityId: community.id,
          authorId: nonOrgUsers[i].id,
          content: posts[i],
        },
      })

      // Add a comment to first post
      if (i === 0 && nonOrgUsers.length > 1) {
        await prisma.communityComment.create({
          data: {
            postId: post.id,
            authorId: nonOrgUsers[1].id,
            content: 'Yes! Super excited. See you there! 🎉',
          },
        })
      }
    }
  }

  console.log('Community posts seeded.')
}

async function seedNotifications(users) {
  console.log('Seeding notifications...')

  const nonAdminUsers = users.filter((u) => u.role === 'USER')

  for (const user of nonAdminUsers.slice(0, 3)) {
    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          type: 'REGISTRATION_CONFIRMED',
          title: 'Registration Confirmed',
          message: 'You are registered for "AI/ML Workshop for Beginners"!',
          relatedEntityType: 'EVENT',
          actionUrl: '/events/1',
          isRead: false,
        },
        {
          userId: user.id,
          type: 'CONNECTION_REQUEST',
          title: 'New Connection Request',
          message: 'Arjun Reddy wants to connect with you.',
          relatedEntityType: 'USER',
          actionUrl: '/networking',
          isRead: true,
        },
      ],
    })
  }

  console.log('Notifications seeded.')
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Seed Function
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 Starting NexMeet database seed...\n')

  await seedReferenceData()
  const users = await seedUsers()
  const organizers = await seedOrganizers(users)
  const events = await seedEvents(organizers)
  await seedRegistrations(users, events)
  await seedCommunityPosts(users, events)
  await seedNotifications(users)

  console.log('\n✅ NexMeet database seeded successfully!\n')
  console.log('Test accounts:')
  console.log('  Admin:     admin@nexmeet.com / password123')
  console.log('  User:      arjun.reddy@techcorp.com / password123')
  console.log('  Organizer: organizer@techevents.com / password123')
  console.log('')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
