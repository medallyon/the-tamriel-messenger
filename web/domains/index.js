const fs = require("fs");

let routers = {};
for (const domain of fs.readdirSync(__dirname).filter(x => x !== "index.js"))
	routers[domain] = require(join(__dirname, domain, "index.js"));

module.exports = routers;
