"use client";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions/auth";
import { Loader2, Lock, Mail, Building2, AlertCircle } from "lucide-react";

export default function LoginPage() {
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
    <div className="min-h-screen flex">
      {/* Left Panel — Brand */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0F2240 0%, #1B3A6B 50%, #152E55 100%)" }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #C8991A 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #C8991A 0%, transparent 50%)`
          }}
        />

        {/* Company Identity */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #C8991A, #B7860F)" }}
            >
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl tracking-tight leading-none">JEZZY</div>
              <div className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: "#C8991A" }}>ENTERPRISES</div>
            </div>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Business Management<br />
            <span style={{ color: "#C8991A" }}>Made Simple.</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed max-w-sm">
            Your complete ERP system for invoicing, client management, payments, and GST compliance — all in one place.
          </p>
        </div>

        {/* Company Details Card */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#C8991A" }}>Company Info</p>
            <div className="space-y-2 text-sm text-slate-200">
              <p className="font-semibold text-white">JEZZY ENTERPRISES</p>
              <p>MP 4/3 IIA, MOONIYUR</p>
              <p>VELIMUKKU PO, MALAPPURAM DIST — 676317</p>
              <p className="pt-1 font-mono text-xs text-slate-300">GSTIN: 32BMAPJ5504M1Z9</p>
              <p className="font-mono text-xs text-slate-300">+91 85531 85300</p>
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-500 text-center">
            © 2026 JEZZY Enterprises. Powered by <span className="text-slate-400 font-medium">Webzio International</span>
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-slate-50">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C8991A, #B7860F)" }}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg leading-none">JEZZY</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ENTERPRISES</div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 font-display">Welcome Back</h2>
            <p className="text-slate-500 mt-2 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Error State */}
          {state?.error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-3 animate-fade-up">
              <AlertCircle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-danger-800">Login Failed</p>
                <p className="text-sm text-danger-700 mt-0.5">{state.error}</p>
              </div>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="label" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@jezzy.com"
                  required
                  autoComplete="email"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full h-12 text-base mt-2 gap-2"
              style={{ background: pending ? undefined : "linear-gradient(135deg, #1B3A6B, #152E55)" }}
            >
              {pending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-800 font-medium text-center">
              🔒 This is a private internal system for JEZZY Enterprises staff only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
