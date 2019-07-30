const join = require("path").join
    , inspect = require("util").inspect
    , client = require(join(process.cwd(), "client"))
    , Command = require(join(client.Client.__paths.classes, "Command.js"))
    , { Embed } = client.utils;

class evaluate extends Command
{
    constructor()
    {
        super({
            name: "evaluate",
            description: "Evaluates a JavaScript expression.",
            alias: [ "evaluate", "eval" ],
            usage: "1 + 1",
            permissions: 900
        });

        this.timeout = 1000 * 30;
    }

    run(msg)
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            let startTS = new Date();

            if (!msg.args.length)
                return resolve(self.createEvaluationEmbed(msg, "null", true, startTS));

            let processingEmbed = new Embed()
                .setImage("https://media.giphy.com/media/3o6gEcq23vwRCFvjHO/giphy.gif")
                .setFooter("Processing...", msg.author.displayAvatarURL, startTS);

            msg.channel.send(processingEmbed).then(async function(processingMsg)
            {
                let embed;
                try
                {
                    let evaluated = eval(msg.args.join(" "));

                    // create a race between Promises, one of which serves as a timeout for the other Promise
                    if (evaluated instanceof Promise)
                        evaluated = await Promise.race([
                            evaluated,
                            new Promise(function(resolve, reject)
                            {
                                setTimeout(function()
                                {
                                    reject(new Error("Your promise took too long to resolve."));
                                }, self.timeout);
                            })
                        ]);

                    embed = self.createEvaluationEmbed(msg, evaluated, true, startTS);
                }

                catch (error)
                {
                    embed = self.createEvaluationEmbed(msg, error.toString(), false, startTS);
                }

                processingMsg.edit(embed)
                    .then(resolve)
                    .catch(reject);
            }).catch(reject);
        });
    }

    createEvaluationEmbed(msg, res, successful = undefined, ts = new Date())
    {
        let embed = new Embed()
            .setColor((successful) ? "5CB85C" : "D9534F")
            .setAuthor(((successful) ? "Successful" : "Unsuccessful") + " Evaluation", msg.author.displayAvatarURL)
            .setDescription(`In response to ${msg.author.toString()}.`)
            .addField("Supplied Script", `\`\`\`js\n${msg.args.join(" ") || "null"}\`\`\``)
            .addField("Outcome", `\`\`\`js\n${(typeof res === "object") ? inspect(res).slice(0, 1000) + "..." : res}\`\`\``)
            .setFooter(`This evaluation took ${client.utils.formatTime(Math.abs(new Date() - ts))}`, client.user.displayAvatarURL, ts);

        if (successful === undefined)
            embed.setColor("5BC0DE")
                .setAuthor("Uncertain Evaluation");

        return embed;
    }
}

module.exports = evaluate;
