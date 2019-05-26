const Discord = require("discord.js")
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"));

class SelectorEmbed
{
    constructor(initMsg, items, customMsg = null, customEmbed = null)
    {
        this.initMsg = initMsg;
        this.initiator = initMsg.author;
        this.channel = initMsg.channel;
        this.items = items;

        this.customMsg = customMsg;
        this.embed = (customMsg) ? null : customEmbed || new Discord.MessageEmbed();

        if (customMsg instanceof Discord.RichEmbed)
        {
            this.customMsg = null;
            this.embed = customMsg;
        }
    }

    _generateEmbed()
    {
        for (let i = 0; i < this.items.length; i++)
            this.embed.addField(`${client.utils.ReactionAdder.numberEmojis.get(i + 1)} ${this.items[i].name}`, this.items[i].value);

        this.embed.addField("\u200b", "**Select one of these emojis:**");

        return this.embed;
    }

    _createMessage()
    {
        if (this.customMsg)
            return Promise.resolve(this.customMsg);

        return this.channel.send(this.embed);
    }

    await()
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            if (!self.customMsg)
                self._generateEmbed();

            self._createMessage()
                .then(function(msg)
                {
                    let reactionAdder = new client.utils.ReactionAdder(msg, self.items.length);
                    reactionAdder.addReactions();

                    const emojiArray = Array.from(client.utils.ReactionAdder.numberEmojis.values());
                    const filter = function(r, u)
                    {
                        return emojiArray.includes(r.emoji.toString())
                            && emojiArray.indexOf(r.emoji.toString()) < self.items.length
                            && u.id === self.initiator.id;
                    };

                    msg.awaitReactions(filter, { max: 1, time: 1000 * 60, errors: [ "time" ] })
                        .then(function(collected)
                        {
                            resolve([ emojiArray.indexOf(collected.first().emoji.toString()), msg ]);
                        })
                        .catch(function()
                        {
                            self.embed.fields = self.embed.fields.slice(0, self.embed.fields.length - 1);
                            msg.edit(self.embed).catch(console.error);
                            msg.clearReactions().catch(console.error);

                            resolve();
                        })
                        .finally(reactionAdder.stop.bind(reactionAdder));
                })
                .catch(reject);
        });
    }
}

module.exports = SelectorEmbed;
