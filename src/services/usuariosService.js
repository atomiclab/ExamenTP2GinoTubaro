//Para el punto 3

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto"; //Extra, fue creado en al branch UUIDimplementation, que fue luego mergeada a la main.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, "../../data/usuariodb.json");
//Como el punto 2 traemos un CSV que no tiene datos como si fuera una db de usuarios,
//cree otro archivo que se parezca a una db de usuarios.
//Como ambos endpoints tratarian de "usuarios", le puse usuariosdb para diferenciarlo.

export const usuariosService = {
	async getAllUsuarios() {
		try {
			const data = await fs.readFile(dbPath, "utf8");
			const usuarios = JSON.parse(data);
			return { success: true, data: usuarios };
		} catch (error) {
			if (error.code === "ENOENT") {
				return {
					success: false,
					error: "Base de datos no encontrada",
					code: "DB_NOT_FOUND",
				};
			}
			return {
				success: false,
				error: "Error al leer usuarios",
				details: error.message,
			};
		}
	},

	async getUsuarioById(id) {
		try {
			const result = await this.getAllUsuarios();
			if (!result.success) return result;

			const usuario = result.data.find((u) => u.id === id);
			if (!usuario) {
				return {
					success: false,
					error: "Usuario no encontrado",
					code: "USER_NOT_FOUND",
				};
			}

			return { success: true, data: usuario };
		} catch (error) {
			return {
				success: false,
				error: "Error al buscar usuario",
				details: error.message,
			};
		}
	},

	async createUsuario(usuarioData) {
		try {
			const result = await this.getAllUsuarios();
			if (!result.success) return result;

			// Validar email único
			const emailExists = result.data.some(
				(u) => u.email === usuarioData.email,
			);
			if (emailExists) {
				return {
					success: false,
					error: "El email ya existe",
					code: "EMAIL_EXISTS",
				};
			}

			// Generar nuevo UUID
			const newUsuario = {
				id: randomUUID(),
				nombre: usuarioData.nombre,
				email: usuarioData.email,
				telefono: usuarioData.telefono || "",
				edad: usuarioData.edad || 0,
				activo: usuarioData.activo !== undefined ? usuarioData.activo : true,
				fechaCreacion: new Date().toISOString().split("T")[0],
				password: usuarioData.password || null,
			};

			result.data.push(newUsuario);
			await this.saveUsuarios(result.data);

			return { success: true, data: newUsuario };
		} catch (error) {
			return {
				success: false,
				error: "Error al crear usuario",
				details: error.message,
			};
		}
	},

	async updateUsuario(id, usuarioData) {
		try {
			const result = await this.getAllUsuarios();
			if (!result.success) return result;

			const usuarioIndex = result.data.findIndex((u) => u.id === id);
			if (usuarioIndex === -1) {
				return {
					success: false,
					error: "Usuario no encontrado",
					code: "USER_NOT_FOUND",
				};
			}

			// Validar email único (si se está cambiando)
			if (
				usuarioData.email &&
				usuarioData.email !== result.data[usuarioIndex].email
			) {
				const emailExists = result.data.some(
					(u) => u.email === usuarioData.email && u.id !== id,
				);
				if (emailExists) {
					return {
						success: false,
						error: "El email ya existe",
						code: "EMAIL_EXISTS",
					};
				}
			}

			// Actualizar usuario completo
			const usuarioActualizado = {
				id: id,
				nombre: usuarioData.nombre || result.data[usuarioIndex].nombre,
				email: usuarioData.email || result.data[usuarioIndex].email,
				telefono: usuarioData.telefono || result.data[usuarioIndex].telefono,
				edad: usuarioData.edad || result.data[usuarioIndex].edad,
				activo:
					usuarioData.activo !== undefined
						? usuarioData.activo
						: result.data[usuarioIndex].activo,
				fechaCreacion: result.data[usuarioIndex].fechaCreacion,
			};

			result.data[usuarioIndex] = usuarioActualizado;

			await this.saveUsuarios(result.data);
			return { success: true, data: usuarioActualizado };
		} catch (error) {
			return {
				success: false,
				error: "Error al actualizar usuario",
				details: error.message,
			};
		}
	},

	async deleteUsuario(id) {
		try {
			const result = await this.getAllUsuarios();
			if (!result.success) return result;

			const usuarioIndex = result.data.findIndex((u) => u.id === id);
			if (usuarioIndex === -1) {
				return {
					success: false,
					error: "Usuario no encontrado",
					code: "USER_NOT_FOUND",
				};
			}

			const usuarioEliminado = result.data[usuarioIndex];
			result.data.splice(usuarioIndex, 1);
			await this.saveUsuarios(result.data);

			return { success: true, data: usuarioEliminado };
		} catch (error) {
			return {
				success: false,
				error: "Error al eliminar usuario",
				details: error.message,
			};
		}
	},
	async saveUsuarios(usuarios) {
		try {
			await fs.writeFile(dbPath, JSON.stringify(usuarios, null, 2), "utf8");
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: "Error al guardar usuarios",
				details: error.message,
			};
		}
	},

	//Buscar usuarios por mail
	async getUsuarioByEmail(email) {
		try {
			const result = await this.getAllUsuarios();
			if (!result.success) return result;

			const usuario = result.data.find((u) => u.email === email);
			if (!usuario) {
				return {
					success: false,
					error: "Usuario no encontrado",
					code: "USER_NOT_FOUND",
				};
			}

			return { success: true, data: usuario };
		} catch (error) {
			return {
				success: false,
				error: "Error al buscar usuario",
				details: error.message,
			};
		}
	},
};
