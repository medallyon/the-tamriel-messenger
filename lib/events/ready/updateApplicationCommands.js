const { SlashCommand } = require("@medallyon/djs-framework");

async function updateApplicationCommands()
{
	await SlashCommand.updateInteractions();
}

module.exports = updateApplicationCommands;
