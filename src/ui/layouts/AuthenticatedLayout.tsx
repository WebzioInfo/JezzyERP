"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store/uiStore";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SidebarSkeleton, ChartSkeleton } from "@/ui/core/Skeleton";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
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
  Power,
  Trash2,
  Layers,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { NavigationProgressBar } from "@/components/common/NavigationProgressBar";
import { logoutAction } from "@/features/auth/actions/auth";

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
    label: "EXECUTIVE",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Fin Overview",
        exact: true,
      },
      {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
        description: "Statements",
      },
    ],
  },
  {
    label: "BANKING",
    items: [
      {
        name: "Accounts",
        href: "/accounts",
        icon: Building2,
        description: "Banks & Cash",
      },
      {
        name: "Transactions",
        href: "/transactions",
        icon: Layers,
        description: "Unified Ledger",
      },
      {
        name: "Payments",
        href: "/payments",
        icon: CreditCard,
        description: "Money Transfers",
      },
    ],
  },
  {
    label: "SALES",
    items: [
      {
        name: "Invoices",
        href: "/invoices",
        icon: FileText,
        description: "Tax Billing",
      },
      {
        name: "Quotations",
        href: "/quotations",
        icon: ClipboardList,
        description: "Estimates",
      },
      {
        name: "Clients",
        href: "/clients",
        icon: Users,
        description: "Customers",
      },
    ],
  },
  {
    label: "PROCUREMENT",
    items: [
      {
        name: "Purchases",
        href: "/purchases",
        icon: FilePlus,
        description: "Supplier Bills",
      },
      {
        name: "Expenses",
        href: "/expenses",
        icon: Trash2,
        description: "Overheads",
      },
      {
        name: "Vendors",
        href: "/vendors",
        icon: Building2,
        description: "Suppliers",
      },
    ],
  },
  {
    label: "ASSETS",
    items: [
      {
        name: "Products",
        href: "/products",
        icon: Package,
        description: "Master Catalog",
      },
      {
        name: "Inventory",
        href: "/inventory",
        icon: TrendingUp,
        description: "Stock Levels",
      },
    ],
  },
  {
    label: "CAPITAL",
    items: [
      {
        name: "Loans & Advances",
        href: "/loans",
        icon: LifeBuoy,
        description: "Capital & Pre-payments",
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Configuration",
      },
      {
        name: "Trash",
        href: "/trash",
        icon: Trash2,
        description: "Deleted Records",
      },
      {
        name: "Support",
        href: "/support",
        icon: LifeBuoy,
        description: "Help Desk",
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
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen, setSidebarCollapsed } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync sidebar state from store persistence if needed or just use it
  useEffect(() => {
    // Zustand persist takes care of it, but we can sync manually if required
  }, []);

  if (!isMounted) {
    return <SidebarSkeleton />;
  }


  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <NavigationProgressBar />
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col transition-all duration-300 z-50 relative bg-white border-r border-slate-200",
          !sidebarCollapsed ? "w-(--sidebar-width)" : "w-(--sidebar-collapsed-width)"
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <React.Suspense fallback={<SidebarSkeleton />}>
            <SidebarContent sidebarCollapsed={sidebarCollapsed} pathname={pathname} />
          </React.Suspense>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm z-50 transition-all"
        >
          {sidebarCollapsed ? <ChevronRightIcon size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* ── Mobile Menu (Overlay) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Sidebar ── */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-(--sidebar-width) z-70 transition-transform duration-300 bg-slate-50 border-r border-slate-200 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-slate-900 tracking-tight">JEZZY ERP</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar" data-lenis-prevent>
            <SidebarContent pathname={pathname} isMobile />
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 scroll-smooth" data-lenis-prevent>
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
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
  sidebarCollapsed = false,
  isMobile = false
}: {
  pathname: string;
  sidebarCollapsed?: boolean;
  isMobile?: boolean;
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);

  useEffect(() => {
    setNavigatingHref(null);
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex-1 flex flex-col py-8 overflow-hidden">
      {!isMobile && !sidebarCollapsed && (
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm tracking-tight">JEZZY ERP</p>
          </div>
        </div>
      )}

      {!isMobile && sidebarCollapsed && (
        <div className="flex justify-center mb-8">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <nav className={cn(
        "flex-1 space-y-4 pb-10",
        sidebarCollapsed ? "overflow-y-auto scrollbar-hide px-2" : "overflow-y-auto px-4 custom-scrollbar"
      )} data-lenis-prevent>
        {NAV_SECTIONS.map((section) => {
          const { expandedSections, toggleSection } = useUIStore();
          const isExpanded = expandedSections.includes(section.label);

          return (
            <div key={section.label} className="animate-reveal">
              {!sidebarCollapsed && (
                <button
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-4 mb-2 rounded-md hover:bg-slate-200 py-1.5 group/label"
                >
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-2 group-hover/label:text-slate-700 transition-colors">
                    {section.label}
                  </p>
                  <ChevronRightIcon
                    size={14}
                    className={cn(
                      "text-slate-400 transition-transform duration-300",
                      isExpanded ? "rotate-90" : "rotate-0"
                    )}
                  />
                </button>
              )}
              {sidebarCollapsed && (
                <div className="h-px bg-slate-100/50 mx-4 my-6" />
              )}

              <AnimatePresence initial={false}>
                {(isExpanded || sidebarCollapsed) && (
                  <motion.ul
                    initial={isMobile || sidebarCollapsed ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    {section.items.map((item) => {
                      const active = isActive(item.href, item.exact);
                      const isLoading = navigatingHref === item.href;

                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => {
                              if (item.href !== pathname) {
                                setNavigatingHref(item.href);
                              }
                            }}
                            className={cn(
                              "group flex items-center gap-3 rounded-md transition-all duration-200 relative overflow-hidden",
                              active
                                ? "bg-slate-200 text-slate-900 py-2 font-medium"
                                : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 py-2",
                              sidebarCollapsed ? "justify-center px-0" : "px-4"
                            )}
                            title={sidebarCollapsed ? item.name : ""}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                            ) : (
                              <item.icon
                                className={cn(
                                  "h-4 w-4 shrink-0 transition-all",
                                  active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                                )}
                              />
                            )}
                            {!sidebarCollapsed && <span className="flex-1 truncate text-sm">{item.name}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="px-4 pt-6 mt-auto shrink-0 space-y-4">
        {!sidebarCollapsed ? (
          <div className="relative group">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={cn(
                "w-full p-3 flex items-center gap-3 rounded-md transition-all duration-200",
                isProfileMenuOpen ? "bg-slate-200" : "hover:bg-slate-200/50"
              )}
            >
              <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-xs font-medium text-white">EA</div>
              <div className="min-w-0 text-left flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">JEZZY Admin</p>
                <p className="text-xs text-slate-500 truncate">Master Node</p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 w-full mb-2 z-50"
                >
                  <form action={logoutAction}>
                    <button className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-md font-medium text-xs flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors">
                      <Power className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 relative">
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute bottom-0 left-full ml-4 z-50 w-40"
                >
                  <form action={logoutAction}>
                    <button className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-md font-medium text-xs flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors">
                      <Power className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold border transition-colors",
                isProfileMenuOpen ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              )}
            >
              EA
            </button>
          </div>
        )}
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
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">{subtitle}</span>
          <span className="text-slate-300">/</span>
          <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md w-64 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-300 transition-all">
          <Search size={14} className="text-slate-400" />
          <input
            placeholder="Search system..."
            className="bg-transparent border-none text-sm focus:ring-0 placeholder:text-slate-400 w-full text-slate-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          <Link href="/settings" className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}


