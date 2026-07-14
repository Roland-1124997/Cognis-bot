import { createSlashCommand } from "../../builders/SlashCommands.js";
import { sendReply } from "../../builders/interactions.js";
import { PermissionFlagsBits } from "discord.js";

export const data = createSlashCommand({
	name: "age",
	description: "Get the age of a user",
	DefaultMemberPermissions: PermissionFlagsBits.Administrator,
	options: [
		{
			name: "user",
			description: "The user to get the age of",
			type: "user",
			required: true,
		},
	],
});

export const execute = async (interaction, client) => {
    const { options, user } = interaction;

	const target = options.getUser("user") || user

	const discordEpoch = 1420070400000n;
	const createdTimestamp = Number((BigInt(target.id) >> 22n) + discordEpoch);
	const createdAt = new Date(createdTimestamp);
	const ageDays = Math.floor((Date.now() - createdTimestamp) / 86400000);

	await sendReply(interaction,`<t:${Math.floor(createdTimestamp / 1000)}:F> \nAge: ${ageDays} days`, interaction);
};
