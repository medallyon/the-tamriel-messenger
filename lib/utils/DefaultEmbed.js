const { MessageEmbed } = require("discord.js")
	, generateRandomColor = require("./generateRandomColor.js");

/**
 * A Discord Embed filled with some pre-defined data.
 */
class DefaultEmbed extends MessageEmbed
{
	constructor(data)
	{
		super(data);

		if (!this.timestamp)
			this.setTimestamp(new Date());

		if (!this.color || (this.color && this.color.toString().length))
			this.setColor(generateRandomColor());

		if (!this.footer)
			this.setFooter("Provided by ESO International", "https://cdn.discordapp.com/icons/130716876937494528/a_3c5a1d29cf01af9ba2ee59c7a8e96c7c.gif?size=256");
	}
}

module.exports = DefaultEmbed;
