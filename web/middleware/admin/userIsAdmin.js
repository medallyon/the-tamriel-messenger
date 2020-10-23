module.exports = function(req, res, next)
{
	const { client } = require(__basedir, "index.js")
		, guild = client.guilds.cache.get("130716876937494528")
		, guards = guild.members.cache.filter(x => x.roles.cache.has("598409804465045534"));

	if (!guards.has(req.user.id))
		return res.sendStatus(403);

	next();
};
