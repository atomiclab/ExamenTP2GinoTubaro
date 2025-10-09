//Para el punto 3
import { usuariosService } from "../services/usuariosService.js";

export const usuariosController = {
	// GET /api/usuarios
	async getAllUsuarios(_request, response) {
		try {
			const result = await usuariosService.getAllUsuarios();

			if (!result.success) {
				const statusCode = result.code === "DB_NOT_FOUND" ? 404 : 500;
				return response.status(statusCode).json({
					status: statusCode,
					error: result.error,
					code: result.code,
					message: "No se pudo obtener la lista de usuarios",
				});
			}

			response.json({
				status: 200,
				data: result.data,
				count: result.data.length,
				message: "Usuarios obtenidos exitosamente",
			});
		} catch (error) {
			console.error("Error al obtener usuarios:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},

	// GET /api/usuarios/:id
	async getUsuarioById(request, response) {
		try {
			const { id } = request.params;
			const result = await usuariosService.getUsuarioById(id);

			if (!result.success) {
				const statusCode = result.code === "USER_NOT_FOUND" ? 404 : 500;
				return response.status(statusCode).json({
					status: statusCode,
					error: result.error,
					code: result.code,
					message: `Usuario con ID ${id} no encontrado`,
				});
			}

			response.json({
				status: 200,
				data: result.data,
				message: "Usuario encontrado exitosamente",
			});
		} catch (error) {
			console.error("Error al obtener usuario:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},

	// POST /api/usuarios
	async createUsuario(request, response) {
		try {
			const usuarioData = request.body;

			// Validaciones básicas
			if (!usuarioData.nombre || !usuarioData.email) {
				return response.status(400).json({
					status: 400,
					error: "Datos incompletos",
					message: "Nombre y email son requeridos",
				});
			}

			const result = await usuariosService.createUsuario(usuarioData);

			if (!result.success) {
				const statusCode = result.code === "EMAIL_EXISTS" ? 409 : 500;
				return response.status(statusCode).json({
					status: statusCode,
					error: result.error,
					code: result.code,
					message: "No se pudo crear el usuario",
				});
			}

			response.status(201).json({
				status: 201,
				data: result.data,
				message: "Usuario creado exitosamente",
			});
		} catch (error) {
			console.error("Error al crear usuario:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},

	// PUT /api/usuarios/:id
	async updateUsuario(request, response) {
		try {
			const { id } = request.params;
			const usuarioData = request.body;

			const result = await usuariosService.updateUsuario(id, usuarioData);

			if (!result.success) {
				const statusCode =
					result.code === "USER_NOT_FOUND"
						? 404
						: result.code === "EMAIL_EXISTS"
							? 409
							: 500;
				return response.status(statusCode).json({
					status: statusCode,
					error: result.error,
					code: result.code,
					message: "No se pudo actualizar el usuario",
				});
			}

			response.json({
				status: 200,
				data: result.data,
				message: "Usuario actualizado exitosamente",
			});
		} catch (error) {
			console.error("Error al actualizar usuario:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},

	// DELETE /api/usuarios/:id
	async deleteUsuario(request, response) {
		try {
			const { id } = request.params;
			const result = await usuariosService.deleteUsuario(id);

			if (!result.success) {
				const statusCode = result.code === "USER_NOT_FOUND" ? 404 : 500;
				return response.status(statusCode).json({
					status: statusCode,
					error: result.error,
					code: result.code,
					message: "No se pudo eliminar el usuario",
				});
			}

			response.json({
				status: 200,
				data: result.data,
				message: "Usuario eliminado exitosamente",
			});
		} catch (error) {
			console.error("Error al eliminar usuario:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},
};
