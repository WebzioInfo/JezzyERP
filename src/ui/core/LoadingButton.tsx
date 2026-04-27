"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function LoadingButton({
  children,
  isLoading,
  loadingText,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}: LoadingButtonProps) {
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20",
    secondary: "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/10",
    outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base",
    xl: "h-16 px-10 text-lg",
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group italic",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span className="relative z-10">{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
