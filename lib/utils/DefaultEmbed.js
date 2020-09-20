const Discord = require("discord.js")
	, generateRandomColor = require("./generateRandomColor.js");

module.exports = class DefaultEmbed extends Discord.MessageEmbed
{
	constructor(data)
	{
		super(data);

		if (!this.timestamp)
			this.setTimestamp(new Date());

		if (!this.color || (this.color && this.color.toString().length))
			this.setColor(generateRandomColor());

		if (!this.footer)
			this.setFooter("Made by @Medallyon#5012", "https://i.imgur.com/hcP7p2r.png");
	}
};
