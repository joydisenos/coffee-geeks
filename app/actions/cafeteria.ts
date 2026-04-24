"use server";

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ─── Utilidad: guardar imagen en <project_root>/uploads/ ──────────────────────
async function saveUploadedFile(file: File, subfolder = ""): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "uploads", subfolder);
  await mkdir(uploadDir, { recursive: true });
  const ext = file.name.split(".").pop() ?? "webp";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return subfolder ? `/api/uploads/${subfolder}/${filename}` : `/api/uploads/${filename}`;
}

async function getTargetUser(session: any, formData?: FormData, explicitTargetId?: string) {
  if (session?.role === "admin") {
    const targetId = formData ? formData.get("targetUserId")?.toString() : explicitTargetId;
    return { targetUserId: targetId || session.userId, isAdmin: true };
  }
  if (!session || session.role !== "cafeteria") {
    throw new Error("No autorizado.");
  }
  return { targetUserId: session.userId, isAdmin: false };
}

function doRevalidate(isAdmin: boolean) {
  if (isAdmin) revalidatePath("/admin/users");
  revalidatePath("/perfil");
}

// ─── Actualizar perfil base de cafetería ──────────────────────────────────────
export async function updateCafeteriaProfile(state: any, formData: FormData) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, formData);

    await dbConnect();

    const cafeteriaName = formData.get("cafeteriaName")?.toString().trim() ?? "";
    const neighborhood = formData.get("neighborhood")?.toString().trim() ?? "";
    const competitionCategory = formData.get("competitionCategory")?.toString().trim() ?? "";
    const description = formData.get("description")?.toString().trim() ?? "";
    const hours = formData.get("hours")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const web = formData.get("web")?.toString().trim() ?? "";
    const businessType = formData.get("businessType")?.toString().trim() ?? "coffee";

    const updateData: Record<string, any> = {
      cafeteriaName,
      neighborhood,
      competitionCategory,
      description,
      hours,
      phone,
      web,
      businessType,
    };

    const locationLatStr = formData.get("locationLat")?.toString().trim();
    const locationLngStr = formData.get("locationLng")?.toString().trim();
    if (locationLatStr) updateData.locationLat = parseFloat(locationLatStr);
    if (locationLngStr) updateData.locationLng = parseFloat(locationLngStr);

    const coverFile = formData.get("coverImage") as File | null;
    if (coverFile && coverFile.size > 0) {
      updateData.coverImage = await saveUploadedFile(coverFile, "covers");
    }

    await User.findByIdAndUpdate(targetUserId, updateData);
    doRevalidate(isAdmin);

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
    const { targetUserId, isAdmin } = await getTargetUser(session, formData);

    const fullName = formData.get("fullName")?.toString().trim() ?? "";
    if (!fullName) return { error: "El nombre completo es obligatorio." };

    await dbConnect();

    let photoUrl = "";
    const photoFile = formData.get("photo") as File | null;
    if (photoFile && photoFile.size > 0) {
      photoUrl = await saveUploadedFile(photoFile, "baristas");
    }

    await User.findByIdAndUpdate(targetUserId, {
      $push: { baristas: { fullName, photo: photoUrl, isHighlighted: false } },
    });

    doRevalidate(isAdmin);
    return { success: "Barista agregado." };
  } catch (err) {
    console.error(err);
    return { error: "Error al agregar barista." };
  }
}

// ─── Eliminar un barista por _id ──────────────────────────────────────────────
export async function deleteBarista(baristaId: string, explicitTargetId?: string) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, undefined, explicitTargetId);

    await dbConnect();
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { baristas: { _id: baristaId } },
    });

    doRevalidate(isAdmin);
    return { success: "Barista eliminado." };
  } catch (err) {
    return { error: "Error al eliminar barista." };
  }
}

// ─── Marcar barista destacado (solo uno a la vez) ─────────────────────────────
export async function setHighlightedBarista(baristaId: string, explicitTargetId?: string) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, undefined, explicitTargetId);

    await dbConnect();

    // Quitar highlight de todos
    await User.updateOne(
      { _id: targetUserId },
      { $set: { "baristas.$[].isHighlighted": false } }
    );

    // Activar solo el seleccionado
    await User.updateOne(
      { _id: targetUserId, "baristas._id": baristaId },
      { $set: { "baristas.$.isHighlighted": true } }
    );

    doRevalidate(isAdmin);
    return { success: "Barista destacado actualizado." };
  } catch (err) {
    return { error: "Error al destacar barista." };
  }
}

// ─── Subir imágenes a la galería ──────────────────────────────────────────────
export async function uploadGalleryImages(state: any, formData: FormData) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, formData);

    await dbConnect();
    const SiteConfig = (await import("@/models/SiteConfig")).default;
    const config = await SiteConfig.findOne({}).lean();
    const maxImages = (config as any)?.maxGalleryImages ?? 3;

    const user = await User.findById(targetUserId);
    const files = formData.getAll("gallery") as File[];
    const validFiles = files.filter(f => f.size > 0);

    if (user.gallery.length + validFiles.length > maxImages) {
      return { error: `Solo puedes tener hasta ${maxImages} imágenes en tu galería.` };
    }

    const newUrls = [];
    for (const file of validFiles) {
      newUrls.push(await saveUploadedFile(file, "gallery"));
    }

    if (newUrls.length > 0) {
      await User.findByIdAndUpdate(targetUserId, {
        $push: { gallery: { $each: newUrls } }
      });
    }

    doRevalidate(isAdmin);
    return { success: "Imágenes añadidas a la galería." };
  } catch (err) {
    console.error(err);
    return { error: "Error al actualizar la galería." };
  }
}

// ─── Eliminar imagen de la galería ───────────────────────────────────────────
export async function deleteGalleryImage(imageUrl: string, explicitTargetId?: string) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, undefined, explicitTargetId);

    await dbConnect();
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { gallery: imageUrl }
    });

    doRevalidate(isAdmin);
    return { success: "Imagen eliminada." };
  } catch (err) {
    return { error: "Error al eliminar la imagen." };
  }
}

// ─── Alternar estado de activación (Solo Admin) ─────────────────────────────────
export async function toggleCafeteriaStatus(userId: string, currentStatus: boolean) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "No autorizado." };
    }

    await dbConnect();
    await User.findByIdAndUpdate(userId, { isActive: !currentStatus });
    
    revalidatePath("/admin/users");
    revalidatePath("/home");
    revalidatePath("/participantes");
    return { success: `Cafetería ${!currentStatus ? 'activada' : 'desactivada'}.` };
  } catch (err) {
    console.error(err);
    return { error: "Error al cambiar el estado." };
  }
}
