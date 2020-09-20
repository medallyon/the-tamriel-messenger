/*
 * Courtesy of https://stackoverflow.com/a/1484514/4672263
 */

function generateRandomColor()
{
	let letters = "0123456789ABCDEF"
		, color = "";

	for (let i = 0; i < 6; i++)
		color += letters[Math.floor(Math.random() * 16)];

	return color;
}

module.exports = generateRandomColor;
