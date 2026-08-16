"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-neutral-950 text-white">
      {/* Panel visual izquierdo */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-neutral-950 text-white p-12">
        {/* Fondo decorativo dorado */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-amber-400/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #fbbf24 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Línea dorada decorativa */}
          <div className="absolute left-12 right-12 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        {/* Logo */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/luxury-premium-store.png"
            alt="Luxury Premium Store"
            className="h-48 w-auto object-contain mix-blend-screen"
          />
        </div>

        {/* Mensaje central */}
        <div className="relative max-w-md space-y-6">
          <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-tight">
            El inventario de tu boutique,
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text italic text-transparent">
              bajo control.
            </span>
          </h1>
          <p className="text-base leading-relaxed text-neutral-400">
            Gestiona productos, variantes, stock y proveedores con una
            plataforma diseñada para casas de moda y calzado premium.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4">
            <div>
              <p className="font-serif text-3xl bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
                12k+
              </p>
              <p className="text-xs text-neutral-500">SKUs gestionados</p>
            </div>
            <div>
              <p className="font-serif text-3xl bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
                99.9%
              </p>
              <p className="text-xs text-neutral-500">Uptime</p>
            </div>
            <div>
              <p className="font-serif text-3xl bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
                24/7
              </p>
              <p className="text-xs text-neutral-500">Soporte</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between text-xs text-neutral-500">
          <span>© 2026 Luxury Premium Store</span>
          <span className="font-mono">v2.0.4</span>
        </div>
      </aside>

      {/* Form */}
      <main className="relative flex items-center justify-center overflow-hidden p-6 sm:p-12">
        {/* Fondo decorativo del lado del formulario */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-40 -right-40 h-[26rem] w-[26rem] rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-amber-300/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm space-y-8">
          {/* Header móvil */}
          <div className="lg:hidden flex flex-col items-center gap-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/luxury-premium-store.png"
              alt="Luxury Premium Store"
              className="h-28 w-auto object-contain mix-blend-screen"
            />
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="font-serif text-3xl font-light tracking-tight">
              Bienvenido de vuelta
            </h2>
            <p className="text-sm text-neutral-400">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          {serverError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-amber-200/70"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="tu@boutique.com"
                  autoComplete="email"
                  {...register("email")}
                  className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-neutral-500 transition focus:border-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              </div>
              {errors.email?.message && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-wider text-amber-200/70"
                >
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-neutral-400 hover:text-amber-300 transition"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full rounded-lg border border-neutral-700/80 bg-neutral-900/60 pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-neutral-500 transition focus:border-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 select-none touch-manipulation items-center justify-center rounded text-neutral-500 transition hover:bg-white/10 hover:text-amber-200"
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
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 hover:from-amber-300 hover:to-amber-500 font-semibold tracking-wide shadow-lg shadow-amber-500/20 transition-all disabled:opacity-60"
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

          <div className="rounded-lg border border-dashed border-amber-400/20 bg-amber-400/5 p-3 text-center text-xs text-neutral-400">
            <span className="font-medium text-amber-200">Demo:</span>{" "}
            admin@shoe.com / admin123
          </div>

          <p className="text-center text-xs text-neutral-500">
            ¿Necesitas acceso?{" "}
            <a
              href="mailto:soporte@luxurystore.com"
              className="text-neutral-300 hover:text-amber-300 transition underline-offset-2 hover:underline"
            >
              Contacta al administrador
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
