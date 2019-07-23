const fs = require("fs")
    , { join, sep } = require("path");

const out = {}
    , exclude = [ __filename.split(sep).pop() ];

for (const file of fs.readdirSync(__dirname))
{
    // skip files if contained in `exclude` list
    if (exclude.some(f => f.toLowerCase() === file.toLowerCase()))
        continue;

    const fileName = file.replace(".js", "")
        , job = require(join(__dirname, file));

    out[fileName] = job;

    console.log("Loaded CronJob", fileName);
}

module.exports = out;
