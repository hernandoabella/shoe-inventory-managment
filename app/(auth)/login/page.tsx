"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || "Error al iniciar sesión");
        setIsLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Error de conexión");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-neutral-50">
      {/* Panel visual izquierdo */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-neutral-950 text-white p-12">
        {/* Fondo decorativo */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-amber-200/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-lg shadow-amber-500/30">
            <Sparkles className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-amber-200/80">
              LUXURY STORE
            </p>
            <p className="text-xs text-neutral-400">Inventory Suite</p>
          </div>
        </div>

        {/* Mensaje central */}
        <div className="relative max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/5 px-3 py-1 text-xs font-medium text-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Sistema interno · v2.0
          </div>
          <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-tight">
            El inventario de tu boutique,
            <br />
            <span className="italic text-amber-300">bajo control.</span>
          </h1>
          <p className="text-base leading-relaxed text-neutral-400">
            Gestiona productos, variantes, stock y proveedores con una
            plataforma diseñada para casas de moda y calzado premium.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4">
            <div>
              <p className="font-serif text-3xl text-amber-200">12k+</p>
              <p className="text-xs text-neutral-500">SKUs gestionados</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-amber-200">99.9%</p>
              <p className="text-xs text-neutral-500">Uptime</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-amber-200">24/7</p>
              <p className="text-xs text-neutral-500">Soporte</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between text-xs text-neutral-500">
          <span>© 2026 Luxury Store</span>
          <span className="font-mono">v2.0.4</span>
        </div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Header móvil */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950">
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-amber-700">
                LUXURY STORE
              </p>
              <p className="text-xs text-neutral-500">Inventory Suite</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-light tracking-tight text-neutral-900">
              Bienvenido de vuelta
            </h2>
            <p className="text-sm text-neutral-500">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-neutral-600"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="tu@boutique.com"
                  autoComplete="email"
                  {...register("email")}
                  className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              {errors.email?.message && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-wider text-neutral-600"
                >
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-neutral-500 hover:text-amber-700 transition"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password?.message && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 font-medium tracking-wide transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando…
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50/50 p-3 text-center text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">Demo:</span>{" "}
            admin@shoe.com / admin123
          </div>

          <p className="text-center text-xs text-neutral-400">
            ¿Necesitas acceso?{" "}
            <a
              href="mailto:soporte@luxurystore.com"
              className="text-neutral-700 hover:text-amber-700 transition underline-offset-2 hover:underline"
            >
              Contacta al administrador
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
