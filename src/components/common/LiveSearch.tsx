"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
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
      
      if (query !== (searchParams.toString() ? `?${searchParams.toString()}` : "")) {
        router.push(`${pathname}${query}`);
      }
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue, paramName, pathname, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsSearching(true);
  };

  const handleClear = () => {
    setInputValue("");
    setIsSearching(true);
  };

  return (
    <div className={`relative group w-full ${className}`}>
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        icon={isSearching ? <Loader2 className="w-4 h-4 text-slate-500 animate-spin" /> : <Search className="w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />}
        className="h-9 text-sm"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
