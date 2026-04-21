import mongoose, { Schema, model, models } from "mongoose";

// Documento singleton — siempre habrá solo uno (se usa findOneAndUpdate con upsert)
const SiteConfigSchema = new Schema(
  {
    // SEO
    seoTitle: { type: String, default: "Coffee Geeks Panamá" },
    seoDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" }, // URL pública de la imagen OG

    // Contacto
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "" },

    // Legal
    privacyPolicy: { type: String, default: "" }, // texto plano con saltos de línea
  },
  { timestamps: true }
);

const SiteConfig = models.SiteConfig || model("SiteConfig", SiteConfigSchema);
export default SiteConfig;
