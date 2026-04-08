"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  LogOut,
  FilePlus,
  CreditCard,
  ClipboardList,
  BarChart3,
  ChevronRight,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Search,
  LifeBuoy,
  Building2,
} from "lucide-react";
import { cn } from "@/utils";

// ==========================================
// NAVIGATION STRUCTURE
// ==========================================
interface NavItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  exact?: boolean;
  highlight?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Business overview & KPIs",
        exact: true,
      },
    ],
  },
  {
    label: "Billing",
    items: [
      {
        name: "Invoices",
        href: "/invoices",
        icon: FileText,
        description: "View and manage invoices",
      },
      {
        name: "New Invoice",
        href: "/invoices/new",
        icon: FilePlus,
        description: "Create a new invoice",
        highlight: true,
      },
      {
        name: "Quotations",
        href: "/quotations",
        icon: ClipboardList,
        description: "Create and send estimates",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        name: "Clients",
        href: "/clients",
        icon: Users,
        description: "Client directory & contacts",
      },
      {
        name: "Inventory",
        href: "/products",
        icon: Package,
        description: "Product catalog & pricing",
      },
      {
        name: "Payments",
        href: "/payments",
        icon: CreditCard,
        description: "Record incoming payments",
      },
    ],
  },
  {
    label: "Procurement",
    items: [
      {
        name: "Vendors",
        href: "/vendors",
        icon: Building2,
        description: "Supplier directory & contacts",
      },
      {
        name: "Purchases",
        href: "/purchases",
        icon: FilePlus,
        description: "Track inward inventory & tax",
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
        description: "Revenue & GST summaries",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Company info & preferences",
      },
      {
        name: "Support",
        href: "/support",
        icon: LifeBuoy,
        description: "Professional help & guides",
      },
    ],
  },
];

// ==========================================
// AUTHENTICATED LAYOUT
// ==========================================
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-collapsed", String(!newState));
      return newState;
    });
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden text-slate-900 font-sans">
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50 p-4 relative",
          isSidebarOpen ? "w-(--sidebar-width)" : "w-(--sidebar-collapsed-width)"
        )}
      >
        <div className="clay-card h-full flex flex-col overflow-hidden border-0">
          <SidebarContent isCollapsed={!isSidebarOpen} pathname={pathname} />
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-1 top-24 w-8 h-8 clay-card flex items-center justify-center text-slate-400 shadow-xl hover:text-primary-600 transition-all z-50 hover:scale-110 active:scale-90"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRightIcon size={16} />}
        </button>
      </aside>

      {/* ── Mobile Menu (Overlay) ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-60 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar ── */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-(--sidebar-width) p-4 z-70 transition-transform duration-500 cubic-bezier(0.34,1.56,0.64,1) lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="clay-card h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <Image src="/Logo.png" alt="JEZZY" fill className="object-contain" />
              </div>
              <span className="font-extrabold tracking-tighter text-xl italic text-primary-600"> JEZZY</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 clay-inner flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <SidebarContent pathname={pathname} isMobile />
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-4 scroll-smooth">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function SidebarContent({
  pathname,
  isCollapsed = false,
  isMobile = false
}: {
  pathname: string;
  isCollapsed?: boolean;
  isMobile?: boolean;
}) {
  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex-1 flex flex-col py-8 overflow-hidden">
      {!isMobile && !isCollapsed && (
        <div className="px-8 mb-10 flex items-center gap-4 animate-reveal">

          <div className="min-w-0">
            <p className="font-black text-slate-900 text-2xl leading-none tracking-tighter italic"> JEZZY</p>
            <p className="text-[10px] font-extrabold text-primary-500 uppercase tracking-[0.3em] mt-1">Enterprise</p>
          </div>
        </div>
      )}

      {!isMobile && isCollapsed && (
        <div className="flex justify-center mb-10 animate-reveal">
          <div className="w-10 h-10 relative">
            <Image src="/Logo.png" alt="JEZZY" fill className="object-contain" />
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-10">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="animate-reveal" style={{ animationDelay: '100ms' }}>
            {!isCollapsed && (
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-4 mb-4">
                {section.label}
              </p>
            )}
            {isCollapsed && (
              <div className="h-px bg-slate-100 mx-4 my-6" />
            )}
            <ul className="space-y-2">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-4 rounded-[1.25rem] transition-all duration-300",
                        active
                          ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20 clay-btn py-3.5"
                          : "text-slate-500 hover:bg-slate-50 hover:text-primary-600 py-3",
                        isCollapsed ? "justify-center px-0" : "px-4"
                      )}
                      title={isCollapsed ? item.name : ""}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all group-hover:scale-110",
                          active ? "text-white" : "text-slate-400 group-hover:text-primary-500"
                        )}
                      />
                      {!isCollapsed && <span className="flex-1 truncate text-[13px] font-extrabold uppercase tracking-wider">{item.name}</span>}
                      {!isCollapsed && active && <ChevronRightIcon size={14} className="opacity-50" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-4 pt-6 mt-auto shrink-0 space-y-4">
        {!isCollapsed ? (
          <div className="clay-inner p-4 flex items-center gap-4 border border-white/50">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xs font-black shadow-sm text-primary-600 border border-slate-100">EA</div>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-900 truncate leading-none uppercase tracking-tight">JEZZY Admin</p>
              <p className="text-[9px] font-bold text-slate-400 truncate mt-1.5 uppercase tracking-widest bg-slate-100/50 px-2 py-0.5 rounded-full inline-block">v4.2.0-Pro</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xs font-black shadow-sm text-primary-600 border border-slate-100">EA</div>
          </div>
        )}

        <form action="/api/auth/logout" method="POST">
          <button className={cn(
            "w-full flex items-center gap-4 rounded-[1.25rem] py-3 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group",
            isCollapsed ? "justify-center px-0" : "px-4"
          )}>
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

function Header({
  onMenuClick
}: {
  onMenuClick: () => void;
}) {
  const pathname = usePathname();

  const getPageInfo = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length === 0) return { title: "Dashboard", subtitle: "Overview" };

    for (const section of NAV_SECTIONS) {
      const item = section.items.find(i => i.href === pathname);
      if (item) return { title: item.name, subtitle: section.label };
    }

    if (pathname.includes('/invoices/')) return { title: "Invoicing", subtitle: "Billing" };
    if (pathname.includes('/quotations/')) return { title: "Estimates", subtitle: "Billing" };
    if (pathname.includes('/clients/')) return { title: "Corporate", subtitle: "Management" };

    return { title: "Enterprise", subtitle: "JEZZY ERP" };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="h-(--header-height) shrink-0 flex items-center justify-between px-8 bg-transparent backdrop-blur-2xl  sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 clay-card flex items-center justify-center text-slate-500 hover:text-primary-600 transition-all"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>{subtitle}</span>
            <ChevronRight size={10} className="opacity-30" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight font-display italic">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-3 clay-inner px-4 py-2.5 w-72 transition-all focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:bg-white group">
          <Search size={18} className="text-slate-300 group-focus-within:text-primary-500 transition-colors" />
          <input
            placeholder="Search documentation..."
            className="bg-transparent border-none text-[13px] focus:ring-0 placeholder:text-slate-300 w-full font-bold text-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="w-11 h-11 clay-card flex items-center justify-center text-slate-400 hover:text-primary-600 transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white group-hover:scale-125 transition-all shadow-lg shadow-primary-500/30" />
          </button>

          <Link href="/settings" className="w-11 h-11 clay-card flex items-center justify-center text-slate-400 hover:text-primary-600 transition-all overflow-hidden group">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
              <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}


