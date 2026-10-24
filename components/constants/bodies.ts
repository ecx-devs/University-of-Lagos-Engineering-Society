
import { CURRENT_ACADEMIC_SESSION } from './sites';


export interface AssociationPresident {
  name: string;
  title: string;
  academicYear: string;
}

export interface AssociationMetric {
  label: string;
  value: string;
  description?: string;
}

export interface AssociationEvent {
  name: string;
  description: string;
}

export interface AssociationBody {
  id: number;
  slug: string;
  name: string;
  acronym: string;
  tagline: string;
  type: 'departmental' | 'sub-bodies';
  typeLabel: string;
  imageSrc: string;
  imageWidth: number | null;
  imageHeight: number | null;
  body: string;
  president: AssociationPresident;
  memberCount: string;
  establishedYear: string;
  departmentAffiliation: string;
  mottoOrVision: string;
  keyHighlights: AssociationMetric[];
  flagshipEvents: AssociationEvent[];
  focusAreas: string[];
  contactEmail: string;
  contactPhone?: string;
  coChair?: string;
  headOfDepartment?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  alternateNames?: string[];
  aliases?: string[];
}

export const DEPARTMENTAL_BODIES: AssociationBody[] = [
  {
    id: 0,
    slug: 'ases',
    imageSrc: '/associations/ases.png',
    imageWidth: null,
    imageHeight: null,
    name: 'ASES Unilag',
    acronym: 'ASES',
    tagline: 'Association of Systems Engineering Students',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1973 (Chartered 2000)',
    memberCount: '450+ Active Students',
    departmentAffiliation: 'Department of Systems Engineering',
    mottoOrVision: 'Optimization, Cybernetics & Indigenous Intelligence',
    president: {
      name: 'Eva Chiku Isani',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1973', description: 'Chartered as department in 2000' },
      { label: 'Current Members', value: '450+', description: 'Across all undergraduate levels' },
      { label: 'Current President', value: 'Eva Chiku Isani', description: '2025/2026 Academic Session' },
      { label: 'Research Hub', value: 'AIRLAB', description: 'Artificial Intelligence & Robotics Lab' },
    ],
    flagshipEvents: [
      {
        name: 'Synergy Conference',
        description: 'Flagship annual conference convening founders, AI researchers, and systems innovators.',
      },
      {
        name: 'Acada Talks Series',
        description: 'High-impact academic mentorship and peer tutoring workshops for engineering rigor.',
      },
      {
        name: 'Impact Youth Outreach',
        description: 'STEM community enablement program teaching robotics and automation in secondary schools.',
      },
      {
        name: 'ASES / SEES Games',
        description: 'Annual inter-departmental sports and networking tournament fostering faculty solidarity.',
      },
    ],
    focusAreas: [
      'Artificial Intelligence & Robotics',
      'Control Systems & Cybernetics',
      'Operations Research',
      'Simulation & Mathematical Modeling',
      'Industrial Systems Optimization',
    ],
    contactEmail: 'ases.unilagengineering@gmail.com',
    socials: {
      instagram: 'https://instagram.com/ases_unilag',
      twitter: 'https://x.com/ases_unilag',
      linkedin: 'https://linkedin.com/company/ases-unilag',
    },
    body:
      'Originally founded as the Engineering Analysis unit in 1973 and chartered as a full department in 2000, Systems Engineering is an inherently interdisciplinary field synthesizing AI, robotics, control systems, and operations research. The department houses the renowned Artificial Intelligence and Robotics Laboratory (AIRLAB), where students routinely build autonomous systems that win national design awards.\n\n' +
      'The Association of Systems Engineering Students (ASES) is a hyper-organized student body currently led (2025/2026) by President Eva Chiku Isani. ASES runs a massive portfolio of events: the "Acada Talks" series for mentorship, the Impact Youth Outreach, the inter-departmental ASES/SEES Games, and its flagship "Synergy" conference. Systems Engineering demands extreme academic rigor, famously producing legends like Omotuyi Oyindamola, who graduated with a flawless 5.00 CGPA in 2016. By mastering both cybernetics and industrial management, ASES members are uniquely poised to optimize national logistics and lead the AI revolution.',
  },
  {
    id: 1,
    slug: 'bmesa',
    imageSrc: '/associations/bmesa.png',
    imageWidth: null,
    imageHeight: null,
    name: 'BMESA Unilag',
    acronym: 'BMESA',
    tagline: "Biomedical Engineering Students' Association",
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '2022',
    memberCount: '116 Active Students',
    departmentAffiliation: 'Department of Biomedical Engineering',
    mottoOrVision: 'Ancoras Vitae Cudebat (Forging the anchors of life)',
    president: {
      name: 'Favour Adebayo',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2022', description: 'Student association of Biomedical Engineering' },
      { label: 'Active Members', value: '116', description: 'Undergraduates across Year 2 to Year 5' },
      { label: 'Current President', value: 'Favour Adebayo', description: '2025/2026 Academic Session' },
      { label: 'Flagship Summit', value: 'BioDrive', description: '300+ students & nationwide BME innovators' },
    ],
    flagshipEvents: [
      {
        name: 'BioDrive Summit',
        description: 'Flagship innovation summit bringing together about 300 students and biomedical engineering experts from across Nigeria for knowledge sharing, a student pitching competition, and recognition of key figures in the BME community.',
      },
      {
        name: 'BMESA Games',
        description: 'Annual departmental sports championship where students from every level compete, promoting athletic excellence and inter-level unity.',
      },
      {
        name: 'BMESA Hub & Masterclasses',
        description: 'Structured learning delivered through cohort classes and online sessions with medical device experts, sharing scholarships, hackathons, and BME industry updates.',
      },
      {
        name: 'World BME Day Community Outreach',
        description: 'STEM community outreach to public secondary schools on World Biomedical Engineering Day, spreading awareness of biomedical engineering careers.',
      },
      {
        name: 'BMESA Student Welfare & Scholarships',
        description: 'Merit-based scholarship scheme and welfare support created in partnership with industry sponsors to ease financial burdens and reward dedication.',
      },
      {
        name: 'BMESA Socials & Movie Night',
        description: 'Departmental recreational traditions including movie nights, end-of-year Christmas carols, and community bonding outside the classroom.',
      },
    ],
    focusAreas: [
      'Biomechanics & Prosthetics',
      'Medical Device Prototyping',
      'Biomaterials & Tissue Engineering',
      'Diagnostic Medical Imaging',
      'Clinical Engineering Systems',
    ],
    contactEmail: 'bmesaunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/bmesa_unilag',
      twitter: 'https://x.com/bmesa_unilag',
      linkedin: 'https://linkedin.com/company/bmesa-unilag',
    },
    body:
      'BMESA is the student association of the Department of Biomedical Engineering, University of Lagos. It works towards giving students more than a degree: a complete university life and the foundation to become well-rounded biomedical engineers, through innovation, community service, sports, and social life.\n\n' +
      'Driven by its motto "Ancoras Vitae Cudebat (Forging the anchors of life)", BMESA organizes an extensive array of initiatives. Its flagship event, BioDrive, brings together about 300 students and biomedical engineering experts from across Nigeria for knowledge sharing, a student pitching competition, and recognition of key figures in the BME community. The association also powers the BMESA Hub cohort skill classes, secondary school outreaches on World Biomedical Engineering Day, dedicated scholarships in partnership with sponsors, the BMESA Games, webinars with top professionals, and community bonding traditions like Christmas carols and movie nights.',
  },
  {
    id: 2,
    slug: 'cess',
    imageSrc: '/associations/cess.png',
    imageWidth: null,
    imageHeight: null,
    name: 'NICE-SA Unilag',
    acronym: 'NICE-SA',
    tagline: 'Nigerian Institution of Civil Engineers Students\' Affiliate (Civil & Environmental Engineering)',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1964',
    memberCount: '800+ Active Students',
    departmentAffiliation: 'Department of Civil and Environmental Engineering',
    mottoOrVision: 'Unity, Diversity, and Gender Inclusion in Building Resilient Infrastructure',
    president: {
      name: 'Babatunde Oladipo',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1964', description: 'Founding pillar of UNILAG Engineering faculty' },
      { label: 'Apex Affiliation', value: 'NICE & ASCE', description: 'Affiliated with Nigerian apex body & ASCE (USA)' },
      { label: 'Student Support', value: 'Merit Scholarships', description: 'Securing funded opportunities & top-tier internships' },
      { label: 'Core Mission', value: 'Inclusion & STEM', description: 'Empowering women in civil engineering leadership' },
    ],
    flagshipEvents: [
      {
        name: 'National Technical Conferences & Hackathons',
        description: 'Student delegations clinching top laurels, hackathon awards, and research commendations at prestigious national engineering conferences.',
      },
      {
        name: 'Civil Engineering Symposium & Technical Lectures',
        description: 'Major conference exploring sustainable urban infrastructure, mega-city development, and green construction technologies.',
      },
      {
        name: 'Merit-Based Scholarship & Welfare Scheme',
        description: 'Robust student initiative securing funded scholarships to ensure financial constraints never hinder academic excellence.',
      },
      {
        name: 'Field Site Technical Excursions',
        description: 'Guided industrial visits to large-scale infrastructure, deep piling, and structural bridge engineering sites across Lagos.',
      },
      {
        name: 'Women in Civil Engineering Initiative',
        description: 'Mentorship and leadership development programs dedicated to promoting gender inclusion and empowering female engineers in STEM.',
      },
    ],
    focusAreas: [
      'Structural Analysis & Coastal Infrastructure',
      'Geotechnical Engineering & Deep Foundations',
      'Transportation & Highway Systems',
      'Water Resources & Flood Mitigation',
      'Gender Inclusion in STEM & Scholarships',
    ],
    contactEmail: 'nicesaunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/nicesa_unilag',
      twitter: 'https://x.com/nicesa_unilag',
      linkedin: 'https://linkedin.com/company/nicesa-unilag',
    },
    aliases: ['cess', 'cess-unilag', 'nice-sa', 'nicesa', 'nicesa-unilag', 'civil-engineering', 'civil'],
    body:
      'Founded alongside one of Nigeria\'s pioneer engineering faculties at the University of Lagos in 1964, the Department of Civil and Environmental Engineering has consistently served as an epicenter of technical brilliance and infrastructural innovation. As the Nigerian Institution of Civil Engineers Students\' Affiliate (NICE-SA), UNILAG Chapter, the student body directly links young engineering talent with the apex national civil engineering body, providing unmatched professional credibility and access to industry standards.\n\n' +
      'NICE-SA UNILAG is home to some of the brightest, most resourceful engineering talents in the nation. Its students consistently excel on national stages—clinching top laurels, hackathon awards, and research commendations at prestigious national engineering conferences and technical competitions. Demonstrating global ambition, a significant number of student members are also individually registered with the American Society of Civil Engineers (ASCE), constantly expanding their horizons beyond national borders.\n\n' +
      'The chapter takes immense pride in bridging the gap between classroom theory and real-world impact. Through robust student support initiatives, NICE-SA actively facilitates and secures merit-based scholarship opportunities to ensure financial constraints never hinder academic excellence, while landing undergraduates high-value internship placements at top-tier civil engineering, construction, and structural consultancy firms across Nigeria. At the core of its executive vision are Unity, Diversity, and Gender Inclusion in STEM—actively empowering female engineering students and fostering an inclusive community equipped to build the resilient infrastructure of tomorrow.',
  },
  {
    id: 3,
    slug: 'nammes',
    imageSrc: '/associations/nammes.png',
    imageWidth: null,
    imageHeight: null,
    name: 'NAMMES Unilag',
    acronym: 'NAMMES',
    tagline: 'National Association of Metallurgical and Materials Engineering Students',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '2000',
    memberCount: '300+ Active Students',
    departmentAffiliation: 'Department of Metallurgical and Materials Engineering',
    mottoOrVision: 'Reinforcing the Present... innovating the future.',
    president: {
      name: 'Soyemi Eniola',
      title: 'President',
      academicYear: '2026/2027',
    },
    headOfDepartment: 'Prof. Olatunde Israel Sekunowo',
    keyHighlights: [
      { label: 'Department Founded', value: '2000', description: 'Established January 20, 2000' },
      { label: 'Department Population', value: '350+', description: '300+ active scholars & 50+ volunteer community' },
      { label: 'Head of Department', value: 'Prof. O. I. Sekunowo', description: 'Metallurgical & Materials Engineering' },
      { label: 'Chapter President', value: 'Soyemi Eniola', description: 'NAMMES UNILAG (2026/2027 Session)' },
    ],
    flagshipEvents: [
      {
        name: 'Materials Horizon',
        description: 'Flagship conference and seminar convening lecturers, industry leaders, alumni, and students to discuss breakthroughs shaping the materials and engineering sector.',
      },
      {
        name: 'NAMMES Launchpad Series',
        description: 'Industry dialogue initiative bringing corporate engineering professionals closer to students for high-value career conversations and mentorship.',
      },
      {
        name: 'HOD Games & NAMMES Games Festival',
        description: 'Departmental sports and social day dedicated to unwinding, building camaraderie, and competing across athletic tournaments and board games.',
      },
      {
        name: 'Heavy Industry Field Trips',
        description: 'Practical excursions linking classroom theory to manufacturing practice, including plant visits to Beta Glass PLC and Nigerian Foundry Limited.',
      },
      {
        name: 'Student Welfare & Safety Net (Pad Bank & Aid)',
        description: 'Compassionate community support including the NAMMES Pad Bank for female students, School Fees Aid for indigent scholars, and Pulse Friday check-ins.',
      },
      {
        name: 'Academic Tutorials & Inter-Chapter Collaborations',
        description: 'Peer tutorials, digital resources via the NAMMES Hub, and joint technical activities in partnership with ULES ARB and NIMechE UNILAG SF.',
      },
    ],
    focusAreas: [
      'Mineral Processing & Extractive Metallurgy',
      'Physical Metallurgy & Nanotechnology',
      'Materials Development & Advanced Processing',
      'Welding, Foundry Technology & Surface Modification',
      'Corrosion Engineering, Ceramics & Composites',
    ],
    contactEmail: 'unilag.nammes@gmail.com',
    contactPhone: '+234 705 040 9921',
    socials: {
      instagram: 'https://instagram.com/unilag_nammes',
      twitter: 'https://x.com/UNILAG_NAMMES',
      linkedin: 'https://linkedin.com/company/nammes-unilag',
    },
    aliases: [
      'nammes',
      'nammes-unilag',
      'metallurgical-and-materials',
      'materials-engineering',
      'hala-materials',
    ],
    body:
      'The Department of Metallurgical and Materials Engineering is an essential discipline within the Faculty of Engineering, University of Lagos, offering a five-year COREN-accredited B.Sc. alongside postgraduate programmes up to PhD level. Established on January 20, 2000, the department equips graduates with a rigorous engineering education across mineral processing, physical metallurgy, materials processing, welding, surface modification, foundry technology, ceramics, corrosion prevention, composite materials, and nanotechnology.\n\n' +
      'Rallying under the departmental slogan "HALA MATERIALS" and the motto "Reinforcing the Present... innovating the future", the National Association of Metallurgical and Materials Engineering Students (NAMMES) UNILAG Chapter drives an active, future-ready community. Operating with an active digital hub (NAMMES Hub) and newsletter (The NAMMES Communiqué), the chapter hosts flagship programs including the Materials Horizon conference, NAMMES Launchpad Series, HOD Games, industrial plant tours (such as Beta Glass PLC and Nigerian Foundry Limited), peer tutorials with ULES ARB and NIMechE UNILAG SF, and welfare safety nets like the NAMMES Pad Bank and School Fees Aid.',
  },
  {
    id: 4,
    slug: 'nimeche',
    imageSrc: '/associations/nimeche.png',
    imageWidth: null,
    imageHeight: null,
    name: 'NIMechE UNILAG SF',
    acronym: 'NIMechE UNILAG SF',
    tagline: 'Nigerian Institution of Mechanical Engineers UNILAG Student Forum',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1964',
    memberCount: '580+ Active Students',
    departmentAffiliation: 'Department of Mechanical Engineering',
    mottoOrVision: "When it Moves... It's Mechanical",
    president: {
      name: 'Daniel Salau',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1964', description: 'Founded alongside the Faculty of Engineering' },
      { label: 'Active Members', value: '580+', description: 'Undergraduates across all 5 levels ("Motion Family")' },
      { label: 'Current President', value: 'Daniel Salau', description: '2025/2026 Academic Session' },
      { label: 'Global Recognition', value: '1st Place SOFE', description: '12th Nigerian Heat, IMechE Speak Out for Engineering' },
    ],
    flagshipEvents: [
      {
        name: 'NIMechE UNILAG SF Students\' Symposium',
        description: 'Flagship professional development event where students engage with industry leaders, academics, and researchers on emerging engineering trends and AI.',
      },
      {
        name: 'Innovate Local Challenge',
        description: '12-week, multi-phase competition where students design and prototype practical engineering solutions to local problems.',
      },
      {
        name: 'Mechlympics Sports Festival',
        description: 'Flagship annual sports week across all five undergraduate levels (football, basketball, track & field, and board games).',
      },
      {
        name: 'Final Year Project Bootcamp',
        description: 'Bi-weekly webinar collaboration with ULES ARB covering project ideation, literature review, and methodology design.',
      },
      {
        name: "Galentine's Day (Mech-Ladies' Picnic)",
        description: 'Empowerment initiative for female mechanical engineering students to network, share experiences, and build a supportive community.',
      },
      {
        name: 'Industrial Plant Expeditions',
        description: 'Technical tours of leading engineering facilities including JMG Limited, Proforce, Mandilas, and R.T. Briscoe.',
      },
    ],
    focusAreas: [
      'Aerospace & Drone System Design',
      'Automotive Systems & Formula Student',
      'Air-Conditioning & HVAC Engineering',
      'Energy Systems & Sustainable Power',
      'Advanced Manufacturing & Prototyping',
    ],
    contactEmail: 'nimecheunilag@gmail.com',
    contactPhone: '+234 807 275 3822',
    socials: {
      instagram: 'https://instagram.com/nimeche_unilag',
      twitter: 'https://x.com/nimeche_unilag',
      linkedin: 'https://linkedin.com/company/nimeche-unilag',
    },
    aliases: [
      'nimeche',
      'nimeche-unilag',
      'nimeche-sf',
      'nimeche-unilag-sf',
      'nimechesf',
      'mechanical-engineering',
      'motion-family',
    ],
    body:
      'The Department of Mechanical Engineering was founded in 1964 alongside the faculty\'s inception and emphasizes solid mechanics, thermodynamics, machine design, and manufacturing. Its historical trajectory is inextricably linked to the legacy of the late Professor Ayodele Awojobi, whose 1973 invention of the "Autonov 1" (a bi-directional vehicle moving forward and backward using dual steering wheels) established a culture of audacious indigenous innovation.\n\n' +
      'Known affectionately as the "Motion Family," the student body operates officially as the Nigerian Institution of Mechanical Engineers UNILAG Student Forum (NIMechE UNILAG SF) and belongs to both NIMechE and the UK-based Institution of Mechanical Engineers (IMechE). Operating with five technical communities (Aerospace, Automobile, HVAC, Energy, and Manufacturing) and two IMechE clubs (Formula Student Club and Railway Club), the forum bridges academic rigor with world-class engineering practice. UNILAG mechanical engineers routinely distinguish themselves internationally, recently winning first place at the 12th Nigerian Heat of the IMechE Speak Out for Engineering (SOFE) competition.',
  },
  {
    id: 5,
    slug: 'nisgs',
    imageSrc: '/associations/nisgs.png',
    imageWidth: null,
    imageHeight: null,
    name: 'NISGS Unilag',
    acronym: 'NISGS',
    tagline: 'Nigerian Institution of Surveying and Geoinformatics Students',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1972',
    memberCount: '300+ Active Students',
    departmentAffiliation: 'Department of Surveying and Geoinformatics',
    mottoOrVision: 'The Bedrock of Meaningful Development',
    president: {
      name: 'Habeeb Idowu',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1972', description: 'Over five decades of surveying & geomatics excellence' },
      { label: 'Current Members', value: '300+', description: 'Geospatial engineers & researchers' },
      { label: 'Current President', value: 'Habeeb Idowu', description: '2025/2026 Academic Session' },
      { label: 'Flagship Initiative', value: "Survey's Sphere", description: 'Practical equipment & geospatial software training' },
    ],
    flagshipEvents: [
      {
        name: "Survey's Sphere",
        description: 'Practical training initiative exposing students to surveying equipment, geospatial software, and professional techniques (GNSS, DGPS, total station operations, levelling, AutoCAD, ArcGIS, and more), preparing them for industrial training.',
      },
      {
        name: 'Geospatial Innovation Challenge (GIC)',
        description: 'Innovation competition where students apply surveying, geoinformatics, and geospatial technologies to solve practical problems and showcase ideas to professionals and potential sponsors.',
      },
      {
        name: 'HOD Games – Champions in Motion',
        description: 'Departmental sports festival promoting unity, healthy competition, teamwork, and athletic sportsmanship under the official tournament banner "Champions in Motion".',
      },
      {
        name: "Freshers' Orientation",
        description: 'Welcomes newly admitted students and introduces them to the academic, professional, and social environment, including career paths in surveying and geoinformatics.',
      },
      {
        name: 'Academic Research Team (ART) Programmes',
        description: 'Tutorials, departmental quizzes, and academic discussions supporting students\' academic development.',
      },
      {
        name: 'Industrial Excursions & Professional Conferences',
        description: 'Visits to surveying firms, geospatial technology companies, and professional associations, alongside active student participation in national surveying conferences and workshops.',
      },
    ],
    focusAreas: [
      'Land Surveying & Geodesy',
      'Geographic Information Systems (GIS)',
      'Satellite Remote Sensing & Earth Observation',
      'Photogrammetry & Drone Mapping',
      'Hydrographic Surveying & Marine Geodesy',
      'Cartography & Spatial Data Science',
    ],
    contactEmail: 'info.nisgsunilag@gmail.com',
    contactPhone: '09090449004',
    socials: {
      instagram: 'https://instagram.com/nisgs_unilag',
      twitter: 'https://x.com/nisgs_unilag',
      linkedin: 'https://linkedin.com/company/nisgs-unilag',
    },
    body:
      'The Department of Surveying and Geo-Informatics is committed to giving students the academic knowledge, technical expertise, and practical experience needed to excel in the surveying and geospatial industry. It focuses on the science, technology, and techniques of measuring, mapping, managing, and analysing spatial information about the Earth\'s surface. Fields covered include land surveying, GIS, remote sensing, geodesy, photogrammetry, hydrographic surveying, cartography, and other areas of geomatics.\n\n' +
      'NISGS UNILAG Chapter is the student body representing students in the department. Guided by its motto "The Bedrock of Meaningful Development", it provides a platform for academic development, professional networking, leadership, social interaction, and practical exposure to the profession. Key initiatives include Survey\'s Sphere for hands-on equipment and GIS software mastery, the Geospatial Innovation Challenge (GIC), the HOD Games ("Champions in Motion"), freshers\' orientation, ART academic programs, industrial firm visits, and active participation in professional conferences.',
  },
  {
    id: 6,
    slug: 'nsche',
    imageSrc: '/associations/nsche.png',
    imageWidth: null,
    imageHeight: null,
    name: 'NSCHE Unilag',
    acronym: 'NSChE',
    tagline: 'Nigerian Society of Chemical Engineers, UNILAG Students\' Chapter',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1973',
    memberCount: '500+ Active Students',
    departmentAffiliation: 'Department of Chemical Engineering',
    mottoOrVision: 'Promoting Academic Excellence, Technical Competence and Sustainable Value',
    president: {
      name: 'Adeoye David Ayomide',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1973', description: 'Co-founded with the Department of Chemical Engineering' },
      { label: 'Active Members', value: '500+', description: 'Chemical engineering undergraduates (600+ departmental total)' },
      { label: 'Chapter Leadership', value: 'Adeoye David Ayomide', description: '2025/2026 Academic Session' },
      { label: 'Academic Flagship', value: 'Simulate-a-thon & ART', description: 'Process simulation, hackathons, and inter-level quizzes' },
    ],
    flagshipEvents: [
      {
        name: 'Academic Resource Team (ART) Programme',
        description: 'Comprehensive academic initiative featuring departmental quizzes, debates, tutorials, hackathons, and the Simulate-a-thon Grand Finale.',
      },
      {
        name: 'Homecoming x NUEX Entrepreneurship Exposure',
        description: 'Flagship gathering connecting students with alumni, promoting tech entrepreneurship, and showcasing student business ventures.',
      },
      {
        name: 'Industrial Plant Operations Visits',
        description: 'Site excursions exposing undergraduates to plant safety, manufacturing, power generation, and energy process facilities.',
      },
      {
        name: 'Secondary School STEM Outreach',
        description: 'Educational community outreach introducing secondary school students to chemical engineering careers and science experiments.',
      },
      {
        name: 'HOD Games & Chapter Socials',
        description: 'Departmental sports tournament promoting teamwork and healthy competition, alongside recreational traditions like Dice & Decibels.',
      },
    ],
    focusAreas: [
      'Chemical Process Simulation & Computing',
      'Petrochemical Refining & Energy Systems',
      'Industrial Safety & Plant Optimization',
      'Biochemical & Environmental Engineering',
      'Technological Entrepreneurship (NUEX)',
    ],
    contactEmail: 'daviidayomide@gmail.com',
    contactPhone: '08139526858',
    socials: {
      instagram: 'https://instagram.com/nsche_unilag',
      twitter: 'https://x.com/nsche_unilag',
      linkedin: 'https://linkedin.com/company/nsche-unilag',
    },
    body:
      'The Department of Chemical Engineering provides students with the rigorous theoretical foundation, technical knowledge, and practical skills required to solve complex engineering problems across global industrial sectors. The Nigerian Society of Chemical Engineers (NSChE) UNILAG Students\' Chapter is a student-led professional society that actively complements the department\'s academic curriculum.\n\n' +
      'Established in 1973 alongside the department, the chapter promotes academic excellence, technical competence, innovation, entrepreneurship, leadership, professional development, and student welfare. NSChE UNILAG powers structured programs including the Academic Resource Team (ART) with its flagship Simulate-a-thon, the Homecoming x NUEX entrepreneurship expo, tours of major energy and manufacturing plants, and community STEM outreaches inspiring the next generation of engineers.',
  },
  {
    id: 7,
    slug: 'sees',
    imageSrc: '/associations/sees.png',
    imageWidth: null,
    imageHeight: null,
    name: 'SEES Unilag',
    acronym: 'SEES',
    tagline: 'Society of Electrical/Electronics and Computer Engineering Students',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1964',
    memberCount: '1,000+ Active Students',
    departmentAffiliation: 'Department of Electrical & Electronics Engineering',
    mottoOrVision: 'Fostering Academic Excellence, Technical Innovation & Global Leadership',
    president: {
      name: 'Oluwaseun Davies',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1964', description: 'Founding departmental pillar of ULES' },
      { label: 'Active Members', value: '1,000+', description: 'Electrical, electronics & computer engineering scholars' },
      { label: 'Current President', value: 'Oluwaseun Davies', description: '2025/2026 Academic Session' },
      { label: 'Global Talent Pipeline', value: 'Top Tech & Finance', description: 'Placements at Meta, Bloomberg, Palantir, Goldman Sachs, Nvidia' },
    ],
    flagshipEvents: [
      {
        name: 'SEES Light Up Conference',
        description: 'Flagship end-of-session conference with industry and lecturer panel discussions, debate competitions, project quizzes, and awards.',
      },
      {
        name: 'SEES Week Celebration',
        description: 'Week-long celebration featuring Tech Hub Day, Innovation Hub Day, Health & Wellness Day, Career Fair Day, and Alumni Homecoming.',
      },
      {
        name: 'SEES Financial Conference',
        description: 'Financial literacy summit equipping engineering students with wealth management skills, expert talks, and fintech hackathons.',
      },
      {
        name: 'SEES Sports Festival (The HOD Games)',
        description: 'Inter-level sports championship featuring football, basketball, chess, scrabble, and athletics ending with a gala awards ceremony.',
      },
      {
        name: 'SEES Alumni Talks & Mentorship',
        description: 'Mentorship series connecting undergraduates directly with alumni working across global technology and engineering firms.',
      },
      {
        name: 'Community Welfare & STEM Outreaches',
        description: 'Student support initiatives including the SEES Food Drive, SEES Iftar, and pre-university secondary school STEM spelling bees.',
      },
    ],
    focusAreas: [
      'Software Engineering, Cloud & AI/ML (Tech Hub)',
      'Hardware Prototyping & Chip Architecture (Innovation Hub)',
      'Power Systems & Renewable Microgrids',
      'Embedded Firmware & Telecommunications',
      'Debates, Storytelling & Pitch Delivery',
    ],
    contactEmail: 'theseesunilagofficial@gmail.com',
    contactPhone: '+234 813 036 7033 / +234 704 915 8123',
    socials: {
      instagram: 'https://instagram.com/sees_unilag',
      twitter: 'https://x.com/sees_unilag',
      linkedin: 'https://linkedin.com/company/sees-unilag',
    },
    body:
      'SEES is a student organization dedicated to fostering academic excellence, technical innovation, and professional leadership across Electrical, Electronics, and Computer Engineering. To give students practical experience beyond classroom theory, it operates distinct specialized sub-bodies: the SEES Innovation Hub (hardware engineering and physical prototyping), the SEES Tech Hub (software engineering, product design, AI/ML, and scalable digital systems), and the SEES Debates & Pitching Society (public speaking, storytelling, and venture pitch delivery).\n\n' +
      'Students in the department consistently dominate collegiate hackathons and technical competitions across Nigeria. SEES also serves as a direct talent pipeline to global industry, with undergraduates and alumni regularly securing competitive internships and full-time engineering positions at world-class organisations such as Meta, Bloomberg, Palantir, Goldman Sachs, Nvidia, and Femto-ST.',
  },
  {
    id: 8,
    slug: 'spe',
    imageSrc: '/associations/spe.png',
    imageWidth: null,
    imageHeight: null,
    name: 'SPE Unilag',
    acronym: 'SPE',
    tagline: 'Society of Petroleum Engineers (Petroleum and Gas Engineering)',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '2001 (Dept. Chartered 2024)',
    memberCount: '309+ Active Students',
    departmentAffiliation: 'Department of Petroleum and Gas Engineering',
    mottoOrVision: 'To be a top class institution for the pursuit of excellence in knowledge, character and service to humanity.',
    president: {
      name: 'Samuel Akpu Uko',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Programme Founded', value: '2001', description: 'Established 2001; department unbundled July 2024' },
      { label: 'Total Population', value: '336', description: '309 undergraduates across levels & 27 staff members' },
      { label: 'Head of Department', value: 'Dr. O. O. Olamigoke', description: 'Petroleum & Gas Engineering' },
      { label: 'Chapter President', value: 'Samuel Akpu Uko', description: 'SPE UNILAG Student Chapter (2025/2026)' },
    ],
    flagshipEvents: [
      {
        name: 'The Service Provider Handshake',
        description: 'Bi-monthly webinars (Fridays, 11:00 AM to 12:00 PM) connecting students and researchers directly with energy service providers and industry operators.',
      },
      {
        name: 'HOD Games',
        description: 'Departmental sports festival bringing together students and staff in healthy competition and solidarity (December 14th to 18th, 2026).',
      },
      {
        name: 'Industry and Career Fair',
        description: 'Premier networking and recruitment expo connecting undergraduates with top exploration, production, and energy firms (March 18th, 2027).',
      },
      {
        name: 'Student Technical Conference (STC) & Petroquiz',
        description: 'Collegiate technical conference featuring high-stakes Petroquiz battles, paper competitions, and national SPE delegations.',
      },
    ],
    focusAreas: [
      'Reservoir Engineering & Simulation',
      'Drilling & Well Completion Engineering',
      'Natural Gas Monetization & LNG Logistics',
      'Energy Transition, CCUS & Geothermal',
      'Petroleum Economics & Asset Management',
    ],
    contactEmail: 'hodpetandgasengrg@unilag.edu.ng',
    contactPhone: '08034969018',
    headOfDepartment: 'Dr. O. O. Olamigoke',
    socials: {
      instagram: 'https://instagram.com/spe_unilag',
      twitter: 'https://x.com/spe_unilag',
      linkedin: 'https://linkedin.com/company/spe-unilag',
    },
    aliases: ['petroleum-and-gas', 'petgas', 'petroleum-engineering', 'spe-unilag'],
    body:
      'The Petroleum and Gas Engineering programme was established in the 2001/2002 session within the Department of Chemical and Petroleum Engineering (established 1973), with an intake of nineteen students for the five-year B.Sc. (Honours) degree. The pioneering set graduated in 2006/2007. The degree takes five sessions after SSSC O-level or four sessions after GCE A-level. For the last eight years, the department has admitted students from the UNILAG Diploma II (Foundation) Programme into the second year. Yearly intake averages fifty. The programme is officially recognised by COREN and accredited by the NUC. On 3rd July 2024, the NUC approved the unbundling of the Department of Chemical and Petroleum Engineering into the Department of Chemical Engineering and the Department of Petroleum and Gas Engineering. Dr. O. A. Adeyanju became the pioneer head of the department thereafter, followed by Dr. O. O. Olamigoke.\n\n' +
      'Vision: To be a top class institution for the pursuit of excellence in knowledge, character and service to humanity. Mission: To provide a conducive environment for teaching, learning, research and development, where staff interact seamlessly with students to foster effective competition and collaboration with their counterparts globally. With an active population of 336 (309 students and 27 staff as of September 2026), the department and the Society of Petroleum Engineers (SPE) UNILAG Chapter host flagship programs including "The Service Provider Handshake" bi-monthly webinars, the annual HOD Games, the Industry and Career Fair, and acclaimed student delegations at national and international energy conferences.',
  },
];

