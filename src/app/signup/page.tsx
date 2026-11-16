"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/features/auth/actions/auth";
import { Input } from "@/ui/core/Input";
import { Button } from "@/ui/core/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/Card";
import { Building2, Loader2, UserPlus, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await signupAction(formData);
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-slate-200">
      <div className="w-full max-w-md flex flex-col items-center animate-reveal">
        {/* Branding */}
        <Link href="/" className="flex flex-col items-center mb-8 text-center group">
          <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-3 shadow-sm group-hover:bg-slate-800 transition-colors">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
            JEZZY ERP
          </span>
          <span className="text-xs text-slate-500 mt-0.5">Enterprise Operations & Billing</span>
        </Link>

        <Card className="w-full shadow-xs border border-slate-200 overflow-hidden">
          <CardHeader className="p-6 sm:p-8 pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Create workspace</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Set up your company profile and administrative access.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-0">
            {state?.error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 font-medium" role="alert">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <Input
                name="companyName"
                label="Company Name"
                placeholder="e.g. Acme Industries Ltd."
                required
                autoComplete="organization"
              />

              <Input
                name="email"
                type="email"
                label="Admin Email Address"
                placeholder="admin@company.com"
                required
                autoComplete="email"
              />

              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="Choose a strong password"
                required
                autoComplete="new-password"
              />

              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                By creating an account, you agree to your organization&apos;s standard terms of service and data policy.
              </p>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full mt-2" 
                disabled={pending}
                loading={pending}
              >
                {pending ? (
                  <>Creating workspace...</>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Workspace
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-slate-900 hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-xs text-slate-400 text-center">
          &copy; {new Date().getFullYear()} Jezzy Enterprises. Built with enterprise security.
        </p>
      </div>
    </div>
  );
}
