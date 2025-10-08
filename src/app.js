import express from "express";
import morgan from "morgan";
import { productosRouter } from "./routes/productosRoutes.js";

const PORT = process.env.PORT ?? "3000";
const HOST = process.env.HOST ?? "127.0.0.1";

//PD: No tenemos un archivo .env pedido, pero se puede agregar para no tener que hardcodear los valores superiores.

const app = express();

app.use(morgan('combined'));
app.use(express.json());

app.use('/api/productos', productosRouter);

app.get('/', (req, res) => {
    res.json({ 
        status: 200, 
        message: 'API funcionando correctamente' 
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        status: 500,
        error: 'Algo salió mal!' 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

export default app;