export const SUB_BODIES: AssociationBody[] = [
  {
    id: 0,
    slug: 'arb',
    imageSrc: '/associations/arb.png',
    imageWidth: 300,
    imageHeight: 107,
    name: 'ULES ARB',
    acronym: 'ARB',
    tagline: 'ULES Academic and Research Board',
    type: 'sub-bodies',
    typeLabel: 'ULES Sub-Body',
    establishedYear: '2018',
    memberCount: '85+ Active Tutors & Researchers',
    departmentAffiliation: 'Faculty of Engineering (ULES Secretariat)',
    mottoOrVision: 'Excellence in Intellect, Rigor in Undergraduate Research',
    president: {
      name: 'Chinedu Ebere',
      title: 'Director of Academic Affairs',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2018', description: 'Established as faculty academic board' },
      { label: 'Active Board Members', value: '85+', description: 'Peer tutors, researchers, and directors' },
      { label: 'Board Director', value: 'Chinedu Ebere', description: 'Director of Academic Affairs' },
      { label: 'Annual Reach', value: '6,000+ Students', description: 'Benefiting from free semester tutorials' },
    ],
    flagshipEvents: [
      {
        name: 'Faculty Exam Preparation Bootcamps',
        description: 'Comprehensive, multi-week revision tutorials covering 100L through 300L engineering foundation courses.',
      },
      {
        name: 'Inter-Departmental Academic Quiz',
        description: 'High-stakes battle of the brains testing cross-disciplinary math, physics, and engineering theory.',
      },
      {
        name: 'Undergraduate Research Mentorship Scheme',
        description: 'Pairing ambitious student researchers with faculty laboratory supervisors and publication advisers.',
      },
    ],
    focusAreas: [
      'Peer Academic Mentorship & Tutoring',
      'Faculty Exam Archive & Past Questions',
      'Undergraduate Research Support',
      'Cross-Disciplinary STEM Competitions',
      'Academic Survival & CGPA Coaching',
    ],
    contactEmail: 'arb.unilagengr@gmail.com',
    socials: {
      instagram: 'https://instagram.com/ules_arb',
      twitter: 'https://x.com/ules_arb',
      linkedin: 'https://linkedin.com/company/ules-arb',
    },
    body:
      'The Academic & Research Board of the University of Lagos Engineering Society (ULES ARB) is the intellectual engine of the Faculty of Engineering. Formed in 2018 under the auspices of ULES, ARB is charged with safeguarding academic excellence, providing peer mentorship, and fostering competitive undergraduate research across all engineering disciplines.\n\n' +
      'Operating with a mission to eliminate academic failure and stimulate high-impact scholarship, the Board orchestrates extensive semester-long tutorial programs, comprehensive archive libraries of past examination questions, and exam preparation masterclasses. Beyond foundational coursework, ARB organizes the prestigious Faculty-Wide Academic Quiz and matches ambitious undergraduates with faculty mentors and research laboratories, equipping students to publish in national and international journals and dominate collegiate STEM competitions.',
  },
  {
    id: 1,
    slug: 'ecx',
    imageSrc: '/associations/ecx.png',
    imageWidth: 216,
    imageHeight: 135,
    name: 'ECX',
    acronym: 'ECX',
    tagline: 'Engineering Career Expo',
    type: 'sub-bodies',
    typeLabel: 'ULES Sub-Body',
    establishedYear: '2019',
    memberCount: '1,500+ Community Fellows',
    departmentAffiliation: 'Faculty of Engineering (ULES Secretariat)',
    mottoOrVision: 'To bridge the gap between students and the industry.',
    president: {
      name: 'Tobi Olaniyan',
      title: 'Lead Convener',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2019', description: 'Founded to bridge the academic-industry gap' },
      { label: 'Community Size', value: '1,500+', description: 'Engineers, developers, and tech builders' },
      { label: 'Lead Convener', value: 'Tobi Olaniyan', description: '2025/2026 Academic Session' },
      { label: 'Industry Partners', value: '25+ Tech Firms', description: 'Recruiting engineering students directly' },
    ],
    flagshipEvents: [
      {
        name: 'HackX National Hackathon',
        description: '72-hour student hackathon building scalable fintech, clean tech, and infrastructure software.',
      },
      {
        name: '30 Days of Code & Design Bootcamp',
        description: 'Intensive annual bootcamps training students in modern software engineering, product design, and cloud ops.',
      },
      {
        name: 'Annual ECX Career Expo & Job Fair',
        description: 'Flagship recruiting expo connecting undergraduates directly with venture capital firms and tech employers.',
      },
    ],
    focusAreas: [
      'Full-Stack Software Engineering',
      'UI/UX & Product Design',
      'Cloud Architecture & DevOps',
      'Tech Career Mentorship & Placement',
      'Startup Pitch Competitions',
    ],
    contactEmail: 'ecxunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/ecx_unilag',
      twitter: 'https://x.com/ecx_unilag',
      linkedin: 'https://linkedin.com/company/ecx-unilag',
    },
    body:
      'Engineering Career Expo (ECX) is a student-led organization operating under the supervision of the University of Lagos Engineering Society (ULES). Guided by its motto "To bridge the gap between students and the industry", our primary goal is to bridge the gap between students and the industry by providing technical and soft skills training. We aim to make students job-ready, foster their interest in technology, and equip them with a strong foundation for further personal and professional development.\n\n' +
      'Through initiatives like "HackX" — an intense 72-hour national hackathon, the "ECX 30 Days of Code & Design" bootcamps, and executive networking mixers, ECX has trained over 1,500 students in software engineering, UI/UX design, cloud infrastructure, and product management. ECX routinely partners with top venture capital funds, corporate accelerators, and African unicorns, facilitating internships, job placements, and seed investment for student-led startups.',
  },
  {
    id: 2,
    slug: 'eli',
    imageSrc: '/associations/eli.png',
    imageWidth: 207,
    imageHeight: 200,
    name: 'ELI',
    acronym: 'ELI',
    tagline: 'Engineering Ladies Initiative',
    type: 'sub-bodies',
    typeLabel: 'ULES Sub-Body',
    establishedYear: '2014',
    memberCount: '420+ Active Female Engineers',
    departmentAffiliation: 'Faculty of Engineering (ULES Secretariat)',
    mottoOrVision: 'Government for the girls, by the girls and with the girls',
    president: {
      name: 'Ifeoluwa Adeleke',
      title: 'Executive Director',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2014', description: 'Founded as Engineering Ladies Day, expanded to ELI' },
      { label: 'Active Members', value: '420+', description: 'Undergraduate female engineering leaders' },
      { label: 'Executive Director', value: 'Ifeoluwa Adeleke', description: '2025/2026 Academic Session' },
      { label: 'Outreach Reach', value: '1,000+ Girls', description: 'Mentored annually in secondary schools' },
    ],
    flagshipEvents: [
      {
        name: 'Pad a Girl',
        description: 'Comprehensive outreach program educating on menstrual hygiene and providing essential supplies to young women.',
      },
      {
        name: 'Stem a Girl',
        description: 'Outreach initiative to secondary school students inspiring and equipping young girls to pursue education and careers in STEM.',
      },
      {
        name: 'ELI Week & Annual Gala',
        description: 'Week-long celebration featuring keynote speeches from senior female engineering executives and researchers.',
      },
      {
        name: 'SheEngineers Mentorship Circle',
        description: 'Matching female undergraduates with corporate mentors in energy, tech, civil construction, and robotics.',
      },
    ],
    focusAreas: [
      'Female STEM Leadership & Advocacy',
      'Menstrual Hygiene Education (Pad a Girl)',
      'Secondary School STEM Outreach (Stem a Girl)',
      'Corporate Mentorship Matching',
      'Technical Upskilling & Career Readiness',
    ],
    contactEmail: 'eliunilag@gmail.com',
    contactPhone: '09037578588',
    socials: {
      instagram: 'https://instagram.com/eli_unilag',
      twitter: 'https://x.com/eli_unilag',
      linkedin: 'https://linkedin.com/company/eli-unilag',
    },
    body:
      'ELI is a programme designed to address the specific needs and challenges faced by women in engineering. It provides resources, workshops, events, and support systems to help women thrive academically and professionally, driven by the desire to create an inclusive and supportive community that celebrates the achievements of women in engineering.\n\n' +
      'Founded in 2014 as "Engineering Ladies Day" by a group of passionate female students, the initiative expanded after five editions into the full-fledged Engineering Ladies Initiative to pursue broader empowerment goals. Guided by its motto "Government for the girls, by the girls and with the girls", ELI organizes vital community programs including "Pad a Girl" to educate on menstrual hygiene, "Stem a Girl" secondary school outreach, mentorship networks, and leadership symposia.',
  },
  {
    id: 3,
    slug: 'paadc',
    imageSrc: '/associations/paadc.png',
    imageWidth: 300,
    imageHeight: 70,
    name: 'PAADC',
    acronym: 'PAADC',
    tagline: 'Professor Ayodele Awojobi Design Competition',
    type: 'sub-bodies',
    typeLabel: 'ULES Sub-Body',
    establishedYear: '2017',
    memberCount: '120+ Organizing Fellows & 100+ National Teams',
    departmentAffiliation: 'National Initiative (Founded by ULES)',
    mottoOrVision: 'Fostering the next generation of innovators by turning ideas into tangible solutions using STEM',
    president: {
      name: 'Olusola Benson',
      title: 'Chairman, Organizing Committee',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2017', description: "National STEM innovation competition founded by ULES" },
      { label: 'Focus Sectors', value: '5 Sectors', description: 'Healthcare, Agri, Edu, Essential Services, Sustainability' },
      { label: 'Committee Chairman', value: 'Olusola Benson', description: '2025/2026 Academic Session' },
      { label: 'Prize Grants', value: '₦5M+ Awarded', description: 'In equity-free seed funding to winners' },
    ],
    flagshipEvents: [
      {
        name: 'PAADC National Grand Finale',
        description: 'The premier collegiate innovation stage where selected finalist teams present and demonstrate their viable, indigenous STEM solutions to expert judging and investor panels.',
      },
      {
        name: 'Multi-Stage Evaluation Process',
        description: 'Rigorous selection rounds challenging student teams to identify real-world problems and develop viable prototypes.',
      },
      {
        name: 'Innovators Incubation Accelerator',
        description: 'Intensive bootcamps for national finalists covering intellectual property, commercialization, and CAD modeling.',
      },
      {
        name: 'Ayodele Awojobi Memorial Lecture',
        description: 'Annual lecture honoring the legacy of Nigeria’s foremost mechanical inventor Prof. Ayodele Awojobi.',
      },
    ],
    focusAreas: [
      'Healthcare',
      'Agriculture',
      'Education',
      'Essential Services',
      'Environmental Sustainability',
    ],
    contactEmail: 'paadcofficial@gmail.com',
    contactPhone: '(234) 810 850 1476',
    coChair: 'Deputy Chair: (234) 810 045 7706',
    socials: {
      instagram: 'https://instagram.com/paadc_official',
      twitter: 'https://x.com/paadc_official',
      linkedin: 'https://linkedin.com/company/paadc',
    },
    body:
      'PAADC was established in 2017 by the University of Lagos Engineering Society (ULES) in honour of the late Professor Ayodele Awojobi. It is a national undergraduate innovation competition that challenges students to identify real-world problems and develop viable, indigenous solutions using STEM. Its mission is to foster the next generation of innovators by giving undergraduates a platform to turn ideas into tangible solutions to societal challenges. Participants progress through multiple stages of evaluation, and selected finalist teams present and demonstrate their innovations at the Grand Finale.\n\n' +
      'Covering five critical focus sectors — Healthcare, Agriculture, Education, Essential Services, and Environmental Sustainability — PAADC gives undergraduates across tertiary institutions the resources, mentorship, and equity-free funding to commercialize impactful technologies.',
  },
  {
    id: 4,
    slug: 'pidec',
    imageSrc: '/associations/pidec.png',
    imageWidth: 207,
    imageHeight: 200,
    name: 'PIDEC',
    acronym: 'PIDEC',
    tagline: 'Prototype Inter-Departmental Design Challenge',
    type: 'sub-bodies',
    typeLabel: 'ULES Sub-Body',
    establishedYear: '2021',
    memberCount: '10 Departments Represented',
    departmentAffiliation: 'Faculty of Engineering (Organised by ULES)',
    mottoOrVision: 'From Conceptual Blueprints to Tangible Physical Reality',
    president: {
      name: 'Segun Adebisi',
      title: 'Project Lead',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2021', description: 'Faculty-wide practical hardware competition' },
      { label: 'Departmental Scope', value: '10 Departments', description: 'Multidisciplinary engineering teams' },
      { label: 'Project Lead', value: 'Segun Adebisi', description: '2025/2026 Academic Session' },
      { label: 'Hardware Focus', value: '100% Practical', description: 'Working prototypes tested live' },
    ],
    flagshipEvents: [
      {
        name: 'The Annual PIDEC Grand Showcase',
        description: 'Exhibition where departmental teams demonstrate physical operating machines under faculty scrutiny.',
      },
      {
        name: 'Fabrication & Machine Shop Clinics',
        description: 'Practical training sessions covering lathe machining, welding, PCB routing, and composite forming.',
      },
      {
        name: 'Faculty Technical Review Board',
        description: 'Critique sessions with university professors and senior engineers assessing commercial viability.',
      },
    ],
    focusAreas: [
      'Interdisciplinary Machine Fabrication',
      'Mechatronics & Embedded Robotics',
      'Renewable Energy Harvesters',
      'Automated Waste Sorting Systems',
      'Design for Manufacturability (DFM)',
    ],
    contactEmail: 'pidec.ules@gmail.com',
    socials: {
      instagram: 'https://instagram.com/ules_pidec',
      twitter: 'https://x.com/ules_pidec',
      linkedin: 'https://linkedin.com/company/ules-pidec',
    },
    body:
      'The Prototype Inter-Departmental Design Challenge (PIDEC) is a faculty-wide engineering competition established by the University of Lagos Engineering Society (ULES) in 2021. Designed to champion practical, hands-on fabrication and interdisciplinary synergy, PIDEC provides a high-stakes arena where students move from conceptual blueprints to working physical hardware.\n\n' +
      'Every edition tasks multi-departmental student teams with solving local industrial challenges — from renewable mini-grids and automated agricultural harvesters to smart waste-sorting systems. With departmental pride on the line, PIDEC forces engineering students to master welding, 3D printing, embedded firmware, and project management, creating a vibrant pipeline of job-ready innovators with tangible portfolios.',
  },
  {
    id: 5,
    slug: 'owls',
    imageSrc: '/associations/owls.png',
    imageWidth: 300,
    imageHeight: 168,
    name: 'ULES OWLS',
    acronym: 'OWLS',
    tagline: 'ULES Oratory, Writers and Literacy Society',
    type: 'sub-bodies',
    typeLabel: 'ULES Sub-Body',
    establishedYear: '2023',
    memberCount: '140+ Active Orators & Writers',
    departmentAffiliation: 'Faculty of Engineering (ULES Secretariat)',
    mottoOrVision: 'Beyond the classroom',
    president: {
      name: 'Miracle Okonkwo',
      title: 'Chairperson',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2023', description: 'Official literary & communications arm of ULES' },
      { label: 'Active Members', value: '140+', description: 'Debaters, speech coaches, and technical writers' },
      { label: 'Current Chairperson', value: 'Miracle Okonkwo', description: '2025/2026 Academic Session' },
      { label: 'Flagship Stage', value: "The Orator's Stage", description: 'Faculty-wide parliamentary tournament' },
    ],
    flagshipEvents: [
      {
        name: "The Orator's Stage Tournament",
        description: 'High-stakes debate championship challenging engineering students on technology policy, ethics, and civic leadership.',
      },
      {
        name: 'Hands-on Workshops & Debate Sessions',
        description: 'Practical training helping engineers master public speaking, persuasive presentations, and impactful leadership.',
      },
      {
        name: 'Creative Writing Initiatives & Clinics',
        description: 'Mentorship and workshops turning complex technical ideas into compelling stories and publications.',
      },
      {
        name: 'Engineering Literary Digest Publication',
        description: 'Annual faculty anthology celebrating prose, poetry, and investigative features by engineering students.',
      },
    ],
    focusAreas: [
      'Parliamentary Debate & Public Speaking',
      'Technical Storytelling & Communication',
      'Creative Writing & Editorial Initiatives',
      'Persuasive Presentation Mastery',
      'Executive Leadership Coaching',
    ],
    contactEmail: 'ulesowls@gmail.com',
    contactPhone: '+234 802 373 8094',
    coChair: 'Co-chair: +234 708 929 1510',
    socials: {
      instagram: 'https://instagram.com/ules_owls',
      twitter: 'https://x.com/ules_owls',
      linkedin: 'https://linkedin.com/company/ules-owls',
    },
    body:
      'ULES OWLS is the official literary, public speaking, and communications arm of the University of Lagos Engineering Society, formed in 2023. Guided by its motto "Beyond the classroom", it helps engineers master the spoken and written word, turning complex technical ideas into compelling stories, persuasive presentations, and impactful leadership, through hands-on workshops, debate sessions, and creative writing initiatives.\n\n' +
      'OWLS organizes the prestigious "Orator\'s Stage" parliamentary debate tournaments, regular public speaking clinics, and creative writing workshops. The society also curates and publishes the annual ULES Literary Digest, celebrating prose, poetry, and thought leadership from UNILAG engineers.',
  },
];

