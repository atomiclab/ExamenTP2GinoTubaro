//Para el punto 1
import express from "express";
import { productosController } from "../controllers/productosController.js";

export const productosRouter = express.Router();

// GET /api/productos
productosRouter.get("/", productosController.getAllProductos);
