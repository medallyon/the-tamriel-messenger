const determinePermissions = require(join(__dirname, "determinePermissions.js"));

module.exports = function(user)
{
	return determinePermissions(user) >= 900;
};
