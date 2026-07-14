import { MessageFlags } from "discord.js";

export const deferReply = async (interaction) =>
	await interaction.deferReply({
		flags: MessageFlags.Ephemeral,
	});

export const editReply = async (interaction, content) =>
    await interaction.editReply({
        content: content,
        flags: MessageFlags.Ephemeral,
    });

export const sendFollowUp = async (interaction, content) =>
    await interaction.followUp({
        content: content,
        flags: MessageFlags.Ephemeral,
    });

export const sendReply = async (interaction, content) =>
    await interaction.reply({
        content: content,
        flags: MessageFlags.Ephemeral,
    });