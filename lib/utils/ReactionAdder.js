class ReactionAdder
{
    static get numberEmojis()
    {
        return new Map([
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

    constructor(message, amount, customEmojiMap = ReactionAdder.numberEmojis)
    {
        this._stopped = false;
        this.message = message;

        if (amount instanceof Map)
        {
            this.emojis = amount;
            this.amount = this.emojis.size;
        }

        else
        {
            this.emojis = customEmojiMap;
            this.amount = amount;
        }
    }

    addReactions()
    {
        let self = this;
        return new Promise(async function(resolve, reject)
        {
            try
            {
                for (let i = 1; i <= self.amount; i++)
                {
                    if (self._stopped)
                        break;

                    await self.message.react(self.emojis.get(i));
                }

                if (self._stopped)
                {
                    let reactions = self.message.reactions.filter(r => Array.from(self.emojis.values()).includes(r.emoji.toString()));

                    if (reactions.size)
                    {
                        setTimeout(function()
                        {
                            for (const r of reactions.values())
                                r.remove().catch(console.error);
                        }, 1500);
                    }
                }

                resolve();
            }

            catch (err)
            {
                reject(err);
            }
        });
    }

    start()
    {
        return this.addReactions();
    }

    stop(removeReactions = false)
    {
        this._stopped = true;

        if (removeReactions)
            this.message.clearReactions().catch(console.error);
    }
}

module.exports = ReactionAdder;
