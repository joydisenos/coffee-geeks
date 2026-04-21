"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { updateProfile } from "@/app/actions/user";
import {
  updateCafeteriaProfile,
  addBarista,
  deleteBarista,
  setHighlightedBarista,
} from "@/app/actions/cafeteria";
import Image from "next/image";

// ─── Sub-componente: mensaje flash ────────────────────────────────────────────
function FlashMessage({ msg, type }: { msg: string; type: "success" | "error" }) {
  if (!msg) return null;
  const cls =
    type === "success"
      ? "bg-green-500/20 border-green-500/50 text-green-200"
      : "bg-red-500/20 border-red-500/50 text-red-200";
  return (
    <div className={`p-3 rounded border text-sm text-center ${cls}`}>{msg}</div>
  );
}

// ─── Input compartido ─────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all";
const labelCls = "text-white/90 text-sm font-medium pl-1";

// ─── Componente principal ──────────────────────────────────────────────────────
export default function ProfileForm({ user }: { user: any }) {
  // ── Perfil básico ──
  const [basicState, basicAction, basicPending] = useActionState(updateProfile, null);
  const [basicMsg, setBasicMsg] = useState("");
  const [basicErr, setBasicErr] = useState("");

  useEffect(() => {
    if (basicState?.success) { setBasicMsg(basicState.success); setTimeout(() => setBasicMsg(""), 3500); }
    if (basicState?.error) { setBasicErr(basicState.error); setTimeout(() => setBasicErr(""), 4000); }
  }, [basicState]);

  // ── Perfil cafetería ──
  const [cafState, cafAction, cafPending] = useActionState(updateCafeteriaProfile, null);
  const [cafMsg, setCafMsg] = useState("");
  const [cafErr, setCafErr] = useState("");
  const [coverPreview, setCoverPreview] = useState<string>(user.coverImage || "");
  // Estado controlado para que el select NO se limpie tras el submit
  const [category, setCategory] = useState<string>(user.competitionCategory || "");

  useEffect(() => {
    if (cafState?.success) {
      setCafMsg(cafState.success);
      setTimeout(() => setCafMsg(""), 3500);
      // Sincronizar categoría desde la respuesta si la hubiera (no necesario, ya está controlado)
    }
    if (cafState?.error) { setCafErr(cafState.error); setTimeout(() => setCafErr(""), 4000); }
  }, [cafState]);

  // ── Agregar barista ──
  const [baristaState, baristaAction, baristaPending] = useActionState(addBarista, null);
  const [baristaMsg, setBaristaMsg] = useState("");
  const [baristaErr, setBaristaErr] = useState("");
  const [baristaPhotoPreview, setBaristaPhotoPreview] = useState("");
  const baristaFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (baristaState?.success) {
      setBaristaMsg(baristaState.success);
      setBaristaPhotoPreview("");
      baristaFormRef.current?.reset();
      setTimeout(() => setBaristaMsg(""), 3500);
    }
    if (baristaState?.error) { setBaristaErr(baristaState.error); setTimeout(() => setBaristaErr(""), 4000); }
  }, [baristaState]);

  // ── Estado optimista de baristas ──
  const [baristas, setBaristas] = useState<any[]>(user.baristas || []);
  useEffect(() => { setBaristas(user.baristas || []); }, [user.baristas]);

  async function handleDelete(baristaId: string) {
    setBaristas((prev) => prev.filter((b) => b._id !== baristaId));
    await deleteBarista(baristaId);
  }

  async function handleHighlight(baristaId: string) {
    setBaristas((prev) =>
      prev.map((b) => ({ ...b, isHighlighted: b._id === baristaId }))
    );
    await setHighlightedBarista(baristaId);
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ─────────────────── SECCIÓN: Perfil Básico ─────────────────── */}
      <section>
        <h2 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4 pl-1">
          Información Personal
        </h2>
        <form action={basicAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FlashMessage msg={basicErr} type="error" />
            <FlashMessage msg={basicMsg} type="success" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelCls} htmlFor="name">Nombre</label>
              <input id="name" name="name" type="text" required defaultValue={user.name} className={inputCls} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelCls} htmlFor="lastName">Apellido</label>
              <input id="lastName" name="lastName" type="text" defaultValue={user.lastName} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="email">Correo Electrónico</label>
            <input id="email" name="email" type="email" required defaultValue={user.email} className={inputCls} />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="password">Nueva Contraseña (Opcional)</label>
            <input id="password" name="password" type="password" minLength={6}
              placeholder="Deja en blanco para no cambiarla" className={inputCls} />
          </div>

          <button type="submit" disabled={basicPending}
            className="mt-2 w-full py-3.5 rounded-xl bg-white text-black font-semibold tracking-wide hover:bg-neutral-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            {basicPending ? "Guardando..." : "Actualizar Información"}
          </button>
        </form>
      </section>

      {/* ─────────────────── SECCIÓN: Cafetería ─────────────────── */}
      {user.role === "cafeteria" && (
        <>
          <div className="border-t border-white/10" />

          {/* ── Datos del negocio ── */}
          <section>
            <h2 className="text-amber-400/90 text-xs font-semibold uppercase tracking-widest mb-4 pl-1">
              ☕ Datos de la Cafetería
            </h2>
            <form action={cafAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <FlashMessage msg={cafErr} type="error" />
                <FlashMessage msg={cafMsg} type="success" />
              </div>

              {/* Nombre oficial */}
              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="cafeteriaName">Nombre oficial de la cafetería</label>
                <input id="cafeteriaName" name="cafeteriaName" type="text"
                  defaultValue={user.cafeteriaName}
                  placeholder="Ej: The Brew Lab Panamá"
                  className={inputCls} />
              </div>

              {/* Barrio / ubicación */}
              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="neighborhood">Barrio o ubicación en Panamá</label>
                <input id="neighborhood" name="neighborhood" type="text"
                  defaultValue={user.neighborhood}
                  placeholder="Ej: Casco Viejo, San Francisco..."
                  className={inputCls} />
              </div>

              {/* Categoría de competencia */}
              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="competitionCategory">Categoría de competencia</label>
                <select id="competitionCategory" name="competitionCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`${inputCls} appearance-none cursor-pointer`}>
                  <option value="" className="bg-neutral-900">Selecciona una categoría</option>
                  <option value="Filtrado" className="bg-neutral-900">Filtrado</option>
                  <option value="Espresso" className="bg-neutral-900">Espresso</option>
                  <option value="Bebida de Autor" className="bg-neutral-900">Bebida de Autor</option>
                </select>
              </div>

              {/* Foto de portada */}
              <div className="flex flex-col gap-2">
                <label className={labelCls} htmlFor="coverImage">Foto de portada</label>
                {coverPreview && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 mb-1">
                    <Image src={coverPreview} alt="Portada" fill className="object-cover" />
                  </div>
                )}
                <input
                  id="coverImage" name="coverImage" type="file" accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCoverPreview(URL.createObjectURL(file));
                  }}
                  className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500/20 file:text-amber-300 file:font-medium file:cursor-pointer hover:file:bg-amber-500/30 transition-all cursor-pointer"
                />
              </div>

              <button type="submit" disabled={cafPending}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold tracking-wide hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20">
                {cafPending ? "Guardando..." : "Guardar Datos de Cafetería"}
              </button>
            </form>
          </section>

          <div className="border-t border-white/10" />

          {/* ── Módulo de Baristas ── */}
          <section>
            <h2 className="text-amber-400/90 text-xs font-semibold uppercase tracking-widest mb-4 pl-1">
              👤 Baristas
            </h2>

            {/* Lista de baristas */}
            {baristas.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-4">
                Aún no has agregado baristas.
              </p>
            ) : (
              <ul className="flex flex-col gap-3 mb-6">
                {baristas.map((b) => (
                  <li key={b._id}
                    className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${b.isHighlighted
                      ? "bg-amber-500/15 border-amber-500/50"
                      : "bg-black/20 border-white/10"
                      }`}>
                    {/* Foto */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                      {b.photo ? (
                        <Image src={b.photo} alt={b.fullName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/40 text-lg">
                          👤
                        </div>
                      )}
                    </div>

                    {/* Nombre + badge */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{b.fullName}</p>
                      {b.isHighlighted && (
                        <span className="text-xs text-amber-400 font-semibold">★ Destacado</span>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!b.isHighlighted && (
                        <button
                          type="button"
                          onClick={() => handleHighlight(b._id)}
                          title="Marcar como destacado"
                          className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-semibold transition-colors">
                          ★ Destacar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(b._id)}
                        title="Eliminar barista"
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold transition-colors">
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Formulario agregar barista */}
            <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
              <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
                Agregar Barista
              </h3>
              <form ref={baristaFormRef} action={baristaAction} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <FlashMessage msg={baristaErr} type="error" />
                  <FlashMessage msg={baristaMsg} type="success" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="fullName">Nombre completo</label>
                  <input id="fullName" name="fullName" type="text" required
                    placeholder="Ej: María González"
                    className={inputCls} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls} htmlFor="baristaPhoto">Foto del barista</label>
                  {baristaPhotoPreview && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border border-white/20">
                      <Image src={baristaPhotoPreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                  <input id="baristaPhoto" name="photo" type="file" accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setBaristaPhotoPreview(URL.createObjectURL(file));
                    }}
                    className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/70 file:font-medium file:cursor-pointer hover:file:bg-white/20 transition-all cursor-pointer"
                  />
                </div>

                <button type="submit" disabled={baristaPending}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/10">
                  {baristaPending ? "Agregando..." : "+ Agregar Barista"}
                </button>
              </form>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
