"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";
import { Mail, Lock, Loader } from "lucide-react";
import { Input } from "@/components/FormInputs";
import { Button } from "@/components/Button";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectedFrom = searchParams.get("redirectedFrom") ?? "/dashboard";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectedFrom || "/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-900/20 to-slate-950 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl opacity-0 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl opacity-0 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-up">
          <div className="mb-4">
            <Logo className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            CRM Suite
          </h1>
          <p className="text-slate-400 text-sm mt-2">Gestion professionnelle</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 backdrop-blur-sm p-8 shadow-2xl border border-slate-700/50 hover:border-sky-500/30 transition-colors animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-50">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Adresse Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              icon={Mail}
            />

            <Input
              label="Mot de passe"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
            />

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                </div>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              fullWidth
            >
              Se connecter
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Pas encore de compte ?{" "}
            <a
              href="/register"
              className="font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              Créer un compte
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          CRM Suite • Gestion professionnelle
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 text-slate-200">
      <div className="flex flex-col items-center gap-3">
        <Loader className="w-8 h-8 animate-spin text-sky-400" />
        <p>Chargement...</p>
      </div>
    </Suspense>}>
      <LoginFormInner />
    </Suspense>
  );
}
