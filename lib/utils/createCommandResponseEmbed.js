const Discord = require("discord.js")
    , Embed = require("./Embed.js");

function createCommandResponseEmbed(type, details, msg)
{
    const embed = new Embed()
        .setFooter(`In response to ${msg.author.tag}`, msg.author.displayAvatarURL);

    if (type === "success")
    {
        embed.setColor("5CB85C")
            .setAuthor("Success!")
            .setDescription(details);
    }

    else if (type === "error")
    {
        embed.setColor("D9534F")
            .setAuthor("Something happened.")
            .setDescription(details)
            .addField("What to do now?", "Try again with different parameters.");

        if (details instanceof Error)
            embed.addField("Stack Trace for Devs", "```js\n" + details.stack + "```\nIf this keeps happening, contact a developer on the [Grogsile Inc. Dev Hub](https://discord.gg/eKSPgvF).");
    }

    return embed;
}

module.exports = createCommandResponseEmbed;
