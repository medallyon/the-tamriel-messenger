const Discord = require("discord.js");

module.exports = function(member)
{
	if (process.env.DEVELOPERS && process.env.DEVELOPERS.split(" ").some(x => x === member.id))
		return 900;

	// a regular discord User
	if (!(member instanceof Discord.GuildMember))
		return 100;

	// owner or admin
	if (member.hasPermission("ADMINISTRATOR"))
		return 300;
	// moderator??
	if (member.hasPermission("BAN_MEMBERS"))
		return 200;

	// regular Member
	return 100;
};
