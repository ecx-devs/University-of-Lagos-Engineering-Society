
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
  mottoOrVision?: string;
  keyHighlights: AssociationMetric[];
  flagshipEvents: AssociationEvent[];
  focusAreas: string[];
  contactEmail: string;
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
    establishedYear: '2013',
    memberCount: '320+ Active Students',
    departmentAffiliation: 'Department of Biomedical Engineering',
    mottoOrVision: 'Globally Minded, Impactful, and Future Ready',
    president: {
      name: 'Favour Adebayo',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2013', description: 'Pioneering healthcare engineering in Nigeria' },
      { label: 'Current Members', value: '320+', description: 'Undergraduate student innovators' },
      { label: 'Current President', value: 'Favour Adebayo', description: '2025/2026 Academic Session' },
      { label: 'Clinical Partner', value: 'LUTH', description: 'Lagos University Teaching Hospital' },
    ],
    flagshipEvents: [
      {
        name: 'Bio-Drive Innovation Forum',
        description: 'Flagship biomedical expo showcasing student prototypes of smart ECGs, ventilators, and medical devices.',
      },
      {
        name: 'LUTH Clinical Immersion',
        description: 'Practical clinical shadowing and medical equipment calibration in hospital wards.',
      },
      {
        name: 'Health-Tech Symposium',
        description: 'Industry keynote panels co-hosted with JNC International and Healthcare Federation of Nigeria.',
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
      'Launched as a B.Eng. program in 2013, the Department of Biomedical Engineering is a decisive intervention into Nigeria\'s healthcare technology sector. Fusing engineering with medical science, students master anatomy, biomechanics, medical imaging, and biomaterials, leveraging proximity to the Lagos University Teaching Hospital (LUTH) for clinical real-world testing.\n\n' +
      'The Biomedical Engineering Students\' Association (BMESA) operates with a powerful vision: to be "Globally Minded, Impactful, and Future Ready." BMESA drives student development through its annual flagship biomedical innovation forum, "Bio-Drive," heavily supported by industry sponsors like JNC International and the Healthcare Federation of Nigeria. At Bio-Drive, students demo prototypes of low-cost ventilators, smart masks, and portable ECGs. Through peer tutorials and STEM outreach, BMESA is actively seeding a homegrown medical device manufacturing industry in Nigeria.',
  },
  {
    id: 2,
    slug: 'cess',
    imageSrc: '/associations/cess.png',
    imageWidth: null,
    imageHeight: null,
    name: 'CESS Unilag',
    acronym: 'CESS (NICE-SA)',
    tagline: 'Civil Engineering Students Society (NICE-SA Unilag)',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1964',
    memberCount: '850+ Active Students',
    departmentAffiliation: 'Department of Civil and Environmental Engineering',
    mottoOrVision: 'Building Resilient Infrastructure for Generations',
    president: {
      name: 'Babatunde Oladipo',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1964', description: 'Foundational pillar of UNILAG Engineering' },
      { label: 'Current Members', value: '850+', description: 'Civil and environmental undergraduates' },
      { label: 'Current President', value: 'Babatunde Oladipo', description: '2025/2026 Academic Session' },
      { label: 'Valedictorian Honor', value: '4.90 CGPA', description: 'David Akanmu, Civil Engineering Star' },
    ],
    flagshipEvents: [
      {
        name: 'Annual CESS Conference',
        description: 'Major conference series (e.g. CESS 5.0) exploring sustainable urban infrastructure for mega-cities like Lagos.',
      },
      {
        name: 'Field Site Technical Visits',
        description: 'Excursions to mega-infrastructure projects, deep piling sites, and bridge construction across Lagos.',
      },
      {
        name: 'Concrete Mix Design Challenge',
        description: 'Engineering competition testing lightweight composites and eco-friendly concrete aggregates.',
      },
    ],
    focusAreas: [
      'Structural Analysis & Design',
      'Geotechnical Engineering & Piling',
      'Environmental & Coastal Protection',
      'Transportation & Highway Systems',
      'Water Resources & Flood Mitigation',
    ],
    contactEmail: 'cessunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/cess_unilag',
      twitter: 'https://x.com/cess_unilag',
      linkedin: 'https://linkedin.com/company/cess-unilag',
    },
    body:
      'Forming the third pillar of the original 1964 establishment, the Department of Civil and Environmental Engineering trains students in the planning, design, and construction of vital infrastructure. Given the rapid urbanization of Lagos, the curriculum places a heavy premium on environmental sustainability, coastal protection, and geotechnical resilience, tackling local needs like flood management and novel concrete composites.\n\n' +
      'The Nigerian Institution of Civil Engineers Student Affiliate (NICE-SA UNILAG), also known as the Civil Engineering Student Society, bridges classroom theory with field execution. NICE-SA organizes robust technical visits to large-scale piling and bridge construction sites in Lagos. Its flagship event is the annual Civil Engineering Student Society (CESS) Conference. CESS 5.0, themed "Sustainable Infrastructure for Lagos," brought industry experts to campus to discuss green building and transport planning. The department consistently produces exceptional talent, such as David Akanmu, the 2022 valedictorian for Civil Engineering (with a CGPA near 4.9), who famously led student tech teams to build a footbridge prototype and co-founded an environmental NGO.',
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
    establishedYear: '1973',
    memberCount: '410+ Active Students',
    departmentAffiliation: 'Department of Metallurgical and Materials Engineering',
    mottoOrVision: 'Forging the Materials that Drive Modern Civilization',
    president: {
      name: 'Victor Okafor',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1973', description: 'Catalyzing Nigerian industrialization' },
      { label: 'Current Members', value: '410+', description: 'Materials and metallurgical engineers' },
      { label: 'Current President', value: 'Victor Okafor', description: '2025/2026 Academic Session' },
      { label: 'Faculty Distinction', value: 'BGS Faculty', description: 'Clinton Mekwunye, Overall Best Student' },
    ],
    flagshipEvents: [
      {
        name: 'NAMMES Zonal Technical Workshop',
        description: 'Multi-university convention uniting materials researchers and metallurgical students.',
      },
      {
        name: 'Heavy Industrial Plant Excursions',
        description: 'Site visits to smelting plants, steel rolling mills, and advanced composite foundries.',
      },
      {
        name: 'Materials Synthesis Fair',
        description: 'Exhibition of student-synthesized corrosion-resistant alloys and polymer matrices.',
      },
    ],
    focusAreas: [
      'Physical & Mechanical Metallurgy',
      'Extractive Metallurgy & Mineral Processing',
      'Advanced Polymers & Composite Materials',
      'Corrosion Engineering & Surface Coating',
      'Thermodynamics of Materials',
    ],
    contactEmail: 'nammesunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/nammes_unilag',
      twitter: 'https://x.com/nammes_unilag',
      linkedin: 'https://linkedin.com/company/nammes-unilag',
    },
    body:
      'Created in 1973 to catalyze Nigeria\'s industrialization, the Department of Metallurgical and Materials Engineering forms the critical link between raw mineral extraction, refinement, and advanced materials design. The curriculum encompasses physical metallurgy, extractive processes, thermodynamics, and advanced composite characterization.\n\n' +
      'The National Association of Metallurgical and Materials Engineering Students (NAMMES) UNILAG Chapter organizes zonal technical workshops, leadership training, and plant visits to steelworks. NAMMES promotes highly multi-disciplinary skills, with its members frequently excelling across the entire engineering faculty.\n\n' +
      'Excellence Highlight: The department\'s absolute dominance was cemented recently when Clinton Mekwunye emerged not only as the Best Graduating Student of the Department of Metallurgical and Materials Engineering but as the overall Best Graduating Student in the entire Faculty of Engineering.',
  },
  {
    id: 4,
    slug: 'nimeche',
    imageSrc: '/associations/nimeche.png',
    imageWidth: null,
    imageHeight: null,
    name: 'NIMECHE Unilag',
    acronym: 'NIMechE',
    tagline: 'Nigerian Institution of Mechanical Engineers, UNILAG Student Forum',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1964',
    memberCount: '950+ Active Students',
    departmentAffiliation: 'Department of Mechanical Engineering',
    mottoOrVision: "When it moves... It's Mechanical",
    president: {
      name: 'Emmanuel Adeleke',
      title: 'Chairman',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1964', description: 'Co-founded with the Faculty of Engineering' },
      { label: 'Current Members', value: '950+', description: 'Mechanical engineering undergraduates' },
      { label: 'Current Chairman', value: 'Emmanuel Adeleke', description: '2025/2026 Academic Session' },
      { label: 'Heritage Invention', value: 'Autonov 1', description: 'Prof. Ayodele Awojobi, 1973 Dual-Steering Vehicle' },
    ],
    flagshipEvents: [
      {
        name: 'Built to Evolve Symposium',
        description: 'Flagship engineering summit uniting aerospace, energy, and automotive industry leaders with students.',
      },
      {
        name: 'Innovate Local 3D Printing Challenge',
        description: 'Fast-paced prototyping competition where student teams engineer working mechanical assemblies.',
      },
      {
        name: 'Awojobi Engineering Memorial Week',
        description: 'Annual week celebrating indigenous mechanical inventions and technical excellence.',
      },
    ],
    focusAreas: [
      'Solid Mechanics & Machine Design',
      'Thermodynamics & Heat Transfer',
      'CNC Machining & Additive Manufacturing',
      'Automotive & Internal Combustion Systems',
      'Robotics & Kinematic Actuation',
    ],
    contactEmail: 'nimecheunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/nimeche_unilag',
      twitter: 'https://x.com/nimeche_unilag',
      linkedin: 'https://linkedin.com/company/nimeche-unilag',
    },
    body:
      'When it moves... It\'s Mechanical\n\n' +
      'Founded in 1964 alongside the faculty\'s inception, the Department of Mechanical Engineering emphasizes solid mechanics, thermodynamics, machine design, and manufacturing. The department\'s historical trajectory is inextricably linked to the legacy of the late Professor Ayodele Awojobi, a mechanical engineering savant who joined the university in 1966. Professor Awojobi\'s groundbreaking invention of the "Autonov 1" in 1973, a bi-directional vehicle capable of moving forward and backward using dual steering wheels, established a lasting culture of audacious indigenous innovation.\n\n' +
      'The modern curriculum balances classical theory with contemporary demands, utilizing specialized modules in CNC and 3D printing. The Nigerian Institution of Mechanical Engineers (NIMechE) UNILAG Student Forum serves as the critical nexus between the academic environment and the professional industry. NIMechE executes a multifaceted mandate centered on professional development, organizing technical competitions and an annual flagship symposium. For example, the 2025 "Built to Evolve" symposium featured industry panels and a highly competitive "Innovate Local 3D Printing Challenge," where undergraduates showcased functional prototypes. By forcing students to secure sponsorships and present to industry leaders, NIMechE ensures graduates are primed to dominate Nigeria\'s manufacturing, automotive, and energy sectors.',
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
    establishedYear: '1973',
    memberCount: '380+ Active Students',
    departmentAffiliation: 'Department of Surveying and Geoinformatics',
    mottoOrVision: 'Mapping the Earth, Measuring the Future',
    president: {
      name: 'Kazeem Balogun',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1973', description: 'Evolution from surveying to geomatics' },
      { label: 'Current Members', value: '380+', description: 'Geospatial engineers & researchers' },
      { label: 'Current President', value: 'Kazeem Balogun', description: '2025/2026 Academic Session' },
      { label: 'NSE Milestone', value: 'First Induction', description: '2025 graduates inducted as NSE Members' },
    ],
    flagshipEvents: [
      {
        name: 'Survey Sphere Marathon',
        description: 'Multi-day knowledge marathon delivering hands-on training in DGPS, Total Stations, and ArcGIS.',
      },
      {
        name: 'Geospatial Innovation Competition (GIC)',
        description: 'Flagship competition offering ₦500,000+ prizes for innovative spatial and location intelligence projects.',
      },
      {
        name: 'World Hydrography Day Showcase',
        description: 'Annual research exhibition where UNILAG bathymetric and maritime mapping teams compete nationally.',
      },
    ],
    focusAreas: [
      'Geographic Information Systems (GIS)',
      'Drone Mapping & Photogrammetry',
      'Satellite Remote Sensing & Earth Observation',
      'Hydrographic Surveying & Marine Geodesy',
      'Differential GPS & Precise Geodetic Networks',
    ],
    contactEmail: 'info.nisgsunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/nisgs_unilag',
      twitter: 'https://x.com/nisgs_unilag',
      linkedin: 'https://linkedin.com/company/nisgs-unilag',
    },
    body:
      'Formed in 1973, this department manages the critical science of spatial data, rapidly evolving from conventional surveying into advanced Geomatics Engineering. The curriculum is highly digitized, covering GIS, drone mapping, remote sensing, and hydrography. In a massive historical milestone, 2025 saw the first-ever graduates of UNILAG\'s Surveying department inducted as Graduate Members of the Nigerian Society of Engineers (NSE).\n\n' +
      'The Nigerian Institution of Surveying and Geoinformatics Students (NISGS) UNILAG Chapter is a fiercely competitive and career-focused organization. Its absolute flagship event is Survey Sphere, a multi-day knowledge marathon. Survey Sphere 4.0 (2026) provided hands-on training with DGPS, Total Stations, and ArcGIS, culminating in the maiden Geospatial Innovation Competition (GIC 1.0), which awarded N500,000 to the top student innovators. NISGS is academically lethal; in 2025, a UNILAG team won the World Hydrography Day research competition. Recent stars like Adewuyi Sheriff graduated with a 4.74 CGPA, winning Most Innovative Final Year Student and securing his place at the forefront of global spatial technology.',
  },
  {
    id: 6,
    slug: 'nsche',
    imageSrc: '/associations/nsche.png',
    imageWidth: null,
    imageHeight: null,
    name: 'NSCHE Unilag',
    acronym: 'NSChE',
    tagline: 'Nigerian Society of Chemical Engineers Unilag',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1973',
    memberCount: '680+ Active Students',
    departmentAffiliation: 'Department of Chemical Engineering',
    mottoOrVision: 'Transforming Molecular Potential into Sustainable Value',
    president: {
      name: 'Deborah Alabi',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1973', description: 'Founded under Prof. Ayo Francis Ogunye' },
      { label: 'Current Members', value: '680+', description: 'Chemical engineering undergraduates' },
      { label: 'Current President', value: 'Deborah Alabi', description: '2025/2026 Academic Session' },
      { label: 'Endowment Fund', value: 'PAFOTFUL', description: 'Prof. Ayo Ogunye Multi-Million Naira Trust Fund' },
    ],
    flagshipEvents: [
      {
        name: 'The ART Grand Finale',
        description: 'Academic & Resource Team inter-university competition backed by Amazon Energy and NNEC.',
      },
      {
        name: 'Project FLOAT Clean-Tech',
        description: 'Pioneering ecological project engineering floating biogas latrines for sustainable sanitation.',
      },
      {
        name: 'Annual Ogunye Memorial Lecture',
        description: 'Keynote industry lecture discussing petrochemical transition, green catalysts, and hydrogen energy.',
      },
    ],
    focusAreas: [
      'Chemical Process Simulation & Aspen HYSYS',
      'Petrochemical Refining & Gas Processing',
      'Bio-Plastics & Circular Polymer Synthesis',
      'Photocatalytic Pollution Degradation',
      'Industrial Safety & Plant Design',
    ],
    contactEmail: 'nscheunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/nsche_unilag',
      twitter: 'https://x.com/nsche_unilag',
      linkedin: 'https://linkedin.com/company/nsche-unilag',
    },
    body:
      'Established in 1973 by Professor Ayo Francis Ogunye (Nigeria\'s first Chemical Engineering professor at age 36), the Department of Chemical Engineering underpins the nation\'s petrochemical, pharmaceutical, and agro-allied sectors. The department is uniquely supported by the Professor Ayo Ogunye Trust Fund (PAFOTFUL), which has grown to hundreds of millions of Naira, funding massive research grants in green technology, bioplastics, and hybrid photocatalysis for pollution control.\n\n' +
      'The Nigerian Society of Chemical Engineers (NSChE) UNILAG Chapter, maintaining close ties with the national secretariat (located right at UNILAG), is a highly structured organization. Its flagship event is The ART (Academic & Resource Team) Grand Finale, an intense intellectual competition drawing universities across the state. The 2026 edition, themed "Chemical Engineering at the Intersection of Energy and Innovation," featured heavyweight corporate backing from Amazon Energy and NNEC. NSChE UNILAG also fosters remarkable ecological innovation, with student teams winning awards for "Project FLOAT" (a floating biogas latrine). Demonstrating elite leadership, recent graduates like Idrees Idrees served as NSChE President while graduating as the Best Graduating Student of Chemical Engineering in 2026.',
  },
  {
    id: 7,
    slug: 'sees',
    imageSrc: '/associations/sees.png',
    imageWidth: null,
    imageHeight: null,
    name: 'SEES Unilag',
    acronym: 'SEES',
    tagline: 'Society of Electrical and Electronics Engineering Students',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1964',
    memberCount: '1,150+ Active Students',
    departmentAffiliation: 'Department of Electrical & Electronics Engineering',
    mottoOrVision: 'Powering Possibilities, Connecting the Future',
    president: {
      name: 'Oluwaseun Davies',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1964', description: 'Founding departmental pillar of ULES' },
      { label: 'Current Members', value: '1,150+', description: 'Electrical & computer engineering scholars' },
      { label: 'Current President', value: 'Oluwaseun Davies', description: '2025/2026 Academic Session' },
      { label: 'Digital Lab Facility', value: '₦70M Siemens Lab', description: 'Digital simulation & grid modeling facility' },
    ],
    flagshipEvents: [
      {
        name: 'SEES Innovation Hub Hackathons',
        description: 'Multi-track hardware and embedded firmware hackathons solving renewable grid and IoT challenges.',
      },
      {
        name: 'IEEE Smart Grid Symposium',
        description: 'Joint technical convention with IEEE UNILAG Chapter on digital substations and automation.',
      },
      {
        name: 'Hardware Circuit Prototyping Expo',
        description: 'Showcase of undergraduate circuit boards, telemetry systems, and micro-controller inventions.',
      },
    ],
    focusAreas: [
      'Power Systems & Renewable Microgrids',
      'Embedded Firmware & IoT Systems',
      'Telecommunications & RF Engineering',
      'Digital Signal Processing & AI Hardware',
      'Industrial Automation & PLC Systems',
    ],
    contactEmail: 'theseesunilagofficial@gmail.com',
    socials: {
      instagram: 'https://instagram.com/sees_unilag',
      twitter: 'https://x.com/sees_unilag',
      linkedin: 'https://linkedin.com/company/sees-unilag',
    },
    body:
      'Also established in the foundational 1964/1965 academic session, the Department of Electrical and Electronics Engineering (encompassing Computer Engineering) is the engine driving Nigeria\'s digital and power infrastructure. The curriculum covers circuit theory, power systems, control theory, telecommunications, and increasingly, artificial intelligence and software engineering.\n\n' +
      'A monumental milestone in the department\'s history was the 2022 commissioning of a N70 million Digital Engineering Laboratory, donated by Siemens Energy. This end-to-end facility allows students to model complex power grids and automation processes in an industrial-grade simulation environment.\n\n' +
      'The student body operates through the Society of Electrical and Electronics Engineering Students (SEES) and a highly active IEEE Student Branch. SEES-UNILAG acts as an incubator for tech talent, hosting the SEES Innovation Hub, hackathons, and hardware workshops. The IEEE chapter frequently hosts high-level events, such as the IEEE Innovation Event on "Smart Grid Technologies." This environment breeds unparalleled excellence; a prime example is Arthur Enwelum, who graduated as the best student in EEE with a near-perfect 4.80/5.00 CGPA while serving as the IEEE Student Branch Robotics Team assistant lead.',
  },
  {
    id: 8,
    slug: 'spe',
    imageSrc: '/associations/spe.png',
    imageWidth: null,
    imageHeight: null,
    name: 'SPE Unilag',
    acronym: 'SPE',
    tagline: 'Society of Petroleum Engineers Unilag',
    type: 'departmental',
    typeLabel: 'Departmental Body',
    establishedYear: '1975',
    memberCount: '520+ Active Students',
    departmentAffiliation: 'Department of Petroleum and Gas Engineering',
    mottoOrVision: 'Energy Knowledge for the Next Frontier',
    president: {
      name: 'Samuel Akpu Uko',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '1975', description: 'Established during the 1970s energy boom' },
      { label: 'Current Members', value: '520+', description: 'Petroleum, energy, and geoscience students' },
      { label: 'Current President', value: 'Samuel Akpu Uko', description: '2025/2026 Academic Session' },
      { label: 'NAICE Honor', value: 'Best Student Chapter', description: 'Awarded for membership retention and growth' },
    ],
    flagshipEvents: [
      {
        name: 'Student Technical Conference (STC)',
        description: 'Annual technical conference featuring high-stakes Petroquiz battles and paper competitions.',
      },
      {
        name: 'NAICE Annual Delegation',
        description: 'Representing UNILAG at the SPE Nigeria Annual International Conference and Exhibition.',
      },
      {
        name: 'SAASC Africa Tech Showcase',
        description: 'Exhibiting international engineering solutions like the IoT Smart Safety Helmet in Nairobi.',
      },
    ],
    focusAreas: [
      'Reservoir Engineering & Simulation',
      'Drilling & Well Completion Engineering',
      'Natural Gas Monetization & LNG Logistics',
      'Energy Transition, CCUS & Geothermal',
      'Health, Safety & Environmental (HSE) IoT',
    ],
    contactEmail: 'speunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/spe_unilag',
      twitter: 'https://x.com/spe_unilag',
      linkedin: 'https://linkedin.com/company/spe-unilag',
    },
    body:
      'Growing out of the Chemical Engineering program in the 1970s to serve Nigeria\'s oil boom, the Department of Petroleum and Gas Engineering covers reservoir engineering, drilling, natural gas processing, and energy economics. Though UNILAG reportedly halted fresh admissions into the program in late 2025 to reflect the shifting global energy landscape, the department remains a titan of industry research.\n\n' +
      'The Society of Petroleum Engineers (SPE) UNILAG Chapter is arguably one of the most decorated student organizations on the continent. SPE UNILAG adapts brilliantly to the energy transition, welcoming students from geosciences, law, and other engineering fields to build a multidisciplinary powerhouse. Led by dynamic executives like President Samuel Akpu Uko, the chapter\'s flagship event is the Student Technical Conference (STC), featuring Petroquiz competitions and paper contests.\n\n' +
      'The chapter\'s dominance was on full display at the SPE Nigeria Annual International Conference and Exhibition (NAICE 2026), where they won Best Student Chapter for Membership Retention & Growth, secured 2nd place in the SPENC Chapter Contest, and won the SPENC Energy Challenge. Furthermore, demonstrating a pivot towards IoT and safety, students Samuel Uko and Ogboro Olaoluwa showcased an innovative "Smart Safety Helmet" at the SPE Africa Student Symposium (SAASC 2026) in Nairobi, proving that UNILAG students remain at the cutting edge of energy and industrial safety innovation.',
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
    mottoOrVision: 'Connecting Lecture Halls to Corporate Excellence',
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
      'The Engineering Career Expo (ECX) at the University of Lagos is the premier student-led talent incubator and professional career bridge under the University of Lagos Engineering Society (ULES). Founded in 2019, ECX was created to decisively bridge the gap between rigorous university engineering curricula and the fast-paced global tech and corporate industry.\n\n' +
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
    establishedYear: '2017',
    memberCount: '420+ Active Female Engineers',
    departmentAffiliation: 'Faculty of Engineering (ULES Secretariat)',
    mottoOrVision: 'Empowering Women to Engineer the Future',
    president: {
      name: 'Ifeoluwa Adeleke',
      title: 'Executive Director',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2017', description: 'Empowering women across all 10 departments' },
      { label: 'Active Members', value: '420+', description: 'Undergraduate female engineering leaders' },
      { label: 'Executive Director', value: 'Ifeoluwa Adeleke', description: '2025/2026 Academic Session' },
      { label: 'Outreach Reach', value: '1,000+ Girls', description: 'Mentored annually in secondary schools' },
    ],
    flagshipEvents: [
      {
        name: 'ELI Week & Annual Gala',
        description: 'Week-long celebration featuring keynote speeches from senior female engineering executives and researchers.',
      },
      {
        name: 'SheEngineers Mentorship Circle',
        description: 'Matching female undergraduates with corporate mentors in energy, tech, civil construction, and robotics.',
      },
      {
        name: 'Girls in STEM Secondary School Tour',
        description: 'State-wide outreach inspiring secondary school girls to embrace mathematics and pursue engineering degrees.',
      },
    ],
    focusAreas: [
      'Female STEM Leadership & Advocacy',
      'Corporate Mentorship Matching',
      'Technical Upskilling & Career Readiness',
      'Secondary School STEM Outreach',
      'Gender Equity in Engineering',
    ],
    contactEmail: 'eliunilag@gmail.com',
    socials: {
      instagram: 'https://instagram.com/eli_unilag',
      twitter: 'https://x.com/eli_unilag',
      linkedin: 'https://linkedin.com/company/eli-unilag',
    },
    body:
      'Engineering Ladies Initiative is a program designed to address the specific needs and challenges faced by women in engineering. We provide resources, workshops, events, and support systems to help women thrive academically and professionally. Our initiative is driven by the desire to create an inclusive and supportive community that celebrates the achievements of women in engineering. \n\n' +
      'We have various initiatives like Pad a Girl to educate on menstrual hygiene, Stem a Girl an outreach to secondary school students as well as so much more ',
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
    establishedYear: '2016',
    memberCount: '120+ Organizing Fellows & 100+ National Teams',
    departmentAffiliation: 'National Initiative (Founded by ULES)',
    mottoOrVision: "Inspiring Ingenuity, Solving Nigeria's Toughest Challenges",
    president: {
      name: 'Olusola Benson',
      title: 'Chairman, Organizing Committee',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2016', description: "Nigeria's #1 Undergraduate STEM Challenge" },
      { label: 'National Scope', value: '100+ Tertiary Institutions', description: 'Participating across Nigeria' },
      { label: 'Committee Chairman', value: 'Olusola Benson', description: '2025/2026 Academic Session' },
      { label: 'Prize Grants', value: '₦5M+ Awarded', description: 'In equity-free seed funding to winners' },
    ],
    flagshipEvents: [
      {
        name: 'PAADC National Grand Finale',
        description: 'The premier collegiate innovation stage where shortlisted finalists pitch working prototypes to investor panels.',
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
      'Hardware & Indigenous Prototyping',
      'Clean Energy & Agritech Inventions',
      'Health-Tech & Medical Instrumentation',
      'Venture Incubation & Intellectual Property',
      'National Inter-University STEM Collaboration',
    ],
    contactEmail: 'sponsorship@paadc.com',
    socials: {
      instagram: 'https://instagram.com/paadc_official',
      twitter: 'https://x.com/paadc_official',
      linkedin: 'https://linkedin.com/company/paadc',
    },
    body:
      'The Professor Ayodele Awojobi Design Competition (PAADC) is Nigeria\'s largest student-led undergraduate STEM innovation competition, created in 2016 by the University of Lagos Engineering Society. Named in immortal tribute to the late academic prodigy and mechanical engineering legend Professor Ayodele Awojobi, PAADC challenges tertiary students across Nigeria to design indigenous engineering solutions to Africa\'s most pressing socioeconomic problems.\n\n' +
      'Each year, PAADC attracts hundreds of submissions from over 100 universities and polytechnics across Nigeria, spanning categories in health tech, agritech, clean energy, and smart automation. Finalists participate in an intensive design-to-market incubation camp, culminating in a grand pitch finale where winners are awarded millions of Naira in equity-free development grants and mentorship from top venture capitalists and industrial leaders.',
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
    establishedYear: '2020',
    memberCount: '140+ Active Orators & Writers',
    departmentAffiliation: 'Faculty of Engineering (ULES Secretariat)',
    mottoOrVision: 'Articulate Minds, Impactful Voices',
    president: {
      name: 'Miracle Okonkwo',
      title: 'President',
      academicYear: CURRENT_ACADEMIC_SESSION,
    },
    keyHighlights: [
      { label: 'Year Established', value: '2020', description: 'Communication and literary society of ULES' },
      { label: 'Active Members', value: '140+', description: 'Debaters, speech coaches, and technical writers' },
      { label: 'Current President', value: 'Miracle Okonkwo', description: '2025/2026 Academic Session' },
      { label: 'Flagship Stage', value: "The Orator's Stage", description: 'Faculty-wide parliamentary tournament' },
    ],
    flagshipEvents: [
      {
        name: "The Orator's Stage Tournament",
        description: 'High-stakes debate championship challenging engineering students on technology policy, ethics, and civic leadership.',
      },
      {
        name: 'WordCraft Technical Writing Clinics',
        description: 'Workshops coaching engineers on publication-grade technical documentation, grant writing, and storytelling.',
      },
      {
        name: 'Engineering Literary Digest Publication',
        description: 'Annual faculty anthology celebrating prose, poetry, and investigative features by engineering students.',
      },
    ],
    focusAreas: [
      'Parliamentary Debate & Rhetoric',
      'Technical Writing & Documentation',
      'Executive Public Speaking Coaching',
      'Engineering Journalism & Op-Eds',
      'Literary Expression & Creative Writing',
    ],
    contactEmail: 'owls.ules@gmail.com',
    socials: {
      instagram: 'https://instagram.com/ules_owls',
      twitter: 'https://x.com/ules_owls',
      linkedin: 'https://linkedin.com/company/ules-owls',
    },
    body:
      'The ULES Oratory, Writers and Literacy Society (ULES OWLS) is the premier communications and literary hub within the Faculty of Engineering, founded in 2020. Recognizing that modern engineers must not only calculate and construct but also articulate, persuade, and lead, OWLS was formed to cultivate eloquence, public speaking mastery, and literary excellence among engineering students.\n\n' +
      'OWLS organizes the prestigious "Orator\'s Stage" parliamentary debate tournaments, regular public speaking clinics, and creative writing workshops. The society also curates and publishes the annual ULES Literary Digest, documenting essays, poetry, and investigative op-eds that reflect the intellectual breadth and cultural vitality of UNILAG engineers.',
  },
];

