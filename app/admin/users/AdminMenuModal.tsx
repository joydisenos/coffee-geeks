"use client";

import { useState, useEffect } from "react";
import MenuClientPage from "@/app/perfil/menu/MenuClientPage";
import { getCategories, getProducts } from "@/app/actions/catalog";

export default function AdminMenuModal({ cafeteriaId, cafeteriaName, onClose }: { cafeteriaId: string, cafeteriaName: string, onClose: () => void }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We fetch when the modal mounts
  useEffect(() => {
     async function load() {
       setLoading(true);
       const cats = await getCategories(cafeteriaId);
       const prods = await getProducts(cafeteriaId);
       setCategories(cats);
       setProducts(prods);
       setLoading(false);
     }
     load();
  }, [cafeteriaId]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#4c000a] border border-[#bedcf8]/20 rounded-3xl p-8 w-full max-w-5xl my-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.7)] animate-fade-in-up duration-300">
         <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors text-2xl font-bold">&times;</button>
         <h2 className="text-2xl font-black mb-6 text-[#bedcf8] tracking-wide border-b border-[#bedcf8]/10 pb-4">
            Cargar Menú para: <span className="text-[#bedcf8]/70">{cafeteriaName}</span>
         </h2>

         {loading ? (
            <div className="py-20 text-center text-white/50 animate-pulse">Cargando catálogo...</div>
         ) : (
            // Reutilizamos el componente del cliente, la action invalidará, 
            // pero para refrescar la ventana deberia re-fetchear o confiar en revalidatePath
            <div className="max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                <MenuClientPage cafeteriaId={cafeteriaId} initialCategories={categories} initialProducts={products} />
                <div className="mt-8 text-center">
                   <button onClick={async () => {
                      // refresh forced manually by reloading or just closing
                      const cats = await getCategories(cafeteriaId);
                      const prods = await getProducts(cafeteriaId);
                      setCategories(cats);
                      setProducts(prods);
                   }} className="text-xs text-white/30 hover:text-white/60">Actualizar Vista</button>
                </div>
            </div>
         )}
      </div>
    </div>
  );
}
