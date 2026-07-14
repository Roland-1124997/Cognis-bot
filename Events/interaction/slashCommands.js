import { deferReply, editReply } from "../../builders/interactions.js";

export const name = "interactionCreate";
export const execute = async (interaction, client) => {
	
	if (interaction.isAutocomplete()) {
		const command = client.commands.get(interaction.commandName);
		if (command?.autocomplete) await command.autocomplete(interaction);
		return;
	}

	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return editReply(interaction, "An error has occured");
	if (command.developer && interaction.user.id !== "322393281306689536") return editReply(interaction, "This is a developer only command");

	command.execute(interaction, client);
};
