"use client";

import { useState } from "react";
import { deleteUser, updateUserAdmin } from "@/app/actions/user";
import { register } from "@/app/actions/auth";

export default function UserTableManager({ initialUsers }: { initialUsers: any[] }) {
  const [editingUser, setEditingUser] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("¿Está seguro de que desea eliminar este usuario?")) return;
    setLoading(true);
    await deleteUser(id);
    setLoading(false);
  }

  return (
    <div className="relative">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setCreating(true)}
          className="bg-amber-700 hover:bg-amber-600 border border-amber-500/50 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_4px_20px_rgba(217,119,6,0.2)] hover:shadow-[0_4px_25px_rgba(217,119,6,0.4)] transition-all duration-300 hover:-translate-y-0.5 tracking-wide"
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
              <th className="px-6 py-5">Fecha Reg.</th>
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.map((u) => (
              <tr key={u.id} className="border-b border-amber-900/20 hover:bg-amber-900/20 transition-colors duration-200">
                <td className="px-6 py-5 font-semibold text-amber-50">
                  {u.name} {u.lastName}
                </td>
                <td className="px-6 py-5 font-medium">{u.email}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-inner ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-[#1c140f] text-amber-200/60 border border-amber-900/50'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-amber-200/50 font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-5 text-right space-x-4 font-bold tracking-wide">
                  <button onClick={() => setEditingUser(u)} className="text-orange-400 hover:text-orange-300 hover:underline transition-colors" disabled={loading}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-400 hover:underline transition-colors" disabled={loading}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
            {initialUsers.length === 0 && (
              <tr>
                 <td colSpan={5} className="text-center py-10 text-amber-700 font-medium tracking-wide">No hay usuarios registrados en el sistema.</td>
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
                 await register((state: any) => state, fd); // Fake state injection since we bind useActionState conceptually, but this calls action directly. 
                 // Wait! Register was updated to take (state, fd). We must pass a dummy state.
                 setCreating(false);
                 setLoading(false);
                 window.location.reload(); // Quick refresh to see data since we used register which redirects. Better yet:
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
           <div className="bg-[#1c140f] border border-amber-900/40 rounded-3xl p-8 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-fade-in-up duration-300">
              <h2 className="text-2xl font-black mb-6 text-amber-50 tracking-wide border-b border-amber-900/30 pb-4">Editar Usuario</h2>
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
                   </select>
                 </div>
                 <div className="flex justify-end gap-4 mt-8">
                   <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2.5 rounded-xl bg-[#2a1f18] hover:bg-[#382b22] border border-amber-900/50 text-amber-100 font-bold transition-colors">Cancelar</button>
                   <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold shadow-lg transition-colors">Actualizar Info</button>
                 </div>
              </form>
           </div>
         </div>
      )}
    </div>
  );
}
