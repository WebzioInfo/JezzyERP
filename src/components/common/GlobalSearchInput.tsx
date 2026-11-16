"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Users, Building2, Package, CreditCard, ShoppingCart, X } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { SearchResultItem } from "@/features/search/services/GlobalSearchService";

export function GlobalSearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const performSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (res.data?.results) {
        setResults(res.data.results);
        setIsOpen(true);
      }
    } catch (err) {
      console.error("[GLOBAL_SEARCH_UI_ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  };

  const getItemIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'CLIENT': return <Users className="w-4 h-4 text-blue-600" />;
      case 'VENDOR': return <Building2 className="w-4 h-4 text-purple-600" />;
      case 'INVOICE': return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'PURCHASE': return <ShoppingCart className="w-4 h-4 text-indigo-600" />;
      case 'PRODUCT': return <Package className="w-4 h-4 text-amber-600" />;
      case 'PAYMENT': return <CreditCard className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="relative w-36 sm:w-56 md:w-72" ref={dropdownRef}>
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-900 transition-colors shadow-2xs">
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin shrink-0" />
        ) : (
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search..."
          aria-label="Global search across ERP"
          className="bg-transparent border-none text-xs font-normal focus:ring-0 placeholder:text-slate-400 w-full text-slate-900 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setIsOpen(false); }}
            aria-label="Clear query"
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Global Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 sm:left-0 sm:right-auto w-72 sm:w-80 mt-1.5 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-reveal max-h-96 overflow-y-auto custom-scrollbar">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching ERP records found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="px-3 py-2 bg-slate-50 text-slate-500 text-xs font-medium flex justify-between items-center border-b border-slate-100">
                <span>Results ({results.length})</span>
                <span className="text-[11px] text-slate-400">Esc to close</span>
              </div>
              {results.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item.url)}
                  className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900 truncate group-hover:text-slate-700">
                          {item.title}
                        </span>
                        {item.status && (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {item.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  {item.amount && (
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-slate-900 tabular-nums block">{item.amount}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
