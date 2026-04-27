"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/ui/core/Input";

interface LiveSearchProps {
  placeholder?: string;
  paramName?: string;
  className?: string;
}

export function LiveSearch({
  placeholder = "Search...",
  paramName = "q",
  className,
}: LiveSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [inputValue, setInputValue] = useState(searchParams.get(paramName) || "");
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (inputValue) {
        current.set(paramName, inputValue);
      } else {
        current.delete(paramName);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      
      // Only push if the query has actually changed to avoid loops
      if (query !== (searchParams.toString() ? `?${searchParams.toString()}` : "")) {
        router.push(`${pathname}${query}`);
      }
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, paramName, pathname, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsSearching(true);
  };

  return (
    <div className={`relative group ${className}`}>
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        icon={isSearching ? <Loader2 className="w-5 h-5 text-primary-500 animate-spin" /> : <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />}
        className="h-12 rounded-[1.25rem] bg-slate-50 border-0 ring-1 ring-slate-200 group-focus-within:ring-primary-500 group-focus-within:ring-2 transition-all shadow-inner"
      />
    </div>
  );
}
