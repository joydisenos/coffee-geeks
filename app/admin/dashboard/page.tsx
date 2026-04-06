import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await dbConnect();
  const totalUsers = await User.countDocuments();
  const adminUsers = await User.countDocuments({ role: "admin" });
  const regularUsers = await User.countDocuments({ role: "user" });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-amber-50 drop-shadow-md">
        Dashboard General
      </h1>
      <p className="text-amber-100/60 text-lg">
        Resumen de la plataforma y métricas clave.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* Card Total Users */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#2a1f18] to-[#120d0a] border border-amber-900/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(217,119,6,0.15)] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold text-amber-500/80 uppercase tracking-[0.2em]">
              Total Usuarios
            </span>
          </div>
          <div className="text-6xl font-black text-amber-50 drop-shadow-lg">{totalUsers}</div>
        </div>

        {/* Card Admins */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-900/30 to-[#120d0a] border border-amber-700/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(217,119,6,0.15)] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">
              Administradores
            </span>
          </div>
          <div className="text-6xl font-black text-amber-200 drop-shadow-lg">{adminUsers}</div>
        </div>

        {/* Card Regulares */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-900/20 to-[#120d0a] border border-orange-800/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(217,119,6,0.15)] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
             <span className="text-xs font-bold text-orange-400 uppercase tracking-[0.2em]">
              Usuarios Normales
            </span>
          </div>
          <div className="text-6xl font-black text-orange-200 drop-shadow-lg">{regularUsers}</div>
        </div>
      </div>
    </div>
  );
}
