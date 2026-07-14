import { loadFiles } from "../Functions/fileloader.js";
import { Perms } from "../Validator/Permissions.js";
import { pathToFileURL } from "url";

export const loadCommands = async (client) => {
	
	await client.commands.clear();
	let commandsArray = [];

	const Files = await loadFiles("Commands");

	for (const file of Files) {

		const commandModule = await import(pathToFileURL(file).href);
		const command = commandModule.default ?? commandModule;

		client.commands.set(command.data.name, command);

		if (command.permission) {
			if (Perms.includes(command.permission)) {
				command.defaultPermission = false;
			} else {
				return console.log(`  \x1b[32m> Commands:\x1b[0m ${command.data.name} failed to load`);
			}
		}

		commandsArray.push(command.data.toJSON());
	}

	client.application.commands.set(commandsArray);
	return; //console.log(`  \x1b[32m> Commands:\x1b[0m loaded`);
};
