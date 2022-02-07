const router = require("express").Router()
	, fs = require("fs-extra");

// eslint-disable-next-line no-useless-escape
router.use("/:shortLinkID([a-zA-Z0-9\._-]+)", function(req, res, next)
{
	const urlPath = join(__datadir, "admin", "shortLinks.json");
	fs.readJson(urlPath)
		.then(urls =>
		{
			const actual = urls[req.params.shortLinkID];
			if (!actual)
				return next();

			res.redirect(actual.original);
		}).catch(err =>
		{
			console.error(err);
			res.sendStatus(500, err);
		});
});

module.exports = router;
