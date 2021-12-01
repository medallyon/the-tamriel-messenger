const { DiscordCommand } = require("@medallyon/djs-framework");

async function updateApplicationCommands()
{
	await DiscordCommand.updateInteractions();
}

module.exports = updateApplicationCommands;
