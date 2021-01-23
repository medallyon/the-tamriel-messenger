const router = require("express")()
	, fs = require("fs-extra");

// views settings are set independently for this specific router
router.set("views", join(__dirname, "views"));
router.set("view engine", "ejs");

router.get("/discord", function(req, res)
{
	res.redirect("https://discord.gg/esoi");
});

router.get("/", (req, res) =>
{
	res.redirect("/home");
});

router.use("/admin", require(join(__dirname, "admin")));

// eslint-disable-next-line no-useless-escape
router.use("/:shortLinkID([a-zA-Z0-9\._-]+)", function(req, res, next)
{
	const urlPath = join(__basedir, "data", "admin", "shortLinks.json");
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
