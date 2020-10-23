module.exports = function(req, res, next)
{
	if (!(req.isAuthenticated() && req.user))
		return res.redirect("/admin/login");

	if (!req.content)
		req.content = {};
	req.content.user = req.user;

	next();
};