export function computeBodySeo(body: AssociationBody) {
  const isAcronymSameAsName = body.name.trim().toLowerCase() === body.acronym.trim().toLowerCase();
  const nameAlreadyHasAcronym = body.name.toLowerCase().includes(body.acronym.toLowerCase());

  const displayTitle = isAcronymSameAsName
    ? `${body.acronym} – ${body.tagline} | ULES UNILAG`
    : nameAlreadyHasAcronym
      ? `${body.name} – ${body.tagline} | ULES UNILAG`
      : `${body.name} (${body.acronym}) – ${body.tagline} | ULES UNILAG`;

  const description = `${body.name} (${body.acronym}) is the official ${body.typeLabel.toLowerCase()} representing students of ${body.departmentAffiliation} at the University of Lagos (UNILAG) Faculty of Engineering under ULES. Explore programs, events, leadership, and initiatives.`;

  const keywords = Array.from(
    new Set([
      body.name,
      body.acronym,
      `${body.acronym} ULES`,
      `${body.acronym} UNILAG`,
      `${body.acronym} University of Lagos`,
      `${body.name} ULES`,
      `${body.name} UNILAG`,
      body.tagline,
      `${body.tagline} ULES`,
      `${body.tagline} UNILAG`,
      body.departmentAffiliation,
      `${body.departmentAffiliation} UNILAG`,
      ...(body.flagshipEvents?.map((e) => e.name) || []),
      ...(body.focusAreas || []),
      body.president?.name ? `${body.president.name} ${body.acronym}` : '',
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

  // 1. Direct slug or ID match
  const directMatch = bodies.find(
    (b) => b.slug.toLowerCase() === normalized || String(b.id) === normalized
  );
  if (directMatch) return directMatch;

  // 2. Acronym match (e.g. 'ecx', 'nisgs')
  const acronymMatch = bodies.find((b) => b.acronym.toLowerCase() === normalized);
  if (acronymMatch) return acronymMatch;

  // 3. Aliases match
  const aliasMatch = bodies.find((b) =>
    b.aliases?.some(
      (alias) =>
        alias.toLowerCase() === normalized ||
        alias.replace(/[^a-z0-9]/g, '') === stripped
    )
  );
  if (aliasMatch) return aliasMatch;

  // 4. Normalized stripped comparison (e.g. 'engineeringcareerexpo' -> 'ecx')
  const strippedMatch = bodies.find((b) => {
    if (b.slug.replace(/[^a-z0-9]/g, '') === stripped) return true;
    if (b.acronym.toLowerCase().replace(/[^a-z0-9]/g, '') === stripped) return true;
    if (b.name.toLowerCase().replace(/[^a-z0-9]/g, '') === stripped) return true;
    if (b.tagline.toLowerCase().replace(/[^a-z0-9]/g, '') === stripped) return true;
    return false;
  });

  return strippedMatch;
}
