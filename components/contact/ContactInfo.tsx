import Link from 'next/link';
import { MessageIcon, LocationIcon } from '../icons';
import { SOCIALS } from '../constants';

export function ContactInfo() {
  return (
    <section className="xs:px-[4.1%] mt-4 px-4 pt-0 pb-27.5 lg:px-[5.7855%] xl:px-[10%]">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-primary text-3xl/9 font-medium tracking-tight md:text-4xl">
          Contact Information
        </h2>
        <p className="mt-4 text-base/6 text-foreground md:text-lg/7">
          Have a question or want to work with us? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Email Card */}
        <div className="group flex flex-col items-start rounded-2xl border border-border/50 bg-accent/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md hover:bg-accent/50 lg:p-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-accent text-primary transition-colors [&_path]:stroke-primary">
            <MessageIcon className="size-6" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-primary">Email</h3>
          <p className="text-sm/5 text-muted-foreground mb-6">
            Our friendly team is here to help.
          </p>
          <a href="mailto:unilagengr@gmail.com" className="text-primary mt-auto text-base/6 font-medium hover:underline">
            unilagengr@gmail.com
          </a>
        </div>

        {/* Address Card */}
        <div className="group flex flex-col items-start rounded-2xl border border-border/50 bg-accent/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md hover:bg-accent/50 lg:p-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-accent text-primary transition-colors [&_path]:stroke-primary">
            <LocationIcon className="size-6" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-primary">Address</h3>
          <p className="text-sm/5 text-muted-foreground mb-6">
            Come visit our faculty.
          </p>
          <p className="mt-auto text-base/6 text-foreground">
            Faculty of Engineering<br />
            University of Lagos<br />
            Akoka, Yaba Lagos, Nigeria
          </p>
        </div>

        {/* Socials Card */}
        <div className="group flex flex-col items-start rounded-2xl border border-border/50 bg-accent/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md hover:bg-accent/50 lg:p-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-accent text-primary transition-colors [&_path]:stroke-primary [&_circle]:stroke-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-primary">Follow Us</h3>
          <p className="text-sm/5 text-muted-foreground mb-6">
            Stay updated with our latest news and events.
          </p>
          <ul className="mt-auto flex flex-wrap gap-3" role="list">
            {SOCIALS.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${name} page (opens in a new tab)`}
                  title={name}
                  className="bg-primary hover:bg-primary/80 flex size-11 items-center justify-center rounded-full transition-all duration-300 ease-in-out lg:size-12 text-primary-foreground"
                >
                  <Icon className="size-5 lg:size-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sponsorship Banner */}
      <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary/5 px-6 py-10 text-center md:flex-row md:px-10 md:text-left lg:px-12 lg:py-12 border border-primary/10">
        <div className="max-w-2xl">
          <h3 className="mb-3 text-2xl font-semibold text-primary">Sponsorship & Partnerships</h3>
          <p className="text-base/6 text-foreground">
            Interested in taking part in ULES initiatives as a Sponsor or Partner? We'd love to collaborate with you to empower the next generation of engineers.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="mailto:unilagengr@gmail.com"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Reach out to us
          </Link>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-border/50 bg-muted/20 shadow-sm relative group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100" />
        <iframe
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=Faculty%20of%20Engineering,%20University%20of%20Lagos&t=&z=15&ie=UTF8&iwloc=&output=embed"
          title="Map to Faculty of Engineering, University of Lagos"
          className="relative z-10"
        />
      </div>
    </section>
  );
}
