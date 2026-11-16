"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store/uiStore";
import Link from "next/link";
import { SidebarSkeleton } from "@/ui/core/Skeleton";
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
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  Building2,
  Power,
  Trash2,
  Layers,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { NavigationProgressBar } from "@/components/common/NavigationProgressBar";
import { GlobalSearchInput } from "@/components/common/GlobalSearchInput";
import { logoutAction } from "@/features/auth/actions/auth";

import { cn } from "@/utils";

// ==========================================
// NAVIGATION STRUCTURE
// ==========================================
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  exact?: boolean;
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
        description: "Financial Overview",
        exact: true,
      },
      {
        name: "Reports",
        href: "/reports",
        icon: BarChart3,
        description: "Financial Statements",
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
        description: "Collections & Dues",
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
        description: "Tax Invoices",
      },
      {
        name: "Quotations",
        href: "/quotations",
        icon: ClipboardList,
        description: "Sales Quotations",
      },
      {
        name: "Clients",
        href: "/clients",
        icon: Users,
        description: "Customer Directory",
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
        description: "Vendor Bills",
      },
      {
        name: "Expenses",
        href: "/expenses",
        icon: CreditCard,
        description: "Operating Expenses",
      },
      {
        name: "Vendors",
        href: "/vendors",
        icon: Building2,
        description: "Supplier Directory",
      },
    ],
  },
  {
    label: "INVENTORY",
    items: [
      {
        name: "Products",
        href: "/products",
        icon: Package,
        description: "Product Master",
      },
      {
        name: "Inventory",
        href: "/inventory",
        icon: TrendingUp,
        description: "Stock Adjustments",
      },
    ],
  },
  {
    label: "CAPITAL",
    items: [
      {
        name: "Loans & Advances",
        href: "/loans",
        icon: Layers,
        description: "Capital & Advances",
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
        description: "Documentation",
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
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  if (!isMounted) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <NavigationProgressBar />
      
      {/* ── Desktop Sidebar ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col transition-all duration-300 z-50 relative bg-white border-r border-slate-200 shrink-0",
          !sidebarCollapsed ? "w-[260px]" : "w-[72px]"
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <SidebarContent sidebarCollapsed={sidebarCollapsed} pathname={pathname} />
        </div>

        {/* Sidebar Toggle Tab */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-xs z-50 transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* ── Mobile Backdrop ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-[270px] z-70 transition-transform duration-300 ease-out bg-white border-r border-slate-200 lg:hidden shadow-xl",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-900 tracking-tight block leading-tight">JEZZY ERP</span>
                <span className="text-[10px] text-slate-400 block font-normal">Command Center</span>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              aria-label="Close sidebar"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar" data-lenis-prevent>
            <SidebarContent pathname={pathname} isMobile />
          </div>
        </div>
      </aside>

      {/* ── Main App Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 scroll-smooth" data-lenis-prevent>
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
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
// SIDEBAR CONTENT
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
  const { expandedSections, toggleSection } = useUIStore();

  useEffect(() => {
    setNavigatingHref(null);
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex-1 flex flex-col py-4 overflow-hidden">
      {!isMobile && !sidebarCollapsed && (
        <div className="px-5 mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm tracking-tight leading-tight">JEZZY ERP</p>
            <p className="text-[11px] text-slate-400 font-normal truncate">Enterprise Command Center</p>
          </div>
        </div>
      )}

      {!isMobile && sidebarCollapsed && (
        <div className="flex justify-center mb-5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs" title="JEZZY ERP">
            <Building2 className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <nav className={cn(
        "flex-1 space-y-3 pb-6",
        sidebarCollapsed ? "overflow-y-auto scrollbar-hide px-2" : "overflow-y-auto px-3 custom-scrollbar"
      )} data-lenis-prevent>
        {NAV_SECTIONS.map((section) => {
          const isExpanded = expandedSections.includes(section.label);

          return (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-2.5 py-1 mb-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors group cursor-pointer"
                >
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 group-hover:text-slate-600 uppercase">
                    {section.label}
                  </span>
                  <ChevronRight
                    size={12}
                    className={cn(
                      "text-slate-400 transition-transform duration-200",
                      isExpanded ? "rotate-90" : "rotate-0"
                    )}
                  />
                </button>
              )}
              {sidebarCollapsed && (
                <div className="h-px bg-slate-100 mx-2 my-3" />
              )}

              <AnimatePresence initial={false}>
                {(isExpanded || sidebarCollapsed) && (
                  <motion.ul
                    initial={isMobile || sidebarCollapsed ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-0.5 overflow-hidden"
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
                              "group flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors relative",
                              active
                                ? "bg-slate-900 text-white font-medium"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                              sidebarCollapsed ? "justify-center p-2" : "px-2.5 py-2"
                            )}
                            title={sidebarCollapsed ? `${item.name} - ${item.description}` : ""}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                            ) : (
                              <item.icon
                                className={cn(
                                  "h-4 w-4 shrink-0 transition-colors",
                                  active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                                )}
                              />
                            )}
                            {!sidebarCollapsed && <span className="flex-1 truncate">{item.name}</span>}
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

      {/* User / Profile Footer */}
      <div className="px-3 pt-3 mt-auto shrink-0 border-t border-slate-100">
        {!sidebarCollapsed ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={cn(
                "w-full p-2 flex items-center gap-2.5 rounded-lg transition-colors cursor-pointer text-left",
                isProfileMenuOpen ? "bg-slate-100" : "hover:bg-slate-100"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                EA
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">JEZZY Admin</p>
                <p className="text-[11px] text-slate-400 truncate">Administrator</p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 w-full mb-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-lg z-50"
                >
                  <form action={logoutAction}>
                    <button 
                      type="submit"
                      className="w-full text-slate-700 hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Power className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                      <span>Log Out</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center relative">
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-0 left-full ml-2 z-50 w-36 p-1 bg-white rounded-xl border border-slate-200 shadow-lg"
                >
                  <form action={logoutAction}>
                    <button 
                      type="submit"
                      className="w-full text-slate-700 hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Power className="w-4 h-4 text-slate-400" />
                      <span>Log Out</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              title="Profile & Settings"
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-colors cursor-pointer",
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

// ==========================================
// APP HEADER
// ==========================================
function Header({
  onMenuClick
}: {
  onMenuClick: () => void;
}) {
  const pathname = usePathname();

  const getPageInfo = () => {
    for (const section of NAV_SECTIONS) {
      const item = section.items.find(i => i.href === pathname);
      if (item) return { title: item.name, subtitle: section.label };
    }

    if (pathname.startsWith('/invoices/new')) return { title: "New Invoice", subtitle: "SALES" };
    if (pathname.includes('/invoices/')) return { title: "Invoice Details", subtitle: "SALES" };
    if (pathname.startsWith('/quotations/new')) return { title: "New Quotation", subtitle: "SALES" };
    if (pathname.includes('/quotations/')) return { title: "Quotation Details", subtitle: "SALES" };
    if (pathname.includes('/clients/')) return { title: "Client Details", subtitle: "SALES" };
    if (pathname.startsWith('/purchases/new')) return { title: "New Purchase", subtitle: "PROCUREMENT" };
    if (pathname.includes('/purchases/')) return { title: "Purchase Details", subtitle: "PROCUREMENT" };
    if (pathname.includes('/vendors/')) return { title: "Vendor Details", subtitle: "PROCUREMENT" };
    if (pathname.includes('/accounts/')) return { title: "Account Statement", subtitle: "BANKING" };

    return { title: "Enterprise", subtitle: "JEZZY ERP" };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline text-xs font-semibold text-slate-400 uppercase tracking-wider">{subtitle}</span>
          <span className="hidden sm:inline text-slate-300">/</span>
          <h1 className="text-sm font-semibold text-slate-900 truncate">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <GlobalSearchInput />

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button 
            type="button"
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          <Link 
            href="/settings" 
            aria-label="System Settings"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
