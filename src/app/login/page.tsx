"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import { loginAction } from "@/features/auth/actions/auth";
import { Loader2, Lock, Mail, Building2, AlertCircle, ShieldCheck, ChevronRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<any[]>([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    // Generate random particles only on the client
    const newParticles = [...Array(20)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random(),
      duration: `${10 + Math.random() * 20}s`,
      delay: `${-Math.random() * 20}s`,
    }));
    setParticles(newParticles);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await loginAction(formData);
      if (res && 'error' in res) return { error: res.error };
      if (res && 'success' in res) {
        window.location.href = "/dashboard";
        return { success: true };
      }
      return prevState;
    },
    null
  );

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Interactive Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.15), transparent 80%)`
        }}
      />

      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Subatomic particles */}
        {particles.map((p, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              top: p.top,
              left: p.left,
              opacity: p.opacity,
              animation: `float ${p.duration} linear infinite`,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 animate-reveal">
          <div className="inline-flex items-center justify-center gap-4 mb-4">
            <div className="relative group/logo">
              <div className="absolute inset-0 bg-accent-500/30 blur-2xl rounded-full scale-110 group-hover/logo:scale-150 transition-transform duration-700" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/logo:translate-x-[100%] transition-transform duration-1000" />
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black font-display text-white tracking-tighter sm:text-5xl">
              JEZZY <span className="text-accent-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">ERP</span>
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-slate-700" />
            <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-[10px]">
              Command Center V2.4
            </p>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-slate-700" />
          </div>
        </div>

        {/* Login Card */}
        <div className="glass clay-card p-8 sm:p-10 animate-reveal stagger-1 overflow-hidden relative group">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-400 to-transparent opacity-60" />
          
          <div className="mb-8 relative">
            <h2 className="text-2xl font-bold text-slate-800 font-display tracking-tight">System Login</h2>
            <div className="w-12 h-1 bg-primary-500 mt-2 rounded-full" />
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              Secure authentication gateway. Please enter your credentials below.
            </p>
          </div>

          {/* Error State */}
          {state?.error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800 tracking-tight">Access Denied</p>
                <p className="text-sm text-red-600 mt-0.5 font-medium leading-snug">{state.error}</p>
              </div>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            {/* Email Field */}
            <div className="animate-in stagger-2">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1" htmlFor="email">
                Identity / Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 transition-colors group-focus-within:text-primary-500">
                  <Mail strokeWidth={2.5} className="w-full h-full" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@jezzy.com"
                  required
                  autoComplete="email"
                  className="input-minimal w-full pl-12 h-14 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-in stagger-3">
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest" htmlFor="password">
                  Security Code
                </label>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider transition-colors"
                >
                  {showPassword ? "Hide" : "Show"} Key
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 transition-colors group-focus-within:text-primary-500">
                  {showPassword ? <Lock strokeWidth={2.5} className="w-full h-full" /> : <ShieldCheck strokeWidth={2.5} className="w-full h-full" />}
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="input-minimal w-full pl-12 pr-12 h-14 font-mono text-lg tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between px-1 animate-in stagger-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-5 h-5 bg-slate-100 border-2 border-slate-200 rounded-lg group-hover:border-primary-300 transition-all peer-checked:bg-primary-500 peer-checked:border-primary-500 shadow-sm" />
                  <svg className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Keep me signed in</span>
              </label>
              <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Emergency Reset</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending}
              className="clay-btn w-full h-15 text-white font-black text-lg flex items-center justify-center gap-3 group/btn relative overflow-hidden animate-in stagger-5 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] active:shadow-none"
              style={{ background: pending ? "#475569" : "linear-gradient(135deg, #4F46E5 0%, #312E81 100%)" }}
            >
              {pending ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="tracking-tight">Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="tracking-tight">INITIALIZE SESSION</span>
                  <div className="relative flex items-center transition-transform group-hover/btn:translate-x-1 duration-300">
                    <ChevronRight className="w-6 h-6" />
                    <ChevronRight className="w-6 h-6 absolute left-0 opacity-0 group-hover/btn:opacity-30 group-hover/btn:translate-x-3 duration-500" />
                  </div>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Secondary Links */}
        <div className="mt-10 text-center animate-reveal stagger-6">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6 text-[10px] text-slate-500 font-black uppercase tracking-[0.25em]">
               <span>Terms of Auth</span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
               <span>Privacy Shield</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">
                System Unit: JEZZY-CORE-01
              </p>
              <p className="text-[10px] text-slate-600 font-medium">
                © 2026 JEZZY Enterprises • Developed by <span className="text-slate-500 font-bold">Webzio Intl.</span>
              </p>
            </div>
            
            <div className="p-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Server Status: Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
