import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import PerfilDetailClient from "./PerfilDetailClient";

export const dynamic = 'force-dynamic';

export default async function PerfilPage({ params }: { params: { id: string } }) {
  await dbConnect();

  // En Next.js 15+, params es una promesa.
  const { id } = await params;

  // El id en la URL viene como slug-id (ej. mi-cafeteria-60d5ec...)
  // Extraemos la última parte que corresponde al ObjectId de MongoDB
  const parts = id.split('-');
  const objectId = parts[parts.length - 1];

  try {
    const shop = await User.findById(objectId).lean();
    
    if (!shop || shop.role !== "cafeteria") {
      return notFound();
    }

    // Convertir _id a string
    const shopData = {
      ...shop,
      _id: shop._id.toString(),
      id: shop._id.toString(),
    };

    return <PerfilDetailClient shop={shopData} />;
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return notFound();
  }
}
