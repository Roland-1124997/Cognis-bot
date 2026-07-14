import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, ChannelType } from "discord.js";
import { setTimeout as wait } from "node:timers/promises";

import { deferReply, editReply } from "../../builders/interactions.js";
import { createSlashCommand } from "../../builders/SlashCommands.js";

const validateAmount = (amount) => {
	if (amount <= 0 || amount > 100) return { valid: false, error: "The amount must be at least 1 and cannot exceed 100." };
	return { valid: true };
};

const multple = (amount, text) => {
	if (amount > 1) return `${text}s`;
	else return text;
};

const filterMessages = (messages, amount, options) => {
	let deleted = 0;
	const { target, search } = options;

	return messages.filter((msg) => {
		const matchesSearch = !search || msg.content.toLowerCase().includes(search.toLowerCase());

		const matchesTarget = !target || msg.author.id === target.id;
		const shouldDelete = !msg.pinned && matchesSearch && matchesTarget && deleted < amount;

		if (shouldDelete) deleted++;
		return shouldDelete;
	});
};

export const data = createSlashCommand({
	name: "purge",
	description: "Deletes a specified amount of messages",
	DefaultMemberPermissions: PermissionFlagsBits.Administrator,
	options: [
		{
			name: "amount",
			description: "Provide the amount of messages to be deleted",
			type: "number",
			minValue: 1,
			maxValue: 100,
			required: true,
		},
		{
			name: "reason",
			description: "Provide a reason for the purge",
			type: "string",
			required: true,
			autocomplete: true,
		},
		{
			name: "target",
			description: "Provide a user to delete messages from",
			type: "user",
			required: false,
		},
		{
			name: "channel",
			description: "Provide a channel to delete messages from",
			type: "channel",
			required: false,
			channelTypes: ChannelType.GuildText,
		},
		{
			name: "search",
			description: "Provide a search term to delete messages containing it",
			type: "string",
			autocomplete: true,
			required: false,
		},
	],
});

export const autocomplete = async (interaction) => {
	const { options } = interaction;

	const focused = options.getFocused(true);

	const choices = {
		reason: ["Spam", "Inappropriate Content", "Off-topic", "Other"],
		search: ["Popular Topics: Threads", "Sharding: Getting started", "Library: Voice Connections", "Interactions: Replying to slash commands", "Popular Topics: Embed preview"],
	};

	const filtered = choices[focused.name].filter((choice) => choice.toLowerCase().startsWith(focused.value.toLowerCase()));
	await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
};

export const execute = async (interaction) => {
	const { options } = interaction;
	const amount = options.getNumber("amount");
	const target = options.getMember("target");
	const targetChannel = options.getChannel("channel");
	const reason = options.getString("reason");
	const searchTerm = options.getString("search");

	const channel = targetChannel || interaction.channel;
	const messages = await channel.messages.fetch();

	await deferReply(interaction);
	await editReply(interaction, `Please wait purge in process`);

	await wait(2000);

	const { valid, error } = validateAmount(amount);
	if (!valid) return editReply(interaction, error);

	const filteredMessages = filterMessages(messages, amount, { target, search: searchTerm });

	await channel.bulkDelete(filteredMessages, true).then((deletedMessages) => {
		const TOT = multple(deletedMessages.size, "message");
		editReply(interaction, `Cleared ${deletedMessages.size} ${TOT}${target ? ` from ${target.user.tag}` : ""}`);
	});
};
