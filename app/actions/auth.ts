"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

// Utility para sanitizar inputs rápidos contra inyecciones absurdas
function sanitizeString(input: any) {
  if (typeof input !== "string") {
    return "";
  }
  return input.trim();
}

export async function login(state: any, formData: FormData) {
  await dbConnect();

  const email = sanitizeString(formData.get("email"));
  const password = sanitizeString(formData.get("password"));

  if (!email || !password) {
    return { error: "Todos los campos son obligatorios." };
  }

  // Prevención de inyección NoSQL forzando strings concretos:
  const user = await User.findOne({ email: String(email) });

  if (!user) {
    return { error: "Credenciales inválidas." };
  }

  // Verificación del hash de bcrypt a prueba de ataques (timing safe por defecto)
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Credenciales inválidas." };
  }

  // Creamos la sesión y guardamos en cookie
  await createSession(user._id.toString(), user.role);

  if (user.role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/perfil");
  }
}

export async function register(state: any, formData: FormData) {
  await dbConnect();

  const name = sanitizeString(formData.get("name"));
  const lastName = sanitizeString(formData.get("lastName"));
  const email = sanitizeString(formData.get("email"));
  const password = sanitizeString(formData.get("password"));

  if (!name || !email || !password) {
    return { error: "Nombre, email y contraseña son obligatorios." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const existingUser = await User.findOne({ email: String(email) });
  if (existingUser) {
    return { error: "Este correo electrónico ya está registrado." };
  }

  // Hashing bcrypt 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Si no hay usuarios en la base de datos, el primero será admin por defecto 
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? "admin" : "user";

  const newUser = await User.create({
    name,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  // Logeamos al usuario tras su registro
  await createSession(newUser._id.toString(), newUser.role);

  if (role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/perfil");
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
