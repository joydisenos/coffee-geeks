import mongoose, { Schema, model, models } from "mongoose";
// Model updated with new roles: juez_local, juez_internacional

const BaristaSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  photo: { type: String, default: "" },
  isHighlighted: { type: Boolean, default: false },
});

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "El correo electrónico es obligatorio"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "El correo electrónico no es válido",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "cafeteria", "juez_local", "juez_internacional"],
      default: "user",
    },
    // ── Campos exclusivos del rol cafetería ──
    businessType: {
      type: String,
      enum: ["coffee", "hotel", "rest"],
      default: "coffee",
    },
    isActive: { type: Boolean, default: false },
    cafeteriaName: { type: String, trim: true, default: "" },
    neighborhood: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    hours: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    web: { type: String, trim: true, default: "" },
    coverImage: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    locationLat: { type: Number, default: null },
    locationLng: { type: Number, default: null },
    competitionCategory: {
      type: [String],
      enum: ["Filtrado", "Espresso", "Bebida de Autor"],
      default: [],
    },
    baristas: { type: [BaristaSchema], default: [] },
    advancedToRound2: { type: Boolean, default: false },

  },
  {
    timestamps: true,
  }
);

// Delete the password when returning the generic object to frontend
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// Force model re-registration in development to pick up schema changes
if (models && models.User) {
  delete models.User;
}

const User = model("User", UserSchema);
export default User;
