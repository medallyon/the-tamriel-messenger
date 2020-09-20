const join = require("path").join
	, fs = require("fs");

let modules = {}
	, files = fs.readdirSync(__dirname);

for (const file of files)
{
	if (file === "index.js")
		continue;

	const filePath = join(__dirname, file);
	modules[file.replace(".js", "")] = require(filePath);
}

module.exports = modules;
