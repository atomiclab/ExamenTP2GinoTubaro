//Para el punto 2

import { usuariosExternosService } from "../services/usuariosExternosService.js";

export const usuariosExternosController = {
	async getUsuariosExternos(_request, response) {
		try {
			const result = await usuariosExternosService.processExternalData();

			if (!result.success) {
				return response.status(500).json({
					status: 500,
					error: result.error,
					details: result.details,
					message: "No se pudo procesar la informacion externa",
				});
			}

			response.json({
				status: 200,
				data: result.data,
				message: "Datos externos obtenidos y almacenados exitosamente",
			});
		} catch (error) {
			console.error("Error al obtener usuarios externos:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},
};
