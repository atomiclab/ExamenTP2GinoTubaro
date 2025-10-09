//Para el punto 2
import express from "express";
import { usuariosExternosController } from "../controllers/usuariosExternosController.js";

export const usuariosExternosRouter = express.Router();

// GET /api/usuarios-externos
usuariosExternosRouter.get("/", usuariosExternosController.getUsuariosExternos);
