import Link from 'next/link';
import Image from 'next/image';
import { SOCIALS, QUICK_LINKS, ACTIVITIES } from '../../constants';
import { LocationIcon, MessageIcon, PhoneIcon } from '../../icons';
import { NewsletterForm } from './newsletter';
import { SmartLink } from '../../ui/smart-link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-primary text-white">
      <div className="mx-auto w-full max-w-360 px-4 py-8 xs:px-[4.1%] sm:py-10 lg:px-[4.5%] lg:py-12 xl:px-[7.778%] 2xl:max-w-[84.44%] 2xl:px-0">
        
        {/* Footer Section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-10">
          
          <div className="flex flex-col gap-3.5">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <Image
                src="/logo/logo-transparent.png"
                alt="ULES Logo"
                width={40}
                height={40}
                priority
                className="size-9 shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-sm font-bold tracking-wider text-white uppercase">
                  University of Lagos
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-emerald-200/90 uppercase">
                  Engineering Society
                </span>
              </div>
            </Link>

            <p className="text-xs/relaxed text-white/70 max-w-xs">
              Representing and elevating engineering students across all departments since 1964.
            </p>

            <ul className="mt-1 flex items-center gap-2" role="list">
              {SOCIALS.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${name}`}
                    title={name}
                    className="flex size-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/75 transition-all duration-200 hover:bg-white/15 hover:border-white/25 hover:text-white"
                  >
                    <Icon className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-white/70">
              <ul className="flex flex-col gap-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <SmartLink
                      href={link.href ?? '#'}
                      className="transition-colors hover:text-white"
                    >
                      {link.trigger}
                    </SmartLink>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-2">
                {ACTIVITIES.map((link) => (
                  <li key={link.href}>
                    <SmartLink
                      href={link.href ?? '#'}
                      className="transition-colors hover:text-white"
                    >
                      {link.trigger}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <LocationIcon className="mt-0.5 size-4 shrink-0 text-white/80 [&_path]:stroke-current" />
                <span className="leading-snug">
                  ULES Secretariat, Faculty of Engineering, UNILAG
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageIcon className="size-4 shrink-0 text-white/80 [&_path]:stroke-current" />
                <a
                  href="mailto:unilagengr@gmail.com"
                  className="truncate transition-colors hover:text-white"
                >
                  unilagengr@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="size-4 shrink-0 text-white/80 [&_path]:stroke-current" />
                <span className="whitespace-nowrap">
                  Olawale: +234 813 023 4284
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="size-4 shrink-0 text-white/80 [&_path]:stroke-current" />
                <span className="whitespace-nowrap">
                  Ogboro: +234 816 658 4997
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Newsletter
            </h3>
            <p className="text-xs text-white/70">
              Get the latest updates, events, and opportunities delivered to your inbox.
            </p>
            <div className="w-full">
              <NewsletterForm />
            </div>
          </div>

        </div>

        {/* Bottom Bar: Compact & Minimalist */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/60 sm:flex-row sm:pt-6">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} University of Lagos Engineering Society. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

