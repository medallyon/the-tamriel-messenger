const Discord = require("discord.js")
    , Embed = require("./Embed.js");

class ReactionAdder
{
    static get numberEmojis()
    {
        return new Discord.Collection([
            [ 1, "1⃣" ],
            [ 2, "2⃣" ],
            [ 3, "3⃣" ],
            [ 4, "4⃣" ],
            [ 5, "5⃣" ],
            [ 6, "6⃣" ],
            [ 7, "7⃣" ],
            [ 8, "8⃣" ],
            [ 9, "9⃣" ],
            [ 10, "🔟" ]
        ]);
    }

    constructor(message, from, to)
    {
        this.stopped = false;

        this.message = message;
        this.from = from;
        this.to = to;

        this.addReactions();
    }

    addReactions()
    {
        let self = this;

        if (!this.stopped)
        {
            this.message.react(ReactionAdder.numberEmojis.get(this.from + 1))
                .then(function()
                {
                    if (++self.from <= self.to)
                        self.addReactions();
                })
                .catch(function(err)
                {
                    console.error(err);
                    if (++self.from <= self.to)
                        self.addReactions();
                });
        }
    }

    stop()
    {
        this.stopped = true;
    }
}

// resolves an ambiguous numberEmoji to a number
function resolveEmoji(emoji)
{
    if (emoji instanceof Discord.MessageReaction) emoji = emoji.emoji.toString();
    for (const e of ReactionAdder.numberEmojis.entries())
    {
        if (e[1] === emoji)
            return e[0];
    }
}

function awaitUserReactionFor(msg, embed, amount)
{
    return new Promise(function(resolve, reject)
    {
        msg.channel.send({ embed })
            .then(function(message)
            {
                let reactingClass = new ReactionAdder(message, 0, amount - 1);

                embed = message.embeds[0];
                embed.fields.pop();

                const reactionFilter = (r, u) => (u.id === msg.author.id && ReactionAdder.numberEmojis.some(e => e === r.emoji.toString()));

                message.awaitReactions(reactionFilter, { max: 1, time: 1000 * 60, errors: [ "time" ] })
                    .then(function(reactions)
                    {
                        reactingClass.stop();
                        resolve([ resolveEmoji(reactions.first()), message ]);

                        setTimeout(function()
                        {
                            message.reactions.removeAll().catch(console.error);
                        }, 1000 * 3);
                    }).catch(function(collection, reason)
                    {
                        setTimeout(function()
                        {
                            message.edit({ embed }).catch(console.error);
                            message.reactions.removeAll().catch(console.error);
                        }, 1000 * 3);
                        reject([ reason, message ]);
                    });
            }).catch(reject);
    });
}

function curateFieldValue(value, length = 120)
{
    if (value.length === 0)
        value = "\u200b";
    else if (value.length > length)
        value = value.slice(0, length) + "...";

    return value;
}

function createSelectorEmbed(msg, items, options = {}, callback = null)
{
    let data = [], embed;
    if (options)
    {
        if (options instanceof Discord.MessageEmbed)
            embed = options;
        else if (Array.isArray(options))
            data = options;
        else
        {
            for (let x in options)
                data.push([ x, options[x] ]);
        }

        if (!embed)
            embed = new Discord.MessageEmbed(data);
    }

    else
        embed = new Embed().setAuthor("Item Selector", msg.author.displayAvatarURL());

    if (items.length > 10)
        items = items.slice(0, 10);

    for (let i = 0; i < items.length; i++)
        embed.addField(`${i+1}. ${items[i].name}`, curateFieldValue(items[i].value, options.fieldValueLength), items[i].inline || true);

    if (callback && (typeof callback) === "function")
        embed = callback(embed);

    embed.addField("\u200b", "**Please react with one of the following emoji to select the relative item.**", false);

    return awaitUserReactionFor(msg, embed, items.length);
}

module.exports = createSelectorEmbed;
