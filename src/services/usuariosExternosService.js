//Para el punto 2

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = process.env.CSV_PATH || path.join(__dirname, "../../data/usuarios.csv");
const externalApiUrl = process.env.EXTERNAL_API_URL || 
	"https://raw.githubusercontent.com/Andru-1987/csv_files_ds/refs/heads/main/Video_Games.csv";

export const usuariosExternosService = {
	async fetchExternalData() {
		try {
			const response = await fetch(externalApiUrl, {
				method: "GET",
				headers: {
					"content-type": "text/csv;charset=UTF-8",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const csvData = await response.text();

			return { success: true, data: csvData };
		} catch (error) {
			return {
				success: false,
				error: "Error al consumir API externa",
				details: error.message,
			};
		}
	},

	async saveToCSV(csvData) {
		try {
			await fs.writeFile(csvPath, csvData, { encoding: "utf8" });
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: "Error al guardar archivo CSV",
				details: error.message,
			};
		}
	},

	async processExternalData() {
		try {
			const fetchResult = await this.fetchExternalData();

			if (!fetchResult.success) {
				return fetchResult;
			}

			const saveResult = await this.saveToCSV(fetchResult.data);

			if (!saveResult.success) {
				return saveResult;
			}

			const lines = fetchResult.data.split("\n");
			const headers = lines[0].split(",");
			const dataRows = lines.slice(1).filter((line) => line.trim()).length;

			return {
				success: true,
				data: {
					totalRecords: dataRows,
					headers: headers,
					source: "Github del profe fue fetcheado con exito",
					filePath: csvPath,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: "Error:",
				details: error.message,
			};
		}
	},
};
