import { deferReply, editReply } from "../../builders/interactions.js";
import { createSlashCommand } from "../../builders/slashCommands.js";
import { loadCommands } from "../../handlers/commandHandler.js";

export const developer = true;

export const data = createSlashCommand({
	name: "reload",
	description: "Reloads all commands",
});

import { setTimeout as wait } from "node:timers/promises";

export const execute = async (interaction, client) => {
	await deferReply(interaction);
	await editReply(interaction, `Reloading commands...`);

	wait(200);

	await loadCommands(client);

	await editReply(interaction, "Commands reloaded successfully!");
};
