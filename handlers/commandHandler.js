import { loadFiles } from "../Functions/fileloader.js";
import { pathToFileURL } from "url";
import { stat } from "node:fs/promises";

export const loadCommands = async (client) => {
	await client.commands.clear();
	const commandsArray = [];

	const Files = await loadFiles("Commands");

	for (const file of Files) {
		const fileStats = await stat(file);
		const commandModule = await import(`${pathToFileURL(file).href}?v=${fileStats.mtimeMs}`);
		const command = commandModule.default ?? commandModule;

		client.commands.set(command.data.name, command);
		commandsArray.push(command.data.toJSON());
	}

	client.application.commands.set(commandsArray);
};

