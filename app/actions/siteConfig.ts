"use server";

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";
import { revalidatePath } from "next/cache";

// ─── Leer configuración (sin verificar sesión, usable desde layout) ───────────
export async function getSiteConfig() {
  await dbConnect();
  const config = await SiteConfig.findOne({}).lean() as any;
  if (!config) {
    return {
      seoTitle: "Coffee Geeks Panamá",
      seoDescription: "",
      ogImage: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      privacyPolicy: "",
    };
  }
  return {
    seoTitle: config.seoTitle ?? "",
    seoDescription: config.seoDescription ?? "",
    ogImage: config.ogImage ?? "",
    contactEmail: config.contactEmail ?? "",
    contactPhone: config.contactPhone ?? "",
    address: config.address ?? "",
    privacyPolicy: config.privacyPolicy ?? "",
  };
}

// ─── Guardar configuración (solo admin) ───────────────────────────────────────
export async function updateSiteConfig(state: any, formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "No autorizado." };
    }

    await dbConnect();

    const seoTitle       = formData.get("seoTitle")?.toString().trim() ?? "";
    const seoDescription = formData.get("seoDescription")?.toString().trim() ?? "";
    const ogImage        = formData.get("ogImage")?.toString().trim() ?? "";
    const contactEmail   = formData.get("contactEmail")?.toString().trim() ?? "";
    const contactPhone   = formData.get("contactPhone")?.toString().trim() ?? "";
    const address        = formData.get("address")?.toString().trim() ?? "";
    // La política de privacidad NO se hace trim para preservar saltos de línea internos
    const privacyPolicy  = formData.get("privacyPolicy")?.toString() ?? "";

    await SiteConfig.findOneAndUpdate(
      {}, // filtro vacío → singleton
      { seoTitle, seoDescription, ogImage, contactEmail, contactPhone, address, privacyPolicy },
      { upsert: true, new: true }
    );

    revalidatePath("/admin/settings");
    revalidatePath("/");           // revalida metadata de la home
    revalidatePath("/privacidad"); // si existe la página pública

    return { success: "Configuración guardada correctamente." };
  } catch (err) {
    console.error(err);
    return { error: "Error al guardar la configuración." };
  }
}