export function computeBodySeo(body: AssociationBody) {
  const acronymWithUnilag = body.acronym.includes('UNILAG')
    ? body.acronym
    : `${body.acronym} UNILAG`;
  const displayTitle = `${acronymWithUnilag} – ${body.tagline} | ULES`;

  const description = `Official profile of ${body.acronym} (ULES) – ${body.name}. ${body.tagline} at the University of Lagos Faculty of Engineering. Explore student programs, leadership, flagship events, and contact details.`;

  const keywords = Array.from(
    new Set([
      body.acronym,
      `${body.acronym} ULES`,
      `${body.acronym} UNILAG`,
      `${body.acronym} University of Lagos`,
      body.name,
      `${body.name} ULES`,
      `${body.name} UNILAG`,
      body.tagline,
      `${body.tagline} ULES`,
      `${body.tagline} UNILAG`,
      body.departmentAffiliation,
      `${body.departmentAffiliation} UNILAG`,
      `${body.departmentAffiliation} ULES`,
      ...(body.flagshipEvents?.map((e) => e.name) || []),
      ...(body.focusAreas || []),
      body.president?.name ? `${body.president.name} ${body.acronym}` : '',
      body.president?.name ? `${body.president.name} ULES` : '',
      body.headOfDepartment ? `${body.headOfDepartment} UNILAG` : '',
      'ULES associations',
      'UNILAG engineering',
      'Faculty of Engineering UNILAG',
    ].filter(Boolean))
  );

  const alternateNames = Array.from(
    new Set([
      body.name,
      body.acronym,
      `${body.acronym} ULES`,
      `${body.acronym} UNILAG`,
      `${body.acronym} University of Lagos`,
      body.tagline,
      `${body.tagline} UNILAG`,
      `${body.tagline} ULES`,
    ])
  );

  const aliases = Array.from(
    new Set([
      ...(body.aliases || []),
      body.slug,
      body.acronym.toLowerCase(),
      `${body.slug}-unilag`,
      `${body.slug}-ules`,
      `${body.acronym.toLowerCase()}-unilag`,
      `${body.acronym.toLowerCase()}-ules`,
      body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      body.tagline.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    ])
  );

  return {
    seoTitle: displayTitle,
    seoDescription: description,
    seoKeywords: keywords,
    alternateNames,
    aliases,
  };
}

