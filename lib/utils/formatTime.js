const path = require("path")
    , client = require(path.join(process.cwd(), "client"));

function formatTime(milliseconds)
{
    if (milliseconds < 1000)
        return `${client.utils.numberWithCommas(milliseconds)}ms`;

    if (milliseconds < 1000 * 60 * 60)
        return `${(milliseconds / 60 / 60).toFixed(3)}s`;

    if (milliseconds < 1000 * 60 * 60 * 60)
        return `${(milliseconds / 60 / 60 / 60).toFixed(2)}hrs`;
}

module.exports = formatTime;
