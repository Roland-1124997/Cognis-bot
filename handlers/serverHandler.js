import express from "express";
import http from "http";
import cron from "node-cron";

export const loadServer = () => {
	const app = express();
	const server = http.createServer(app);

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.get("/status", (req, res) => res.status(200).json({ status: 200, message: "OK" }));

	cron.schedule("*/1 * * * *", () => fetch(`${process.env.DISCORD_BASE_URL}/status`).catch((error) => {
		console.error(`\x1b[31m✖\x1b[0m Server status check failed: ${error}`);
	}));

	server.listen(4000);
	server.on("listening", () => {
		console.log(`\x1b[32m✔\x1b[0m Express server is running on port 4000`);
	});
};
