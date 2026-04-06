"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProfile } from "@/app/actions/user";

export default function ProfileForm({ user }: { user: any }) {
  const [state, formAction, pending] = useActionState(updateProfile, null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (state?.success) {
      setSuccessMsg(state.success);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <div className="p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
          {state.error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 rounded bg-green-500/20 border border-green-500/50 text-green-200 text-sm text-center">
          {successMsg}
        </div>
      )}

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
            defaultValue={user.name}
            className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium pl-1" htmlFor="lastName">
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={user.lastName}
            className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
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
          defaultValue={user.email}
          className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white/90 text-sm font-medium pl-1" htmlFor="password">
          Nueva Contraseña (Opcional)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={6}
          placeholder="Deja en blanco para no cambiarla"
          className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full py-3.5 rounded-xl bg-white text-black font-semibold tracking-wide hover:bg-neutral-200 focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {pending ? "Guardando..." : "Actualizar Información"}
      </button>
    </form>
  );
}
