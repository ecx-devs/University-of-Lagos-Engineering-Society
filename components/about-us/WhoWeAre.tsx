import Link from 'next/link';

export function WhoWeAre() {
  return (
    <section className="bg-background text-foreground w-full px-[4.103%] py-8 lg:px-[7.7%]">
      <div className="rounded-[2rem] border border-border/80 bg-card/60 p-6 sm:p-10 lg:p-14 shadow-xs">
        <h2 className="text-primary text-center text-2xl/9 font-medium lg:text-3xl/9">
          Who We Are
        </h2>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-primary/30" />

        <div className="mt-8 space-y-6 text-sm sm:text-base lg:text-[17px] leading-relaxed text-foreground/85 max-w-4xl mx-auto">
          <p>
            The University of Lagos Engineering Society (ULES) is the official student association representing all undergraduates within the Faculty of Engineering at the University of Lagos. Established following the founding of engineering education at UNILAG during the 1964/1965 academic session, ULES stands as the oldest student body at the university. Over the decades, it has evolved into a vital bridge connecting academic rigor, technical innovation, professional development, and vibrant student life, producing generations of industry captains, researchers, and technology pioneers across Nigeria and the global engineering landscape.
          </p>

          <p>
            Today, ULES serves as the umbrella body for 10 distinct degree-awarding departments, encompassing{' '}
            <Link href="/associations/bmesa" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Biomedical Engineering (BMESA)</Link>,{' '}
            <Link href="/associations/nsche" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Chemical Engineering (NSChE)</Link>,{' '}
            <Link href="/associations/cess" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Civil and Environmental Engineering (CESS / NICE-SA)</Link>,{' '}
            <Link href="/associations/sees" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Computer Engineering &amp; Electrical and Electronics Engineering (SEES)</Link>,{' '}
            <Link href="/associations/nimeche" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Mechanical Engineering (NIMechE UNILAG SF)</Link>,{' '}
            <Link href="/associations/nammes" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Metallurgical and Materials Engineering (NAMMES)</Link>,{' '}
            <Link href="/associations/spe" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Petroleum and Gas Engineering (SPE)</Link>,{' '}
            <Link href="/associations/nisgs" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Surveying and Geoinformatics (NISGS)</Link>, and{' '}
            <Link href="/associations/ases" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Systems Engineering (ASES)</Link>. Through this broad cross-disciplinary reach, the society fosters collaboration and technical synergy across the entire faculty.
          </p>

          <p>
            To drive its technical, academic, and creative mandate, ULES operates six specialized sub-bodies. The{' '}
            <Link href="/associations/arb" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Academic and Research Board (ARB)</Link> focuses on peer tutoring, academic competitions, and research support; the{' '}
            <Link href="/associations/ecx" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Engineering Career Expo (ECX)</Link> acts as a major technical and career pipeline connecting students with industry partners through bootcamps and networking events; the{' '}
            <Link href="/associations/eli" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Engineering Ladies Initiative (ELI)</Link> empowers female engineering undergraduates through mentorship and STEM outreach; the{' '}
            <Link href="/associations/paadc" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Professor Ayodele Awojobi Design Competition (PAADC)</Link> serves as Nigeria’s flagship student-led innovation contest by funding and incubating impactful technical solutions; the{' '}
            <Link href="/associations/pidec" className="text-primary hover:text-accent font-medium hover:underline transition-colors">Prototype Inter-Departmental Design Challenge (PIDEC)</Link> promotes hardware prototyping and engineering problem-solving across all departments; and the{' '}
            <Link href="/associations/owls" className="text-primary hover:text-accent font-medium hover:underline transition-colors">ULES Oratory, Writers, and Literacy Society (OWLS)</Link> cultivates public speaking, debating, and editorial talents.
          </p>

          <p>
            Beyond academics and technical projects, ULES leads vibrant faculty-wide events that define undergraduate student life. Each academic session features the relaxed, informal ULES Social Night for inter-departmental networking and entertainment; the ULES Sports Festival, the biggest and most competitive sports gathering in UNILAG; the week-long ULES Faculty Week which is a finalist experience; and the official ULES Dinner and Awards Night, a formal end-of-tenure gala honoring academic excellence, student leadership, service and impact. Through these pillars, ULES continues its long-standing legacy of fostering academic growth, engineering innovation, and strong community unity.
          </p>
        </div>
      </div>
    </section>
  );
}
