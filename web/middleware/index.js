const fs = require("fs")
	, join = require("path").join;

const middleware = {}
	, folders = fs.readdirSync(__dirname);
for (const folder of folders.filter(x => !x.endsWith(".js")))
{
	middleware[folder] = {};

	const files = fs.readdirSync(join(__dirname, folder));
	for (const file of files)
		middleware[folder][file.replace(".js", "")] = require(join(__dirname, folder, file));
}

for (const script of folders.filter(x => x.endsWith(".js")))
	middleware[script.replace(".js", "")] = require(join(__dirname, script));

module.exports = middleware;
