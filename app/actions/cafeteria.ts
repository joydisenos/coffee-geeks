"use server";

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ─── Utilidad: guardar imagen en <project_root>/uploads/ ──────────────────────
// Se guarda FUERA de /public para que sobreviva los deploys (git pull + build)
// y se sirve vía /api/uploads/[...path]
async function saveUploadedFile(file: File, subfolder = ""): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Directorio raíz del proyecto, NO dentro de /public
  const uploadDir = path.join(process.cwd(), "uploads", subfolder);
  await mkdir(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop() ?? "webp";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  // URL pública servida por la API route
  return subfolder ? `/api/uploads/${subfolder}/${filename}` : `/api/uploads/${filename}`;
}


// ─── Actualizar perfil base de cafetería ──────────────────────────────────────
export async function updateCafeteriaProfile(state: any, formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "cafeteria") {
      return { error: "No autorizado." };
    }

    await dbConnect();

    const cafeteriaName = formData.get("cafeteriaName")?.toString().trim() ?? "";
    const neighborhood = formData.get("neighborhood")?.toString().trim() ?? "";
    const competitionCategory = formData.get("competitionCategory")?.toString().trim() ?? "";

    const updateData: Record<string, any> = {
      cafeteriaName,
      neighborhood,
      competitionCategory,
    };

    // Cover image: solo actualiza si se sube un archivo nuevo
    const coverFile = formData.get("coverImage") as File | null;
    if (coverFile && coverFile.size > 0) {
      updateData.coverImage = await saveUploadedFile(coverFile, "covers");
    }

    await User.findByIdAndUpdate(session.userId, updateData);
    revalidatePath("/perfil");

    return { success: "Perfil de cafetería actualizado correctamente." };
  } catch (err) {
    console.error(err);
    return { error: "Error al actualizar el perfil." };
  }
}

// ─── Agregar un barista ───────────────────────────────────────────────────────
export async function addBarista(state: any, formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "cafeteria") {
      return { error: "No autorizado." };
    }

    const fullName = formData.get("fullName")?.toString().trim() ?? "";
    if (!fullName) return { error: "El nombre completo es obligatorio." };

    await dbConnect();

    let photoUrl = "";
    const photoFile = formData.get("photo") as File | null;
    if (photoFile && photoFile.size > 0) {
      photoUrl = await saveUploadedFile(photoFile, "baristas");
    }

    await User.findByIdAndUpdate(session.userId, {
      $push: { baristas: { fullName, photo: photoUrl, isHighlighted: false } },
    });

    revalidatePath("/perfil");
    return { success: "Barista agregado." };
  } catch (err) {
    console.error(err);
    return { error: "Error al agregar barista." };
  }
}

// ─── Eliminar un barista por _id ──────────────────────────────────────────────
export async function deleteBarista(baristaId: string) {
  const session = await getSession();
  if (!session || session.role !== "cafeteria") return { error: "No autorizado." };

  await dbConnect();
  await User.findByIdAndUpdate(session.userId, {
    $pull: { baristas: { _id: baristaId } },
  });

  revalidatePath("/perfil");
  return { success: "Barista eliminado." };
}

// ─── Marcar barista destacado (solo uno a la vez) ─────────────────────────────
export async function setHighlightedBarista(baristaId: string) {
  const session = await getSession();
  if (!session || session.role !== "cafeteria") return { error: "No autorizado." };

  await dbConnect();

  // Quitar highlight de todos
  await User.updateOne(
    { _id: session.userId },
    { $set: { "baristas.$[].isHighlighted": false } }
  );

  // Activar solo el seleccionado
  await User.updateOne(
    { _id: session.userId, "baristas._id": baristaId },
    { $set: { "baristas.$.isHighlighted": true } }
  );

  revalidatePath("/perfil");
  return { success: "Barista destacado actualizado." };
}
