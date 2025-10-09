//Para la implementacion de JWT en el proyecto, capa de controlador.
import { authService } from "../services/authService.js";

export const authController = {
	async register(request, response) {
		try {
			const result = await authService.register(request.body);

			if (!result.success) {
				const statusCode =
					result.code === "USER_EXISTS"
						? 409
						: result.code === "MISSING_DATA"
							? 400
							: 500;
				return response.status(statusCode).json({
					status: statusCode,
					error: result.error,
					code: result.code,
					message: "No se pudo registrar el usuario",
				});
			}

			response.status(201).json({
				status: 201,
				data: result.data,
				message: "Usuario registrado exitosamente",
			});
		} catch (error) {
			console.error("Error en registro:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},

	async login(request, response) {
		try {
			const { email, password } = request.body;

			if (!email || !password) {
				return response.status(400).json({
					status: 400,
					error: "Email y contraseña son requeridos",
					message: "Debe proporcionar email y contraseña",
				});
			}

			const result = await authService.login(email, password);

			if (!result.success) {
				const statusCode =
					result.code === "INVALID_CREDENTIALS"
						? 401
						: result.code === "USER_INACTIVE"
							? 403
							: 500;
				return response.status(statusCode).json({
					status: statusCode,
					error: result.error,
					code: result.code,
					message: "No se pudo iniciar sesión",
				});
			}

			response.json({
				status: 200,
				data: result.data,
				message: "Login exitoso",
			});
		} catch (error) {
			console.error("Error en login:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},

	async getProfile(request, response) {
		try {
			response.json({
				status: 200,
				data: request.user,
				message: "Perfil obtenido exitosamente",
			});
		} catch (error) {
			console.error("Error al obtener perfil:", error);
			response.status(500).json({
				status: 500,
				error: "Error interno del servidor",
				message: error.message,
			});
		}
	},
};
