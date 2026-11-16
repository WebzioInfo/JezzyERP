"use client";

import { loginAction } from "@/features/auth/actions/auth";
import { Loader2, AlertCircle, Building2, Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-slate-200">
      <div className="w-full max-w-sm flex flex-col items-center animate-reveal">
        {/* Branding Area */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-3 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            JEZZY ERP
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Resource Planning Command Center
          </p>
        </div>

        {/* Minimal Login Card */}
        <div className="w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your credentials to access the workspace.</p>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5" role="alert">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                required
                className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="w-full h-10 pl-3 pr-10 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending}
              className="w-full h-10 rounded-lg bg-slate-900 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer shadow-xs"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need a company workspace?{" "}
              <Link href="/signup" className="font-semibold text-slate-900 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-slate-400 text-center">
          &copy; {new Date().getFullYear()} Jezzy Enterprises. Built with enterprise security.
        </p>
      </div>
    </div>
  );
}
