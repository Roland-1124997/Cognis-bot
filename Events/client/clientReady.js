import { ActivityType } from "discord.js";
import { loadCommands } from "../../handlers/commandHandler.js";
import { loadServer } from "../../handlers/serverHandler.js";

export const name = "clientReady";
export const once = true;

export const execute = async (client) => {

	console.log(`\x1b[32m✔\x1b[0m Client build successfully!`);
	client.user.setActivity("keeping chats friendly", { type: ActivityType.Playing })
	
	await loadCommands(client);

	loadServer();

};
