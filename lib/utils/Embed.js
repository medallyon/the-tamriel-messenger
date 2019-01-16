const { MessageEmbed } = require("discord.js")
    , client = require("../../client");

class Embed extends MessageEmbed
{
    constructor(data)
    {
        super(data);

        this.setColor(client.utils.generateRandomColor());
        this.setFooter("Powered by Grogsile, Inc.", client.user.avatarURL());
        this.setTimestamp(new Date());
    }
}

module.exports = Embed;
