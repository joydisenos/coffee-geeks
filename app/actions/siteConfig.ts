"use server";

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";
import { revalidatePath } from "next/cache";

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
    const privacyPolicy  = formData.get("privacyPolicy")?.toString() ?? "";
    
    const maxGalleryImagesStr = formData.get("maxGalleryImages")?.toString().trim();
    const maxGalleryImages = maxGalleryImagesStr ? parseInt(maxGalleryImagesStr, 10) : 3;
    
    const votingEndDate = formData.get("votingEndDate")?.toString().trim() ?? "";

    // Usamos updateOne con upsert para asegurar que el registro único se cree o actualice
    await SiteConfig.updateOne(
      {}, // filtro vacío para el singleton
      { 
        $set: {
          seoTitle, 
          seoDescription, 
          ogImage, 
          contactEmail, 
          contactPhone, 
          address, 
          privacyPolicy, 
          maxGalleryImages, 
          votingEndDate 
        } 
      },
      { upsert: true }
    );

    // Forzamos revalidación de todas las rutas posibles que usen este dato
    revalidatePath("/admin/settings", "page");
    revalidatePath("/admin/settings", "layout");
    revalidatePath("/", "page");
    revalidatePath("/home", "page");
    revalidatePath("/privacidad", "page");

    return { success: "Configuración guardada correctamente." };
  } catch (err) {
    console.error("Error in updateSiteConfig:", err);
    return { error: "Error al guardar la configuración." };
  }
}
