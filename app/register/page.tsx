"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, null);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-12">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 fixed">
        <Image
          src="/background.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
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

        <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-wide">
          Crear Cuenta
        </h1>
        <p className="text-center text-white/70 mb-6 text-sm">
          Únete a la comunidad de Coffee Geeks
        </p>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white/90 text-sm font-medium pl-1" htmlFor="name">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                placeholder="Juan"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white/90 text-sm font-medium pl-1" htmlFor="lastName">
                Apellido (Op)
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                placeholder="Pérez"
              />
            </div>
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
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              placeholder="tu@correo.com"
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
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full py-3.5 rounded-xl bg-white text-black font-semibold tracking-wide hover:bg-neutral-200 focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {pending ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/70">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </main>
  );
}
