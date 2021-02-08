require("dotenv").config();

global.join = require("path").join;
global.__basedir = __dirname;
global.__clientdir = join(__dirname, "lib");
global.__webdir = join(__dirname, "web");

const Client = require("./lib/classes/DiscordClient.js");
let client = new Client();

client.login((process.env.NODE_ENV || "").toLowerCase() === "production" ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_DEV)
	.catch(console.error);

const web = require("./web");

const { GuildMember } = require("discord.js");
client.ws.on("INTERACTION_CREATE", async interaction =>
{
	let channel, member, target;
	try
	{
		channel = await client.channels.fetch(interaction.channel_id);
		member = new GuildMember(client, interaction.member, channel.guild);
		target = await channel.guild.members.fetch(interaction.data.options[0].value);
	}

	catch (err)
	{
		console.error(err);
	}

	try
	{
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "",
					embeds: [
						client.commands.whoIs.run({
							guild: channel.guild,
							member
						}, target || member).toJSON()
					]
				}
			}
		});
	}

	catch (err)
	{
		console.error(err);
	}
});

module.exports = { client, web };
