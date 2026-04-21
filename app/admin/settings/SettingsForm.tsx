"use client";

import { useActionState, useEffect, useState } from "react";
import { updateSiteConfig } from "@/app/actions/siteConfig";

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-black/30 border border-amber-900/30 text-amber-50 placeholder-amber-100/20 focus:outline-none focus:ring-2 focus:ring-amber-600/60 transition-all text-sm";
const labelCls = "text-amber-200/80 text-xs font-semibold uppercase tracking-widest pl-1";
const sectionCls =
  "p-6 rounded-2xl bg-gradient-to-br from-[#2a1f18] to-[#120d0a] border border-amber-900/30 shadow-lg space-y-4";

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <h2 className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest mb-2">
      <span>{icon}</span> {label}
    </h2>
  );
}

export default function SettingsForm({ config }: { config: any }) {
  const [state, formAction, pending] = useActionState(updateSiteConfig, null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (state?.success) {
      setSuccessMsg(state.success);
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
    if (state?.error) {
      setErrorMsg(state.error);
      setSuccessMsg("");
      setTimeout(() => setErrorMsg(""), 5000);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Flash messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-green-900/30 border border-green-700/50 text-green-300 text-sm font-medium text-center">
          ✓ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm font-medium text-center">
          ✗ {errorMsg}
        </div>
      )}

      {/* ── SEO ── */}
      <div className={sectionCls}>
        <SectionTitle icon="🔍" label="SEO & Open Graph" />

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="seoTitle">Título del sitio</label>
          <input
            id="seoTitle"
            name="seoTitle"
            type="text"
            defaultValue={config.seoTitle}
            placeholder="Coffee Geeks Panamá | ..."
            className={inputCls}
          />
          <p className="text-amber-100/30 text-xs pl-1">Aparece en la pestaña del navegador y resultados de búsqueda.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="seoDescription">Descripción SEO</label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            rows={3}
            defaultValue={config.seoDescription}
            placeholder="Descripción corta del sitio para buscadores y redes sociales..."
            className={`${inputCls} resize-y`}
          />
          <p className="text-amber-100/30 text-xs pl-1">
            Se usa en <code className="text-amber-400/60">&lt;meta name="description"&gt;</code> y en la etiqueta OG de descripción.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="ogImage">URL de imagen Open Graph</label>
          <input
            id="ogImage"
            name="ogImage"
            type="text"
            defaultValue={config.ogImage}
            placeholder="https://tusitio.com/og-image.jpg  (o ruta relativa /og.jpg)"
            className={inputCls}
          />
          <p className="text-amber-100/30 text-xs pl-1">
            Imagen que aparece cuando se comparte el sitio en redes sociales. Recomendado: 1200×630 px.
          </p>
        </div>
      </div>

      {/* ── Contacto ── */}
      <div className={sectionCls}>
        <SectionTitle icon="📬" label="Datos de Contacto" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="contactEmail">Email de contacto</label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={config.contactEmail}
              placeholder="contacto@coffeegeeks.pa"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelCls} htmlFor="contactPhone">Teléfono de contacto</label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="text"
              defaultValue={config.contactPhone}
              placeholder="+507 6000-0000"
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="address">Dirección</label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={config.address}
            placeholder="Ciudad de Panamá, República de Panamá"
            className={inputCls}
          />
        </div>
      </div>

      {/* ── Política de Privacidad ── */}
      <div className={sectionCls}>
        <SectionTitle icon="🔒" label="Política de Privacidad" />
        <p className="text-amber-100/40 text-xs -mt-2">
          El texto se mostrará tal cual en la página pública <code className="text-amber-400/60">/privacidad</code>.
          Respeta los saltos de línea y caracteres especiales.
        </p>
        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="privacyPolicy">Contenido</label>
          <textarea
            id="privacyPolicy"
            name="privacyPolicy"
            rows={16}
            defaultValue={config.privacyPolicy}
            placeholder={"1. Introducción\n\nEn Coffee Geeks Panamá..."}
            className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-base tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30 hover:shadow-amber-700/30 hover:-translate-y-0.5"
      >
        {pending ? "Guardando..." : "Guardar Configuración"}
      </button>
    </form>
  );
}
