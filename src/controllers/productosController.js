//Para el punto 1
import { productosService } from "../services/productosService.js";

export const productosController = {
	async getAllProductos(_request, response) {
		try {
			const result = await productosService.getAllProductos();

			if (!result.success) {
				return response.status(404).json({
					status: 404,
					error: result.error,
					code: result.code,
					message: "No se pudo cargar la información de productos",
				});
			}

			response.json({
				status: 200,
				data: result.data,
				count: result.data.length,
				message: "Productos obtenidos exitosamente",
			});
		} catch (error) {
			console.error("Error al obtener productos:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},
};
