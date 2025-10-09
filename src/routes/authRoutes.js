//Para la implementacion de JWT en el proyecto, rutas.
import express from "express";
import { authController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

// Rutas públicas
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

// Rutas protegidas
authRouter.get(
	"/profile",
	authMiddleware.protectRoute.bind(authMiddleware),
	authController.getProfile,
);
