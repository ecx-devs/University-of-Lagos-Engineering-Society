
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isExternalHref } from '@/lib/links';
import { SmartLink } from '../ui/smart-link';
import { NAV_ITEMS } from '../constants';
import { MenuIcon, CloseIcon } from '../icons';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '../ui/menubar';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '../ui/sheet';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();


  
  const navigate = (href: string) => {
    if (isExternalHref(href)) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    

    const [, hash] = href.split('#');
    setActiveHash(hash ? `#${hash}` : '');

    router.push(href);
  };


  const [isMobileOpen, setIsMobileOpen] = useState(false);


  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);


  const toggleAccordion = (trigger: string) => {
    setOpenMobileAccordion((prev) => (prev === trigger ? null : trigger));
  };


  const closeMobileNav = () => {
    setIsMobileOpen(false);
    setOpenMobileAccordion(null);
  };



  useEffect(() => {
    setIsMobileOpen(false);
    setOpenMobileAccordion(null);
  }, [pathname]);


  const [activeHash, setActiveHash] = useState('');
  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      {/* Navigation Header */}
      <div className="xs:px-[4.1%] flex w-full max-w-360 items-center justify-between px-4 lg:px-[4.5%] xl:px-[7.778%] 2xl:mx-auto 2xl:max-w-[84.44%] 2xl:px-0">
        
        <Link href="/" className="my-[2.5px] flex items-center gap-2">
          <Image
            src="/ules-logo.png"
            alt="ULES Logo"
            width={276}
            height={60}
            priority
            className="x-[276px] y-15"
          />
        </Link>

        
        <Menubar modal={false} className="hidden border-none bg-transparent shadow-none lg:flex">
          {NAV_ITEMS.map((menu) => {

            const isSingleActive = menu.href && pathname === menu.href;
            const isParentActive = menu.items?.some((item) => pathname.startsWith(item.href));
            const isActive = isSingleActive || isParentActive;

            return (
              <MenubarMenu key={menu.trigger}>
                <MenubarTrigger


                  className={cn(
                    'group flex cursor-pointer items-center gap-1 transition-colors',
                    'text-center font-sans text-sm font-normal tracking-normal whitespace-nowrap',
                    isActive 
                      ? 'text-primary bg-primary/5' 
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary',
                  )}
                  onClick={() => menu.href && navigate(menu.href)}
                >
                  {menu.trigger}

                  
                  {menu.items && (
                    <ChevronDown
                      className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                </MenubarTrigger>

                
                {menu.items && (
                  <MenubarContent className="min-w-max">
                    {menu.items.map((item) => {

                      const [itemPath, itemHash] = item.href.split('#');


                      const isChildActive = pathname === itemPath && (itemHash ? activeHash === `#${itemHash}` : activeHash === '');


                      const finalHref = isChildActive && itemHash ? `#${itemHash}` : item.href;

                      return (
                        <MenubarItem
                          key={item.href}

                          className={cn(
                            'w-full cursor-pointer whitespace-nowrap transition-colors',
                            'font-sans text-sm font-normal tracking-normal',
                            isChildActive
                              ? 'text-primary bg-primary/5 focus:text-primary focus:bg-primary/10'
                              : 'text-foreground focus:bg-primary focus:text-primary-foreground',
                          )}
                          onClick={() => navigate(finalHref)}
                        >
                          {item.label}
                        </MenubarItem>
                      );
                    })}
                  </MenubarContent>
                )}
              </MenubarMenu>
            );
          })}
        </Menubar>

        
        <Button
          className="hidden px-5 text-white lg:block xl:w-42.5"
          onClick={() => router.push('/contact')}
        >
          Contact Us
        </Button>

        
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-primary py-[6.25px] hover:bg-transparent lg:hidden"
              />
            }
          >
            <MenuIcon className="size-6 shrink-0" />
            <span className="sr-only">Toggle mobile menu</span>
          </SheetTrigger>

          <SheetContent
            side="right"
            showCloseButton={false}
            className={cn(
              'flex flex-col gap-6 overflow-y-auto pt-0',

              'xs:w-97.5 w-full max-w-[100vw]',

              'xs:px-[4.1%] px-4',
            )}
          >
            
            <div className="flex h-16.25 w-full items-center justify-end border-b border-transparent">
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-primary py-[6.25px] hover:bg-transparent"
                  />
                }
              >
                <CloseIcon className="size-6 shrink-0" />
                <span className="sr-only">Close mobile menu</span>
              </SheetClose>
            </div>

            
            <SheetHeader className="sr-only text-left">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>

            <nav className="mt-2 flex flex-col gap-2">
              {NAV_ITEMS.map((menu) => {
                const isSingleActive = menu.href && pathname === menu.href;
                const isParentActive = menu.items?.some((item) => pathname.startsWith(item.href));
                const isActive = isSingleActive || isParentActive;

                const isOpen = openMobileAccordion === menu.trigger;

                return (
                  <div
                    key={menu.trigger}
                    className="border-border/50 flex flex-col border-b pb-2 last:border-0"
                  >
                    
                    <div
                      className={cn(
                        'flex cursor-pointer items-center justify-between py-3 font-sans text-base font-medium transition-colors',
                        isActive ? 'text-primary' : 'text-foreground',
                      )}
                      onClick={() => {
                        if (menu.href) {
                          navigate(menu.href);
                          closeMobileNav();
                        } else if (menu.items) {
                          toggleAccordion(menu.trigger);
                        }
                      }}
                    >
                      {menu.trigger}

                      
                      {menu.items && (
                        <ChevronDown
                          className={cn(
                            'text-muted-foreground size-4 transition-transform duration-200',
                            isOpen && 'text-primary rotate-180',
                          )}
                        />
                      )}
                    </div>

                    
                    {menu.items && (
                      <div
                        className={cn(
                          'flex flex-col overflow-hidden transition-all duration-300 ease-in-out',
                          isOpen ? 'mt-1 mb-2 max-h-100 opacity-100' : 'max-h-0 opacity-0',
                        )}
                      >
                        <div className="border-primary/20 ml-1 flex flex-col gap-4 border-l-2 py-1 pl-4">
                          {menu.items.map((item) => {


                            const [itemPath, itemHash] = item.href.split('#');
                            const isChildActive = pathname === itemPath && (itemHash ? activeHash === `#${itemHash}` : activeHash === '');
                            const finalHref =
                              isChildActive && itemHash ? `#${itemHash}` : item.href;

                            return (
                              <SmartLink
                                key={item.href}
                                href={finalHref}
                                onClick={closeMobileNav}
                                className={cn(
                                  'py-1 text-sm transition-colors',
                                  isChildActive
                                    ? 'text-primary font-medium'
                                    : 'text-muted-foreground hover:text-primary',
                                )}
                              >
                                {item.label}
                              </SmartLink>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            
            <div className="mt-auto pt-4 pb-8">
              <Button
                className="w-full text-white"
                onClick={() => {
                  router.push('/contact');
                  closeMobileNav();
                }}
              >
                Contact Us
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
