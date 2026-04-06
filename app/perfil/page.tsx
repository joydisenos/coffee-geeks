import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ProfileForm from "./ProfileForm";
import Link from "next/link";
import Image from "next/image";

export default async function PerfilPage() {
  const session = await getSession();
  if (!session) return null;

  await dbConnect();
  const userData = await User.findById(session.userId).lean();
  
  if (!userData) return null;

  const user = {
    name: userData.name,
    lastName: userData.lastName,
    email: userData.email,
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 fixed">
        <Image
          src="/background.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="z-10 w-full max-w-lg p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-wide">Mi Perfil</h1>
          <form action="/actions/logout" method="post" className="inline">
            <button formAction={async () => {
              "use server"
              const { logout } = await import("@/app/actions/auth");
              await logout();
            }} className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
              Cerrar Sesión
            </button>
          </form>
        </div>

        {session.role === "admin" && (
           <div className="mb-6 p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/50 flex justify-between items-center">
             <span className="text-indigo-200 text-sm font-medium">Eres Administrador</span>
             <Link href="/admin/dashboard" className="text-white text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors font-semibold">
               Ir al Dashboard
             </Link>
           </div>
        )}

        <ProfileForm user={user} />
      </div>
    </main>
  );
}
