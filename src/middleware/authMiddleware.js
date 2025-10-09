//Para la implementacion de JWT en el proyecto.

import jwt from "jsonwebtoken";

const JWT_SECRET =
	process.env.JWT_SECRET || "mi_secreto_super_seguro_para_el_examen";

//PD: Como no se solicita un archivo .env se hardcodea el secret,
// pero se debe crear un archivo .env agregar para no tener que hardcodea
// el valor de JWT_SECRET.

export const authMiddleware = {
	// Generar token JWT
	generateToken(payload) {
		try {
			return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
		} catch (error) {
			throw new Error("Error al generar token");
		}
	},

	// Verificar token JWT
	verifyToken(token) {
		try {
			return jwt.verify(token, JWT_SECRET);
		} catch (error) {
			throw new Error("Token inválido o expirado");
		}
	},

	// Middleware para proteger rutas
	protectRoute(request, response, next) {
		try {
			const authHeader = request.headers.authorization;

			if (!authHeader) {
				return response.status(401).json({
					status: 401,
					error: "Token de acceso requerido",
					message: "Debe proporcionar un token de autorización",
				});
			}

			const token = authHeader.split(" ")[1]; // Bearer <token>

			if (!token) {
				return response.status(401).json({
					status: 401,
					error: "Formato de token inválido",
					message: "Use el formato: Bearer <token>",
				});
			}

			const decoded = this.verifyToken(token);
			request.user = decoded;
			next();
		} catch (error) {
			return response.status(401).json({
				status: 401,
				error: "Token inválido",
				message: error.message,
			});
		}
	},
};
