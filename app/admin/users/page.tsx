import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import UserTableManager from "./UserTableManager";
import { getSiteConfig } from "@/lib/siteConfig";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await dbConnect();
  // Lean for plain objects
  const rawUsers = await User.find().sort({ createdAt: -1 }).lean();
  
  const config = await getSiteConfig();
  
  const users = rawUsers.map((u: any) => ({
    id: u._id.toString(),
    _id: u._id.toString(),
    name: u.name,
    lastName: u.lastName || "",
    email: u.email,
    role: u.role,
    createdAt: new Date(u.createdAt).toLocaleDateString("es-PA"),
    isActive: !!u.isActive,
    businessType: u.businessType || "coffee",
    cafeteriaName: u.cafeteriaName ?? "",
    neighborhood: u.neighborhood ?? "",
    description: u.description ?? "",
    hours: u.hours ?? "",
    phone: u.phone ?? "",
    web: u.web ?? "",
    coverImage: u.coverImage ?? "",
    gallery: u.gallery ?? [],
    locationLat: u.locationLat ?? null,
    locationLng: u.locationLng ?? null,
    competitionCategory: u.competitionCategory ?? "",
    baristas: (u.baristas ?? []).map((b: any) => ({
      _id: b._id.toString(),
      fullName: b.fullName,
      photo: b.photo ?? "",
      isHighlighted: b.isHighlighted ?? false,
    })),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#bedcf8] drop-shadow-md">Gestión de Usuarios</h1>
        <p className="text-[#bedcf8]/60 mt-2 text-lg">Ver, Crear, Editar y Borrar usuarios del sistema.</p>
      </div>

      <UserTableManager initialUsers={users} maxGalleryImages={config.maxGalleryImages} />
    </div>
  );
}
