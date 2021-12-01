module.exports = function(client)
{
	const commands = global.index(__dirname, 0)
		, out = {};

	for (const [ name, Command ] of Object.entries(commands))
		out[name] = new Command(client);

	return out;
};
