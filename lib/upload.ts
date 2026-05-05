import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveUploadedFile(file: File, subfolder = ""): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "uploads", subfolder);
  await mkdir(uploadDir, { recursive: true });
  
  // Extension handling
  let ext = "webp";
  if (file.name.includes(".")) {
    ext = file.name.split(".").pop() || "webp";
  } else if (file.type) {
    ext = file.type.split("/").pop() || "webp";
  }
  
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  
  return subfolder ? `/api/uploads/${subfolder}/${filename}` : `/api/uploads/${filename}`;
}