export function getAllBodies(): AssociationBody[] {
  return [...DEPARTMENTAL_BODIES, ...SUB_BODIES].map((body) => {
    const seo = computeBodySeo(body);
    return {
      ...body,
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
      seoKeywords: seo.seoKeywords,
      alternateNames: seo.alternateNames,
      aliases: seo.aliases,
    };
  });
}

export function getBodyBySlug(slug: string): AssociationBody | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  const stripped = normalized.replace(/[^a-z0-9]/g, '');

  const bodies = getAllBodies();

  const directMatch = bodies.find(
    (b) => b.slug.toLowerCase() === normalized || String(b.id) === normalized
  );
  if (directMatch) return directMatch;

  const acronymMatch = bodies.find((b) => b.acronym.toLowerCase() === normalized);
  if (acronymMatch) return acronymMatch;

  const aliasMatch = bodies.find((b) =>
    b.aliases?.some(
      (alias) =>
        alias.toLowerCase() === normalized ||
        alias.replace(/[^a-z0-9]/g, '') === stripped
    )
  );
  if (aliasMatch) return aliasMatch;

  const strippedMatch = bodies.find((b) => {
    if (b.slug.replace(/[^a-z0-9]/g, '') === stripped) return true;
    if (b.acronym.toLowerCase().replace(/[^a-z0-9]/g, '') === stripped) return true;
    if (b.name.toLowerCase().replace(/[^a-z0-9]/g, '') === stripped) return true;
    if (b.tagline.toLowerCase().replace(/[^a-z0-9]/g, '') === stripped) return true;
    return false;
  });

  return strippedMatch;
}
