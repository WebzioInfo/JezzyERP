"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Users, Building2, Package, CreditCard, ShoppingCart, ArrowRight } from "lucide-react";
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      case 'CLIENT': return <Users className="w-4 h-4 text-blue-500" />;
      case 'VENDOR': return <Building2 className="w-4 h-4 text-indigo-500" />;
      case 'INVOICE': return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'PURCHASE': return <ShoppingCart className="w-4 h-4 text-purple-500" />;
      case 'PRODUCT': return <Package className="w-4 h-4 text-amber-500" />;
      case 'PAYMENT': return <CreditCard className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="relative w-64 md:w-80" ref={dropdownRef}>
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all shadow-sm">
        {loading ? (
          <Loader2 className="w-4 h-4 text-primary-500 animate-spin shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search ERP (inv, client, vendor)..."
          className="bg-transparent border-none text-xs font-bold focus:ring-0 placeholder:text-slate-400 w-full text-slate-900 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-700 px-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Global Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-200 max-h-96 overflow-y-auto custom-scrollbar">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              No matching ERP records found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex justify-between items-center">
                <span>ERP Search Results ({results.length})</span>
                <span className="opacity-60">Click or press Enter</span>
              </div>
              {results.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item.url)}
                  className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 tracking-tight truncate group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </span>
                        {item.status && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {item.status}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  {item.amount && (
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black italic text-slate-900 block">{item.amount}</span>
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
