import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import UserTableManager from "./UserTableManager";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await dbConnect();
  // Lean for plain objects
  const rawUsers = await User.find().sort({ createdAt: -1 }).lean();
  
  const users = rawUsers.map((u: any) => ({
    id: u._id.toString(),
    name: u.name,
    lastName: u.lastName || "",
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-amber-50 drop-shadow-md">Gestión de Usuarios</h1>
        <p className="text-amber-100/60 mt-2 text-lg">Ver, Crear, Editar y Borrar usuarios del sistema.</p>
      </div>

      <UserTableManager initialUsers={users} />
    </div>
  );
}
