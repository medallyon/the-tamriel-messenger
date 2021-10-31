global.join = require("path").join;
global.__basedir = __dirname;
global.__libdir = join(__dirname, "lib");
global.__webdir = join(__dirname, "web");
global.__datadir = join(__dirname, "data");

/**
 * Synchronously iterate through modules in a directory and require them
 * @param {String} dir The target module directory
 * @param {Number} [recursive=Infinity] The depth of the index, recurse into directories
 * @param {DiscordClient} [client=null] An optional Discord client to pass into classes
 * @return {Object} An object of the aggregated modules
 */
global.index = function(dir, recursive = Infinity, client = null)
{
	const fs = require("fs")
		, files = fs.readdirSync(dir)
		, modules = {};

	if (recursive instanceof require("discord.js").Client)
	{
		client = recursive;
		recursive = Infinity;
	}

	for (const file of files)
	{
		if (file === "index.js")
			continue;

		const filePath = join(dir, file)
			, stat = fs.statSync(filePath);

		if (stat.isDirectory())
		{
			// 'recursive' here stands for the the amount of dirs we should travel and is controlled by decreasing with every directory call
			if (recursive === 0)
				continue;

			modules[file] = global.index(filePath, recursive - 1, client);
			continue;
		}

		if (client != null)
			modules[file.replace(".js", "")] = new (require(filePath))(client);
		else
			modules[file.replace(".js", "")] = require(filePath);
	}

	return modules;
};

/**
 * Returns a title case representation of the object.
 *
 * @return {String} Title case representation of the object.
 */
String.prototype.toTitleCase = function()
{
	return this.replace(
		/\w\S*/g,
		txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	);
};


/**
 * Get the first element of this array.
 * @return {*}
 */
Array.prototype.first = function()
{
	return this[0];
};

/**
 * Get the last element of this array.
 * @return {*}
 */
Array.prototype.last = function()
{
	return this[this.length - 1];
};

/**
 * Get a pseudo-random element. See https://v8.dev/blog/math-random
 * @return {*}
 */
Array.prototype.random = function()
{
	return this[Math.floor(Math.random() * this.length)];
};

/**
 * Shuffle the array. This does not mutate the original array.
 * @return {Array} The shuffled array copy.
 */
Array.prototype.shuffle = function()
{
	let copy = Array.assign([], this);

	// https://stackoverflow.com/a/12646864
	for (let i = copy.length - 1; i > 0; i--)
	{
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}

	return copy;
};
