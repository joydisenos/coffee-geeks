import { getSiteConfig } from "@/app/actions/siteConfig";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const config = await getSiteConfig();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-amber-50 drop-shadow-md">
          Configuración del Sitio
        </h1>
        <p className="text-amber-100/60 text-lg mt-1">
          SEO, redes sociales, contacto y política de privacidad.
        </p>
      </div>

      <SettingsForm config={config} />
    </div>
  );
}
