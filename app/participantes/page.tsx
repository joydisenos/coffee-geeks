import { Suspense } from "react";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ParticipantesClient from "./ParticipantesClient";

export default async function ParticipantesPage() {
  await dbConnect();
  
  // Obtener todas las cafeterías activas de la base de datos
  const cafeterias = await User.find({ role: "cafeteria", isActive: true }).lean();
  
  const SHOPS = cafeterias.map((c: any) => ({
    id: c._id.toString(),
    type: c.businessType || "coffee",
    name: c.cafeteriaName || `${c.name} ${c.lastName}`.trim(),
    cat: c.competitionCategory || "Cafetería",
    loc: c.neighborhood || "Panamá",
    votes: 0, // En el futuro se puede conectar a los votos reales
    img: c.coverImage || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=75",
  }));

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ParticipantesClient initialShops={SHOPS} />
    </Suspense>
  );
}
