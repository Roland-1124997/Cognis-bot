import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";

const atributes = {
	name: (opt, value) => opt.setName(value),
	description: (opt, value) => opt.setDescription(value),
	required: (opt, value) => opt.setRequired(value),
	autocomplete: (opt, value) => opt.setAutocomplete(value),
	choices: (opt, value) => {
		if (value && value.length > 0) {
			opt.addChoices(...value.map((choice) => ({ name: choice.name, value: choice.value })));
			opt.setAutocomplete(false);
		}
	},
	minValue: (opt, value) => opt.setMinValue(value),
	maxValue: (opt, value) => opt.setMaxValue(value),
	channelTypes: (opt, value) => {
		if (value && value.length > 0) opt.addChannelTypes(...(value || ChannelType.GuildText));
	},
};

const builders = {
	string: (builder, option) => builder.addStringOption((opt) => createOptionAtributes(opt, option)),
	number: (builder, option) => builder.addNumberOption((opt) => createOptionAtributes(opt, option)),
	user: (builder, option) => builder.addUserOption((opt) => createOptionAtributes(opt, option)),
	channel: (builder, option) => builder.addChannelOption((opt) => createOptionAtributes(opt, option)),
	role: (builder, option) => builder.addRoleOption((opt) => createOptionAtributes(opt, option)),
	boolean: (builder, option) => builder.addBooleanOption((opt) => createOptionAtributes(opt, option)),
};

const createOptionAtributes = (opt, option) => {
	Object.entries(option).forEach(([key, value]) => {
		if(key !== "type") atributes[key](opt, value);
	});

	return opt;
};

export const createSlashCommand = ({ name, description, DefaultMemberPermissions = PermissionFlagsBits.DefaultMemberPermissions, options = null }) => {
	const builder = new SlashCommandBuilder();
	builder.setName(name);
	builder.setDescription(description);
	builder.setDefaultMemberPermissions(DefaultMemberPermissions);
	builder.setDMPermission(false);
	builder.setIntegrationTypes(0);

	if (options) options.forEach((option) => builders[option.type](builder, option));
	
	return builder;
};
