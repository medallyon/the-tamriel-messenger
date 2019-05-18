const getMemberPermissions = require("./getMemberPermissions.js");

function hasPermission(member, command)
{
    if (!member || !command)
        return false;

    if (getMemberPermissions(member) >= command.permissions)
        return true;

    return false;
}

module.exports = hasPermission;
