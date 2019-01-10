const getMemberPermissions = require("./getMemberPermissions.js");

function hasPermission(member, command)
{
    if (!member || !command)
        return false;

    if (getMemberPermissions(member) >= command.meta.permissions)
        return true;

    return false;
}

module.exports = hasPermission;
