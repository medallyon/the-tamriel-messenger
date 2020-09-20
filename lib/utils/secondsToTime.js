function pad(num, size)
{
	return ("000" + num).slice(size * -1);
}

// modified from https://gist.github.com/vankasteelj/74ab7793133f4b257ea3
function sec2time(timeInSeconds, withMS = false)
{
	let time = parseFloat(timeInSeconds).toFixed(3)
		, hours = Math.floor(time / 60 / 60)
		, minutes = Math.floor(time / 60) % 60
		, seconds = Math.floor(time - minutes * 60)
		, milliseconds = time.slice(-3);

	let timeString = "";
	if (hours)
		timeString += pad(hours, 2) + ":";
	timeString += pad(minutes, 2) + ":" + pad(seconds, 2);

	if (withMS)
		timeString += ":" + pad(milliseconds, 3);

	return timeString;
}

module.exports = sec2time;
