import mongoose from "mongoose";
import userSchema from "./schemas/userSchema.js";

export const usersCollection = mongoose.model("users", userSchema);
