"use client";

import { useState, useTransition } from "react";
import { deleteUser, updateUserAdmin } from "@/app/actions/user";
import { toggleCafeteriaStatus } from "@/app/actions/cafeteria";
import { register } from "@/app/actions/auth";
import AdminMenuModal from "./AdminMenuModal";
import ProfileForm from "@/app/perfil/ProfileForm";
import { useRouter } from "next/navigation";

export default function UserTableManager({ initialUsers, maxGalleryImages }: { initialUsers: any[], maxGalleryImages?: number }) {
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<any>(null);
  const [managingMenu, setManagingMenu] = useState<any>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  async function handleDelete(id: string) {
    if (!confirm("¿Está seguro de que desea eliminar este usuario?")) return;
    setLoading(true);
    await deleteUser(id);
    setLoading(false);
  }

  async function handleToggleStatus(id: string) {
    setLoading(true);
    const res = await toggleCafeteriaStatus(id);
    if (res?.error) {
      alert("Error: " + res.error);
      setLoading(false);
    } else {
      // Usamos startTransition para que React procese la actualización de Next.js correctamente
      startTransition(() => {
        router.refresh();
        setLoading(false);
      });
    }
  }

  const filteredUsers = initialUsers.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (u.role === "cafeteria" && statusFilter !== "all") {
       if (statusFilter === "active" && !u.isActive) return false;
       if (statusFilter === "inactive" && u.isActive) return false;
    }
    return true;
  });

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#2a1f18]/80 border border-amber-900/50 text-amber-50 px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            <option value="all">Todos los Roles</option>
            <option value="user">Usuarios</option>
            <option value="cafeteria">Cafeterías</option>
            <option value="admin">Administradores</option>
          </select>
          
          {(roleFilter === "all" || roleFilter === "cafeteria") && (
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#2a1f18]/80 border border-amber-900/50 text-amber-50 px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="all">Todos los Estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          )}
        </div>

        <button
          onClick={() => setCreating(true)}
          className="bg-amber-700 hover:bg-amber-600 border border-amber-500/50 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_4px_20px_rgba(217,119,6,0.2)] hover:shadow-[0_4px_25px_rgba(217,119,6,0.4)] transition-all duration-300 hover:-translate-y-0.5 tracking-wide whitespace-nowrap"
        >
          + Agregar Usuario
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-amber-900/30 bg-[#2a1f18]/80 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left text-sm text-amber-100/80">
          <thead className="bg-[#1c140f] text-xs uppercase text-amber-500/80 font-bold tracking-wider border-b border-amber-900/30">
            <tr>
              <th className="px-6 py-5">Nombre / Apellido</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Rol</th>
              <th className="px-6 py-5 text-center">Estado</th>
              <th className="px-6 py-5">Fecha Reg.</th>
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-amber-900/20 hover:bg-amber-900/20 transition-colors duration-200">
                <td className="px-6 py-5 font-semibold text-amber-50">
                  {u.name} {u.lastName}
                </td>
                <td className="px-6 py-5 font-medium">{u.email}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-inner ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : u.role === 'cafeteria' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-[#1c140f] text-amber-200/60 border border-amber-900/50'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  {u.role === 'cafeteria' ? (
                    <button 
                      onClick={() => handleToggleStatus(u.id)}
                      disabled={loading || isPending}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md border ${u.isActive ? 'bg-green-500/10 text-green-400 border-green-500/50 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'} ${(loading || isPending) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}`}
                    >
                      {u.isActive ? '✅ Activa' : '❌ Inactiva'}
                    </button>
                  ) : (
                    <span className="text-neutral-500">-</span>
                  )}
                </td>
                <td className="px-6 py-5 text-amber-200/50 font-medium">{u.createdAt}</td>
                <td className="px-6 py-5 text-right font-bold tracking-wide relative">
                   <button 
                      onClick={() => setOpenDropdown(openDropdown === u.id ? null : u.id)} 
                      className="text-amber-200/70 hover:text-amber-50 px-3 py-1.5 bg-amber-900/20 rounded-xl border border-amber-700/30 transition-colors"
                   >
                      Opciones ▾
                   </button>
                   
                   {openDropdown === u.id && (
                      <div className="absolute right-6 top-14 z-50 bg-[#1c140f] border border-amber-600/30 rounded-xl shadow-2xl py-2 w-40 flex flex-col text-left animate-fade-in-up">
                         {u.role === "cafeteria" && (
                           <button onClick={() => { setManagingMenu(u); setOpenDropdown(null); }} className="px-4 py-2.5 text-green-400 hover:bg-white/5 text-left text-sm transition-colors border-b border-white/5" disabled={loading}>
                             ☕ Ver Menú
                           </button>
                         )}
                         <button onClick={() => { setEditingUser(u); setOpenDropdown(null); }} className="px-4 py-2.5 text-orange-400 hover:bg-white/5 text-left text-sm transition-colors border-b border-white/5" disabled={loading}>
                           ✏️ Editar Perfil
                         </button>
                         <button onClick={() => { handleDelete(u.id); setOpenDropdown(null); }} className="px-4 py-2.5 text-red-400 hover:bg-red-500/10 text-left text-sm transition-colors" disabled={loading}>
                           🗑️ Borrar
                         </button>
                      </div>
                   )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                 <td colSpan={6} className="text-center py-10 text-amber-700 font-medium tracking-wide">No se encontraron usuarios con esos filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR */}
      {creating && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#1c140f] border border-amber-900/40 rounded-3xl p-8 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-fade-in-up duration-300">
              <h2 className="text-2xl font-black mb-6 text-amber-50 tracking-wide border-b border-amber-900/30 pb-4">Nuevo Usuario</h2>
              <form action={async (fd) => {
                 setLoading(true);
                 await register((state: any) => state, fd);
                 setCreating(false);
                 setLoading(false);
                 window.location.reload(); 
              }} className="space-y-5">
                 <div>
                   <label className="text-sm font-bold text-amber-200/80 uppercase tracking-widest">Nombre</label>
                   <input required name="name" className="w-full mt-2 px-4 py-3 rounded-xl bg-black/50 border border-amber-900/50 text-amber-50 focus:ring-2 focus:ring-amber-600 focus:outline-none transition-shadow" />
                 </div>
                 <div>
                   <label className="text-sm font-bold text-amber-200/80 uppercase tracking-widest">Email</label>
                   <input required type="email" name="email" className="w-full mt-2 px-4 py-3 rounded-xl bg-black/50 border border-amber-900/50 text-amber-50 focus:ring-2 focus:ring-amber-600 focus:outline-none transition-shadow" />
                 </div>
                 <div>
                   <label className="text-sm font-bold text-amber-200/80 uppercase tracking-widest">Contraseña</label>
                   <input required type="password" name="password" minLength={6} className="w-full mt-2 px-4 py-3 rounded-xl bg-black/50 border border-amber-900/50 text-amber-50 focus:ring-2 focus:ring-amber-600 focus:outline-none transition-shadow" />
                 </div>
                 <div>
                   <label className="text-sm font-bold text-amber-200/80 uppercase tracking-widest">Rol</label>
                   <select name="role" defaultValue="user" className="w-full mt-2 px-4 py-3 rounded-xl bg-black/50 border border-amber-900/50 text-amber-50 focus:ring-2 focus:ring-amber-600 focus:outline-none transition-shadow">
                      <option value="user">Usuario</option>
                      <option value="cafeteria">Cafetería</option>
                      <option value="admin">Administrador</option>
                   </select>
                 </div>
                 <div className="flex justify-end gap-4 mt-8">
                   <button type="button" onClick={() => setCreating(false)} className="px-5 py-2.5 rounded-xl bg-[#2a1f18] hover:bg-[#382b22] border border-amber-900/50 text-amber-100 font-bold transition-colors">Cancelar</button>
                   <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold shadow-lg transition-colors">Guardar Usuario</button>
                 </div>
              </form>
           </div>
         </div>
      )}

      {/* MODAL EDITAR */}
      {editingUser && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#1c140f] border border-amber-900/40 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-fade-in-up duration-300">
              <div className="flex justify-between items-center mb-6 border-b border-amber-900/30 pb-4">
                <h2 className="text-2xl font-black text-amber-50 tracking-wide">Editar Usuario</h2>
                <button onClick={() => setEditingUser(null)} className="text-amber-500 hover:text-amber-300 font-bold text-xl px-2">✕</button>
              </div>
              
              {editingUser.role === 'cafeteria' ? (
                 <div className="pr-2">
                    <ProfileForm user={editingUser} maxGalleryImages={maxGalleryImages} />
                 </div>
              ) : (
                <form action={async (fd) => {
                   setLoading(true);
                   await updateUserAdmin(editingUser.id, fd);
                   setEditingUser(null);
                   setLoading(false);
                }} className="space-y-5">
                   <div>
                     <label className="text-sm font-bold text-amber-200/80 uppercase tracking-widest">Nombre</label>
                     <input required name="name" defaultValue={editingUser.name} className="w-full mt-2 px-4 py-3 rounded-xl bg-black/50 border border-amber-900/50 text-amber-50 focus:ring-2 focus:ring-amber-600 focus:outline-none transition-shadow" />
                   </div>
                   <div>
                     <label className="text-sm font-bold text-amber-200/80 uppercase tracking-widest">Email</label>
                     <input required type="email" name="email" defaultValue={editingUser.email} className="w-full mt-2 px-4 py-3 rounded-xl bg-black/50 border border-amber-900/50 text-amber-50 focus:ring-2 focus:ring-amber-600 focus:outline-none transition-shadow" />
                   </div>
                   <div>
                     <label className="text-sm font-bold text-amber-200/80 uppercase tracking-widest">Rol</label>
                     <select name="role" defaultValue={editingUser.role} className="w-full mt-2 px-4 py-3 rounded-xl bg-black/50 border border-amber-900/50 text-amber-50 focus:ring-2 focus:ring-amber-600 focus:outline-none transition-shadow">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="cafeteria">Cafetería</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-sm font-bold text-amber-200/80 uppercase tracking-widest">Nueva Contraseña (Opcional)</label>
                     <input type="password" name="password" minLength={6} placeholder="Dejar en blanco para no cambiar..." className="w-full mt-2 px-4 py-3 rounded-xl bg-black/50 border border-amber-900/50 text-amber-50 focus:ring-2 focus:ring-amber-600 focus:outline-none transition-shadow" />
                   </div>
                   <div className="flex justify-end gap-4 mt-8">
                     <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2.5 rounded-xl bg-[#2a1f18] hover:bg-[#382b22] border border-amber-900/50 text-amber-100 font-bold transition-colors">Cancelar</button>
                     <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold shadow-lg transition-colors">Actualizar Info</button>
                   </div>
                </form>
              )}
           </div>
         </div>
      )}

      {/* MODAL GESTION DE MENU PARA CAFETERIAS (ADMIN) */}
      {managingMenu && (
         <AdminMenuModal 
            cafeteriaId={managingMenu.id} 
            cafeteriaName={managingMenu.name + " " + managingMenu.lastName} 
            onClose={() => setManagingMenu(null)} 
         />
      )}
    </div>
  );
}
