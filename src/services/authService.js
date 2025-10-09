//Para la implementacion de JWT en el proyecto, capa de servicio.

import bcrypt from "bcryptjs";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { usuariosService } from "./usuariosService.js";

export const authService = {
	async register(userData) {
		try {
			// Validar datos requeridos
			if (!userData.email || !userData.password) {
				return {
					success: false,
					error: "Email y contraseña son requeridos",
					code: "MISSING_DATA",
				};
			}

			// Verificar si el usuario ya existe
			const existingUser = await usuariosService.getUsuarioByEmail(
				userData.email,
			);
			if (existingUser.success) {
				return {
					success: false,
					error: "El usuario ya existe",
					code: "USER_EXISTS",
				};
			}

			// Encriptar contraseña
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

			// Crear usuario
			const newUser = {
				nombre: userData.nombre,
				email: userData.email,
				telefono: userData.telefono || "",
				edad: userData.edad || 0,
				activo: true,
				password: hashedPassword,
			};

			const result = await usuariosService.createUsuario(newUser);
			if (!result.success) {
				return result;
			}

			// Generar token
			const token = authMiddleware.generateToken({
				userId: result.data.id,
				email: result.data.email,
				nombre: result.data.nombre,
			});

			return {
				success: true,
				data: {
					user: {
						id: result.data.id,
						nombre: result.data.nombre,
						email: result.data.email,
						telefono: result.data.telefono,
						edad: result.data.edad,
						activo: result.data.activo,
						fechaCreacion: result.data.fechaCreacion,
					},
					token: token,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: "Error en el registro",
				details: error.message,
			};
		}
	},

	async login(email, password) {
		try {
			// Buscar usuario por email
			const userResult = await usuariosService.getUsuarioByEmail(email);
			if (!userResult.success) {
				return {
					success: false,
					error: "Credenciales inválidas",
					code: "INVALID_CREDENTIALS",
				};
			}

			const user = userResult.data;

			// Verificar contraseña
			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				return {
					success: false,
					error: "Credenciales inválidas",
					code: "INVALID_CREDENTIALS",
				};
			}

			// Verificar si el usuario está activo
			if (!user.activo) {
				return {
					success: false,
					error: "Usuario desactivado",
					code: "USER_INACTIVE",
				};
			}

			// Generar token
			const token = authMiddleware.generateToken({
				userId: user.id,
				email: user.email,
				nombre: user.nombre,
			});

			return {
				success: true,
				data: {
					user: {
						id: user.id,
						nombre: user.nombre,
						email: user.email,
						telefono: user.telefono,
						edad: user.edad,
						activo: user.activo,
						fechaCreacion: user.fechaCreacion,
					},
					token: token,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: "Error en el login",
				details: error.message,
			};
		}
	},
};
