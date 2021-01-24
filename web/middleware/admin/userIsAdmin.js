module.exports = async function(req, res, next)
{
	const { client } = require(__basedir, "index.js");

	const guild = await client.guilds.fetch("130716876937494528")
		, guards = guild.members.cache.filter(x => x.roles.cache.has("598409804465045534"));

	if (!guards.has(req.user.id))
		return res.sendStatus(403);

	next();
};
