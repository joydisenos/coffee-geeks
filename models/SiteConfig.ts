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

    // Cafeterías
    maxGalleryImages: { type: Number, default: 3 },
    
    // Votaciones
    currentVotingRound: { type: Number, default: 0 }, // 0: Cerrado, 1: Ronda 1, 2: Ronda 2
    votingEndDate: { type: String, default: "" },
  },
  { timestamps: true, strict: false } // Usamos strict: false para permitir campos nuevos si el modelo ya estaba cacheado
);

// En desarrollo, Next.js puede cachear el modelo con el esquema antiguo.
// Si el modelo ya existe, intentamos asegurarnos de que reconozca los nuevos campos.
const SiteConfig = models.SiteConfig || model("SiteConfig", SiteConfigSchema);

export default SiteConfig;
