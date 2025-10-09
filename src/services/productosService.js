//Para el punto 1

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = process.env.PRODUCTOS_PATH || path.join(__dirname, "../../data/productos.json");

export const productosService = {
	async getAllProductos() {
		try {
			const data = await fs.readFile(dataPath, "utf8");
			const productos = JSON.parse(data);
			return { success: true, data: productos };
		} catch (error) {
			if (error.code === "ENOENT") {
				return {
					success: false,
					error: "Archivo de productos no encontrado",
					code: "FILE_NOT_FOUND",
				};
			}
			throw error;
		}
	},
};
