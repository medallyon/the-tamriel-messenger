const fs = require("fs-extra")
    , path = require("path")
    , client = require(path.join(process.cwd(), "client"))
    , Command = require(path.join(client.Client.__paths.classes, "Command.js"))
    , { Embed } = client.utils;

class pledges extends Command
{
    constructor()
    {
        super({
            name: "pledges",
            description: "Shows the current and upcoming pledges.",
            alias: [ "pledges", "pledge" ],
            usage: "[ Maj | Glirion | Urgarlag ]",
            permissions: 100
        });
    }

    run(msg)
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            let meta;
            fs.readJson(path.join(client.Client.__paths.persistence, "modules", "pledges", "metadata.json"))
                .then(function(dungeonMeta)
                {
                    meta = dungeonMeta;
                })
                .catch(console.error)
                .finally(function()
                {
                    client.api.get("/pledges").then(function(pledges)
                    {
                        if (msg.args && msg.args.length && ["maj", "gli", "urg"].some(x => msg.args[0].toLowerCase().includes(x)))
                            resolve(self.createIndividualPledgeEmbed(meta, msg.args[0].toLowerCase(), pledges));
                        else
                            resolve(self.createCurrentPledgesEmbed(meta, pledges));
                    }).catch(reject);
                });
        });
    }

    async createIndividualPledgeEmbed(meta, arg, pledges)
    {
        let embed = new Embed();

        let pledgeGiver;
        if (arg.toLowerCase().includes("maj"))
            pledgeGiver = "Maj al-Ragath";
        else if (arg.toLowerCase().includes("gli"))
            pledgeGiver = "Glirion the Redbeard";
        else
            pledgeGiver = "Urgarlag Chief-bane";

        let dungeon = meta[pledges[pledgeGiver][0]];

        embed.setAuthor(`${pledgeGiver}'s Pledge`)
            .setTitle(pledges[pledgeGiver][0]);

        if (dungeon)
            embed.setImage(dungeon.imageURL)
                .setURL(dungeon.url);

        embed.addField(`${pledgeGiver}'s upcoming pledges`, meta
            ? `*[${pledges[pledgeGiver][1]}](${meta[pledges[pledgeGiver][1]].url})*, *[${pledges[pledgeGiver][2]}](${meta[pledges[pledgeGiver][2]].url})*, *[${pledges[pledgeGiver][3]}](${meta[pledges[pledgeGiver][3]].url})*`
            : `*${pledges[pledgeGiver][1]}*, *${pledges[pledgeGiver][2]}*, *${pledges[pledgeGiver][3]}*`);

        return embed;
    }

    async createCurrentPledgesEmbed(meta, pledges)
    {
        let embed = new Embed().setAuthor("Today's Pledges", "https://images.uesp.net/8/81/ON-icon-achievement-A_Crown_of_Your_Own_Trousers.png", "https://en.uesp.net/wiki/Online:Undaunted#Pledges")
            .setDescription("The Undaunted Pledges are repeatable quests which become available at Level 45 from the Undaunted Enclave in your Alliance Capital, and task your group with clearing out a dungeon. It is possible to complete up to three pledges per character per day. [Maj al-Ragath](https://en.uesp.net/wiki/Online:Maj_al-Ragath), [Glirion the Redbeard](https://en.uesp.net/wiki/Online:Glirion_the_Redbeard) and [Urgarlag Chief-bane](https://en.uesp.net/wiki/Online:Urgarlag_Chief-bane) will each offer one pledge.");

        for (const p in pledges)
        {
            const dungeon = meta[pledges[p][0]];
            embed.addField(p, dungeon ? `[${dungeon.name}](${dungeon.url})` : pledges[p][0]);
        }

        embed.addBlankField();

        embed.addField("Upcoming Pledges", meta
            ? `*[${pledges["Maj al-Ragath"][1]}](${meta[pledges["Maj al-Ragath"][1]].url})*, *[${pledges["Glirion the Redbeard"][1]}](${meta[pledges["Glirion the Redbeard"][1]].url})*, *[${pledges["Urgarlag Chief-bane"][1]}](${meta[pledges["Urgarlag Chief-bane"][1]].url})*`
            : `*${pledges["Maj al-Ragath"][1]}*, *${pledges["Glirion the Redbeard"][1]}*, *${pledges["Urgarlag Chief-bane"][1]}*`);

        return embed;
    }
}

module.exports = pledges;
