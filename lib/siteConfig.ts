import dbConnect from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";

// ─── Leer configuración (sin verificar sesión, usable desde layout y páginas SSR) ───
export async function getSiteConfig() {
  await dbConnect();
  // Forzamos que no use caché de Mongoose si es posible
  const config = await SiteConfig.findOne({}).lean();
  
  if (!config) {
    return {
      seoTitle: "Coffee Geeks Panamá",
      seoDescription: "",
      ogImage: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      privacyPolicy: "",
      maxGalleryImages: 3,
      votingEndDate: "",
      currentVotingRound: 0,
    };
  }

  return {
    seoTitle: (config as any).seoTitle ?? "Coffee Geeks Panamá",
    seoDescription: (config as any).seoDescription ?? "",
    ogImage: (config as any).ogImage ?? "",
    contactEmail: (config as any).contactEmail ?? "",
    contactPhone: (config as any).contactPhone ?? "",
    address: (config as any).address ?? "",
    privacyPolicy: (config as any).privacyPolicy ?? "",
    maxGalleryImages: (config as any).maxGalleryImages ?? 3,
    votingEndDate: (config as any).votingEndDate ?? "",
    currentVotingRound: (config as any).currentVotingRound ?? 0,
  };
}
