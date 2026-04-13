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
    <div className="flex h-screen mesh-bg-soft overflow-hidden text-slate-900 font-sans">
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50 p-4 relative",
          isSidebarOpen ? "w-(--sidebar-width)" : "w-(--sidebar-collapsed-width)"
        )}
      >
        <div className="glass clay-card h-full flex flex-col overflow-hidden border-0 shadow-2xl shadow-primary-900/5">
          <SidebarContent isCollapsed={!isSidebarOpen} pathname={pathname} />
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-24 w-8 h-8 glass clay-card flex items-center justify-center text-slate-400 shadow-xl hover:text-primary-600 transition-all z-50 hover:scale-110 active:scale-90 border-white/50"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRightIcon size={16} />}
        </button>
      </aside>

      {/* ── Mobile Menu (Overlay) ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-60 lg:hidden animate-in fade-in duration-300"
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
        <div className="glass clay-card h-full flex flex-col overflow-hidden border-0">
          <div className="flex items-center justify-between p-6 border-b border-primary-100/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center shadow-lg border border-white/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-black tracking-tighter text-2xl font-display text-primary-600 uppercase">JEZZY</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
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
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 scroll-smooth animate-in">
          <div className="max-w-7xl mx-auto w-full">
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
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden shrink-0">
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
             <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-2xl leading-none tracking-tighter font-display uppercase italic">JEZZY <span className="text-primary-600">ERP</span></p>
            <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.4em] mt-2 bg-primary-50 px-2 py-0.5 rounded-full inline-block">Enterprise</p>
          </div>
        </div>
      )}

      {!isMobile && isCollapsed && (
        <div className="flex justify-center mb-10 animate-reveal">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center shadow-xl border border-white/20 overflow-hidden">
             <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-10">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="animate-reveal">
            {!isCollapsed && (
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-4 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500/30" />
                {section.label}
              </p>
            )}
            {isCollapsed && (
              <div className="h-px bg-slate-100/50 mx-4 my-6" />
            )}
            <ul className="space-y-1.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
                        active
                          ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20 py-3.5"
                          : "text-slate-500 hover:bg-white hover:shadow-lg hover:shadow-primary-900/5 hover:text-primary-600 py-3",
                        isCollapsed ? "justify-center px-0" : "px-4"
                      )}
                      title={isCollapsed ? item.name : ""}
                    >
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                      )}
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all group-hover:scale-110",
                          active ? "text-white" : "text-slate-400 group-hover:text-primary-500"
                        )}
                      />
                      {!isCollapsed && <span className="flex-1 truncate text-xs font-black uppercase tracking-widest">{item.name}</span>}
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
          <div className="glass p-4 flex items-center gap-4 border border-white/50 rounded-2xl shadow-xl shadow-primary-900/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-black shadow-sm text-primary-600 border border-white">EA</div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">JEZZY Admin</p>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Master Node</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black shadow-sm text-primary-600 border border-white">EA</div>
          </div>
        )}

        <form action="/api/auth/logout" method="POST">
          <button className={cn(
            "w-full flex items-center gap-4 rounded-2xl py-3 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group",
            isCollapsed ? "justify-center px-0" : "px-4"
          )}>
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>}
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
    <header className="h-(--header-height) shrink-0 flex items-center justify-between px-8 bg-transparent  sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-11 h-11 glass clay-card flex items-center justify-center text-slate-500 hover:text-primary-600 transition-all"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] opacity-60">
            <span>{subtitle}</span>
            <ChevronRight size={10} className="opacity-30" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter font-display uppercase italic">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-3 glass px-5 py-3 rounded-2xl w-80 transition-all focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:bg-white group border-white/50 shadow-xl shadow-primary-900/5">
          <Search size={18} className="text-slate-300 group-focus-within:text-primary-500 transition-colors" />
          <input
            placeholder="Search system..."
            className="bg-transparent border-none text-[13px] focus:ring-0 placeholder:text-slate-300 w-full font-bold text-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="w-12 h-12 glass clay-card flex items-center justify-center text-slate-400 hover:text-primary-600 transition-all relative group border-white/50 shadow-xl shadow-primary-900/5">
            <Bell size={20} />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-accent-500 rounded-full border-2 border-white group-hover:scale-125 transition-all shadow-lg shadow-accent-500/30" />
          </button>

          <Link href="/settings" className="w-12 h-12 glass clay-card flex items-center justify-center text-slate-400 hover:text-primary-600 transition-all overflow-hidden group border-white/50 shadow-xl shadow-primary-900/5">
             <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
               <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
             </div>
          </Link>
        </div>
      </div>
    </header>
  );
}


