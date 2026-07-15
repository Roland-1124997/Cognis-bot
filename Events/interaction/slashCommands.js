import { sendReply } from "../../builders/interactions.js";

export const name = "interactionCreate";
export const execute = async (interaction, client) => {
	
	if (interaction.isAutocomplete()) {
		const command = client.commands.get(interaction.commandName);
		if (command?.autocomplete) await command.autocomplete(interaction);
		return;
	}

	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return sendReply(interaction, "An error has occured");
	if (command.developer && interaction.user.id !== process.env.DISCORD_OWNER_ID) return sendReply(interaction, "This is a developer only command");

	command.execute(interaction, client);
};
