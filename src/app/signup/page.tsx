"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/features/auth/actions/auth";
import { Input } from "@/ui/core/Input";
import { Button } from "@/ui/core/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/Card";
import { FileText, Loader2, UserPlus, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="p-2 bg-primary-600 rounded-lg group-hover:scale-110 transition-transform">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
          JEZZY<span className="text-primary-600">INVOICE</span>
        </span>
      </Link>

      <Card className="w-full max-w-lg shadow-2xl shadow-slate-200/50 border-slate-200/60 overflow-hidden">
        <CardHeader className="bg-primary-600 text-white p-8">
          <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
          <CardDescription className="text-primary-100">
            Create your company account and start professional billing in minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {state?.error && (
            <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 font-medium animate-in fade-in slide-in-from-top-1">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
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

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              By signing up, you agree to our <Link href="#" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary-600 hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary-500/20" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <UserPlus className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                Sign in instead
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-6">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
          ))}
        </div>
        <p className="text-sm font-medium text-slate-500">
          Join <span className="text-slate-900 font-bold">500+ businesses</span> already billing with Jezzy.
        </p>
      </div>
    </div>
  );
}
