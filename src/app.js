import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { productosRouter } from "./routes/productosRoutes.js";
import { usuariosExternosRouter } from "./routes/usuariosExternosRoutes.js";
import { usuariosRouter } from "./routes/usuariosRoutes.js";
import { authRouter } from "./routes/authRoutes.js";

const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || "127.0.0.1";

//PD: No tenemos un archivo .env pedido, pero se puede agregar para no tener que hardcodear los valores superiores.

const app = express();

// Middleware para debugguear, se rompio todo intentando poner el jwt
app.use((req, res, next) => {
	console.log(`Logging: ${req.method} ${req.originalUrl}`);
	next();
});

app.use(morgan(process.env.LOG_LEVEL || "combined"));
app.use(express.json());

// Routes
app.use("/api/productos", productosRouter);
app.use("/api/usuarios-externos", usuariosExternosRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/auth", authRouter);

// Ruta de prueba
app.get("/", (_req, res) => {
	res.json({
		status: 200,
		message: "API funcionando correctamente",
	});
});
//Ruta no encontrada
app.use((req, res, next) => {
	console.log(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
	res.status(404).json({
		success: false,
		error: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
	});
});

// Manejo de errores
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({
		status: 500,
		error: "Algo salió mal!",
	});
});

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

export default app;
