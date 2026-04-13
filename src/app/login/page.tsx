"use client";
import { loginAction } from "@/features/auth/actions/auth";
import { Loader2, AlertCircle } from "lucide-react";
import { useActionState, useCallback, useEffect, useState } from "react";

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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary-100">

      {/* ── Subtle Background Watermark Layer ── */}
      <div className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none select-none overflow-hidden flex flex-wrap gap-16 p-10 rotate-[-12deg] scale-110">
        {[...Array(60)].map((_, i) => (
          <div key={i} className="text-3xl font-bold font-display tracking-tight uppercase whitespace-nowrap text-slate-900">
            Webzio
          </div>
        ))}
      </div>

      {/* ── Main Login Container ── */}
      <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center animate-reveal">

        {/* Branding Area */}
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Jezzy Enterprises
          </h1>
          <div className="h-0.5 w-8 bg-slate-200 mt-2 rounded-full" />
        </div>

        {/* Minimal Login Card */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-1 text-sm">Access the management system.</p>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-red-100 flex items-center gap-3 animate-in">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-xs text-red-700 font-bold">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-0.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 transition-all outline-none text-sm text-slate-700 placeholder:text-slate-300"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-0.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 transition-all outline-none text-sm text-slate-700 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between px-0.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-transparent transition-all cursor-pointer" />
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-xs font-bold text-slate-400 hover:underline">Forgot?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending}
              className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>

        {/* ── Footer Credits ── */}
        <div className="mt-12 text-center flex flex-col gap-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Powered by Webzio Technology
          </p>
          <p className="text-[10px] font-medium text-slate-300 uppercase tracking-[0.05em]">
            A product of Webzio International
          </p>
        </div>

      </div>
    </div>
  );
}