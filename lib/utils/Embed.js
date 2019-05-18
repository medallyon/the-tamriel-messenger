const { RichEmbed } = require("discord.js")
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"));

class Embed extends RichEmbed
{
    constructor(data)
    {
        super(data);

        this.setColor(client.utils.generateRandomColor());
        this.setFooter("Powered by Grogsile, Inc.", client.user.displayAvatarURL);
        this.setTimestamp(new Date());
    }
}

module.exports = Embed;
