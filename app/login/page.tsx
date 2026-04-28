"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fondo.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      <div className="z-10 w-full max-w-md p-8 md:p-12 rounded-3xl bg-[#4c000a] backdrop-blur-lg shadow-2xl border border-[#bedcf8]/20 mx-4">

        <div className="flex justify-center mb-0">
          <Link href="/">
            <div className="relative w-50 h-50 drop-shadow-[0_0_15px_rgba(190,220,248,0.3)]">
              <Image
                src="/logo-cel.webp"
                alt="Coffee Geeks Panamá Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center text-[#bedcf8] mb-2 tracking-wide">
          Iniciar Sesión
        </h1>
        <p className="text-center text-[#bedcf8]/70 mb-8 text-sm">
          Ingresa a tu cuenta para continuar
        </p>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[#bedcf8] text-sm font-medium pl-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#bedcf8] border border-[#bedcf8]/10 text-[#4c000a] placeholder-[#4c000a]/50 focus:outline-none focus:ring-2 focus:ring-[#bedcf8]/50 focus:border-transparent transition-all"
              placeholder="tu@correo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#bedcf8] text-sm font-medium pl-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#bedcf8] border border-[#bedcf8]/10 text-[#4c000a] placeholder-[#4c000a]/50 focus:outline-none focus:ring-2 focus:ring-[#bedcf8]/50 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full py-3.5 rounded-xl bg-[#bedcf8] text-[#4c000a] font-semibold tracking-wide hover:bg-[#bedcf8]/90 focus:ring-2 focus:ring-[#bedcf8]/50 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {pending ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#bedcf8]/70 flex flex-col gap-3">
          <p>
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-[#bedcf8] font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
