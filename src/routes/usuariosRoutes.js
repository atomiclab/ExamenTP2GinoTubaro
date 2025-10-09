//Para el punto 3
//
import express from "express";
import { usuariosController } from "../controllers/usuariosController.js";

export const usuariosRouter = express.Router();

// CRUD Completo
usuariosRouter.get("/", usuariosController.getAllUsuarios); // GET /api/usuarios
usuariosRouter.get("/:id", usuariosController.getUsuarioById); // GET /api/usuarios/:id
usuariosRouter.post("/", usuariosController.createUsuario); // POST /api/usuarios
usuariosRouter.put("/:id", usuariosController.updateUsuario); // PUT /api/usuarios/:id
usuariosRouter.delete("/:id", usuariosController.deleteUsuario); // DELETE /api/usuarios/:id
