import mongoose from "mongoose";
import userSchema from "./schemas/userSchema.js";
import productSchema from "./schemas/productSchema.js";

export const usersCollection = mongoose.model("UUser", userSchema);

export const productsCollection = mongoose.model("products", productSchema)