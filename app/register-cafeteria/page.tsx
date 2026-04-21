"use client";

import { useActionState, useState } from "react";
import { registerCafeteria } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";
import PrivacyCheckbox from "@/app/components/PrivacyCheckbox";

export default function RegisterCafeteriaPage() {
  const [state, formAction, pending] = useActionState(registerCafeteria, null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-12">
      {/* Background */}
      <div className="absolute inset-0 -z-10 fixed">
        <Image
          src="/background.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-md"></div>
      </div>

      <div className="z-10 w-full max-w-md p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20 mx-4">

        <div className="flex justify-center mb-6">
          <Link href="/">
            <div className="relative w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Image
                src="/logo.webp"
                alt="Coffee Geeks Panamá Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Badge de tipo */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wide">
            ☕ Cuenta de Cafetería
          </span>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-wide">
          Registrar Cafetería
        </h1>
        <p className="text-center text-white/70 mb-6 text-sm">
          Crea tu perfil de negocio en Coffee Geeks Panamá
        </p>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <label className="text-white/90 text-sm font-medium pl-1" htmlFor="name">
              Nombre del Responsable
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="Juan Pérez"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/90 text-sm font-medium pl-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="cafeteria@correo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/90 text-sm font-medium pl-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <p className="text-xs text-white/40 text-center px-2">
            Podrás completar el perfil de tu cafetería (nombre oficial, barrio, baristas, etc.) desde tu panel de perfil.
          </p>

          {/* Checkbox de política de privacidad */}
          <div className="pt-1">
            <PrivacyCheckbox
              checked={privacyAccepted}
              onChange={setPrivacyAccepted}
              accentColor="amber"
            />
          </div>

          <button
            type="submit"
            disabled={pending || !privacyAccepted}
            className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold tracking-wide hover:from-amber-400 hover:to-orange-400 focus:ring-2 focus:ring-amber-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30"
          >
            {pending ? "Registrando..." : "Registrar Cafetería"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/70">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-white/50">
          ¿Eres usuario normal?{" "}
          <Link href="/register" className="text-white/80 font-semibold hover:underline">
            Crear cuenta aquí
          </Link>
        </div>
      </div>
    </main>
  );
}
