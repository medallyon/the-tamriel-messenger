const { GuildMember, Constants } = require("discord.js")
	, { SlashCommand } = require("@medallyon/djs-framework")
	, moment = require("moment");

moment.updateLocale("en", {
	calendar: {
		sameElse: "DD MMMM YYYY"
	}
});

class WhoIs extends SlashCommand
{
	/**
	 * @param {DiscordClient} client
	 */
	constructor(client)
	{
		super(client, {
			name: "whois",
			description: "Find out more about a user.",
			example: "user:Medallyon",
			interaction: {
				options: [
					{
						type: Constants.ApplicationCommandOptionTypes.USER,
						name: "user",
						description: "The user in question.",
						required: true
					}
				]
			}
		});
	}

	buildEmbed(member)
	{
		const color = {
				"online": "#43b581",
				"idle": "#faa61a",
				"dnd": "#f04747",
				"offline": "#747f8d"
			}[member.presence?.status]
			, embed = new this.client.utils.DefaultEmbed()
				.setColor(color)
				.setAuthor(member.tag || member.user.tag, (member.user || member).displayAvatarURL({ dynamic: true }))
				.setImage((member.user || member).displayAvatarURL({
					dynamic: true,
					size: 128
				}));

		if (member instanceof GuildMember)
		{
			const roles = member.roles;
			embed.setDescription(`**${member.toString()}** has been part of this server since ${moment(member.joinedAt).format("MMMM YYYY")}.`)
				.addField("Highest Role", roles.highest.toString(), true);

			if (roles.color && roles.color !== roles.highest)
				embed.addField("Color Role", member.roles.color.toString(), true);

			embed.addField("# of Roles", roles.cache.size.toString(), true)
				.addField("\u200b", "\u200b", true)
				.addField("Joined Server", moment(member.joinedAt).calendar(), true);
		}

		embed.addField("Account Created", moment(member.createdAt || member.user.createdAt).calendar(), member instanceof GuildMember);

		return embed;
	}

	/**
	 * @param {CommandInteraction} interaction
	 */
	async run(interaction)
	{
		let member = interaction.options.getUser("user");

		if (interaction.inGuild())
		{
			try
			{
				const guild = await this.client.guilds.fetch(interaction.guildId);
				member = guild.members.resolve(member);
			}

			catch (e)
			{
				console.warn(`Attempted to fetch Guild [id:${interaction.guildId}] and failed: ${e.message}`);
			}
		}

		interaction.reply({ embeds: [this.buildEmbed(member)] })
			.catch(console.error);
	}
}

module.exports = WhoIs;
