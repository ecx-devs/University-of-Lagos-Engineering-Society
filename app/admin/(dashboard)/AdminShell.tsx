'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, User, X } from 'lucide-react';
import { SidebarNav } from './SidebarNav';

interface AdminShellProps {
  children: React.ReactNode;
  isSuperAdmin: boolean;
  userEmail?: string | null;
  userName?: string | null;
  userImage?: string | null;
  signOutAction: () => Promise<void>;
}

export default function AdminShell({
  children,
  isSuperAdmin,
  userEmail,
  userName,
  userImage,
  signOutAction,
}: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Derive header title from pathname
  const getHeaderTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname.startsWith('/admin/leadership')) return 'Leadership';
    if (pathname.startsWith('/admin/news')) return 'News & Digest';
    if (pathname.startsWith('/admin/blog')) return 'Blog Posts';
    if (pathname.startsWith('/admin/events')) return 'Events & Gallery';
    if (pathname.startsWith('/admin/submissions')) return 'Submissions';
    if (pathname.startsWith('/admin/spotlights')) return 'Spotlights';
    if (pathname.startsWith('/admin/associations')) return 'Associations';
    if (pathname.startsWith('/admin/users')) return 'Administrators';
    if (pathname.startsWith('/admin/settings')) return 'Settings';
    return 'Admin Portal';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-['Neue_Machina']">
      {/* Desktop Sidebar (Docked, visible on lg+ screens) */}
      <aside className="hidden lg:flex w-64 bg-[#170A51] flex-col text-white flex-shrink-0 border-r border-[#22203E]">
        <div className="h-16 flex items-center px-5 bg-[#22203E] border-b border-[#22203E]">
          <Link
            href="/admin"
            className="group flex items-center gap-3 transition-opacity hover:opacity-95"
          >
            <div className="relative size-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-amber-400/40 transition-colors">
              <Image
                src="/logo/logo-transparent.png"
                alt="ULES Logo"
                width={32}
                height={32}
                className="size-full object-contain"
                priority
              />
            </div>
            <span className="font-['Anton'] text-xl tracking-widest text-white group-hover:text-amber-400 transition-colors leading-none">
              ULES ADMIN
            </span>
          </Link>
        </div>

        <SidebarNav isSuperAdmin={isSuperAdmin} />

        <div className="p-4 border-t border-[#22203E] bg-[#170A51]/50">
          <div className="text-[11px] text-gray-400 text-center mb-1 font-medium">Logged in as</div>
          <div className="truncate text-xs font-semibold text-center text-gray-200" title={userEmail || ''}>
            {userEmail}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop & Sliding Panel */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#170A51] flex flex-col text-white shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Header */}
        <div className="h-16 flex items-center justify-between px-5 bg-[#22203E] border-b border-[#22203E]">
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="relative size-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-white/10">
              <Image
                src="/logo/logo-transparent.png"
                alt="ULES Logo"
                width={32}
                height={32}
                className="size-full object-contain"
                priority
              />
            </div>
            <span className="font-['Anton'] text-xl tracking-widest text-white leading-none">
              ULES ADMIN
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <SidebarNav
          isSuperAdmin={isSuperAdmin}
          onNavigate={() => setMobileMenuOpen(false)}
        />

        {/* Mobile Drawer Footer with User Info and Sign Out */}
        <div className="p-4 border-t border-[#22203E] space-y-3 bg-[#170A51]/80">
          <div className="flex items-center gap-3">
            {userImage ? (
              <img
                src={userImage}
                alt={userName || 'Profile'}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full border border-gray-300 object-cover shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{userName || 'Administrator'}</p>
              <p className="text-[11px] text-gray-400 truncate">{userEmail}</p>
            </div>
          </div>

          <form action={signOutAction} className="pt-1">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-white/10 hover:bg-[#C85B15] text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header Navigation */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger button for mobile / tablet */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h2 className="font-['Anton'] text-lg sm:text-xl text-[#106333] tracking-wide truncate">
              {getHeaderTitle()}
            </h2>
          </div>

          {/* User Profile & Sign Out (Right Side) */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="flex items-center gap-2.5">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName || 'Profile'}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#170A51]/10 text-[#170A51] border border-gray-200 flex items-center justify-center font-bold text-xs shrink-0">
                  {userName ? (
                    userName.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline max-w-[140px] md:max-w-[180px] truncate">
                {userName || 'Administrator'}
              </span>
            </div>

            <div className="w-px h-5 bg-gray-200 hidden sm:block" />

            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-[#C85B15] transition-colors py-1 px-2 rounded-md hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        {/* Scrollable Page Content with Responsive Padding */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
