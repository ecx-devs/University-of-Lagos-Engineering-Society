import { getActiveSpotlights } from '@/app/actions/spotlight';
import Image from 'next/image';
import { Quote, Star, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

export const revalidate = 60; // revalidate every minute if necessary

export default async function SpotlightPage() {
  const { volunteer, lecturer } = await getActiveSpotlights();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Reveal>
          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase mb-6 text-foreground">
            The <span className="text-primary">Spotlight</span>
          </h1>
          <p className="font-sans text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Celebrating the exceptional individuals who drive excellence, community, and innovation within the ULES family.
          </p>
        </Reveal>
      </section>

      {/* Features Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-24 relative z-10">
        
        {/* Volunteer of the Month */}
        <Reveal delay={0.1}>
          {volunteer ? (
            <div className="relative rounded-[2rem] overflow-hidden bg-primary/5 border border-primary/10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center p-6 md:p-12 shadow-sm">
              <div className="lg:col-span-5 relative h-[450px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src={volunteer.imageUrl} 
                  alt={volunteer.name} 
                  fill 
                  className="object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
              
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <div>
                  <span className="inline-block text-accent font-bold text-sm tracking-widest uppercase mb-4">
                    ULES Volunteer of the Month • {volunteer.monthYear}
                  </span>
                  <h2 className="font-heading text-5xl lg:text-6xl uppercase leading-none text-foreground mb-4">
                    {volunteer.name}
                  </h2>
                  <p className="text-xl text-primary font-medium tracking-wide">
                    {volunteer.departmentOrRole}
                  </p>
                </div>

                <div className="relative mt-8 bg-background/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <Quote className="absolute -top-5 -left-4 w-10 h-10 text-primary/20 rotate-180" />
                  <p className="font-sans text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap relative z-10">
                    {volunteer.story}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState 
              title="ULES Volunteer of the Month" 
              message="We are currently reviewing this month's extraordinary volunteers. Check back soon for the latest feature!" 
            />
          )}
        </Reveal>

        {/* Lecturer of the Month */}
        <Reveal delay={0.2}>
          {lecturer ? (
            <div className="relative rounded-[2rem] overflow-hidden bg-accent/5 border border-accent/10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center p-6 md:p-12 shadow-sm">
              {/* Text goes first on Desktop, second on Mobile */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6 order-2 lg:order-1">
                <div>
                  <span className="inline-block text-primary font-bold text-sm tracking-widest uppercase mb-4">
                    ULES Lecturer of the Month • {lecturer.monthYear}
                  </span>
                  <h2 className="font-heading text-5xl lg:text-6xl uppercase leading-none text-foreground mb-4">
                    {lecturer.name}
                  </h2>
                  <p className="text-xl text-accent font-medium tracking-wide">
                    {lecturer.departmentOrRole}
                  </p>
                </div>

                <div className="relative mt-8 bg-background/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <Quote className="absolute -top-5 -left-4 w-10 h-10 text-accent/20 rotate-180" />
                  <p className="font-sans text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap relative z-10">
                    {lecturer.story}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 relative h-[450px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2">
                <Image 
                  src={lecturer.imageUrl} 
                  alt={lecturer.name} 
                  fill 
                  className="object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          ) : (
            <EmptyState 
              title="ULES Lecturer of the Month" 
              message="We are compiling the outstanding contributions of our faculty. The featured lecturer will be announced shortly." 
            />
          )}
        </Reveal>

      </div>
    </main>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="w-full rounded-[2rem] border border-dashed border-border/60 bg-muted/10 py-24 px-6 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-8 shadow-inner">
        <Star className="w-10 h-10 text-primary/40" />
      </div>
      <h3 className="font-heading text-4xl uppercase text-foreground mb-4">{title}</h3>
      <p className="text-muted-foreground max-w-lg mx-auto text-lg leading-relaxed">{message}</p>
    </div>
  );
}
