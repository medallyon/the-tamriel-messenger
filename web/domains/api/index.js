const fs = require("fs-extra")
	, hashID = new (require("hashids/cjs"))(process.env.DOMAIN_ROOT, 6)
	, router = require("express")();

router.post("/shorten", function(req, res)
{
	if (!req.body)
		return res.sendStatus(400);

	if (!req.body.link || (req.body.link && !req.body.link.length))
		return res.sendStatus(400);

	const urlPath = join(__basedir, "data", "admin", "shortLinks.json");
	fs.readJson(urlPath)
		.then(links =>
		{
			const existing = links[req.body.link];
			if (existing && existing.original.toLowerCase() === req.body.link.toLowerCase())
			{
				return res.json({
					status: 200,
					data: {
						url: `https://${process.env.DOMAIN_ROOT}/${short}`
					}
				});
			}

			const short = req.body.slug || hashID.encode(Math.floor(Math.random() * 100));
			links[short] = {
				created: (new Date()).toISOString(),
				user: req.user.id,
				original: req.body.link,
				short
			};

			fs.outputJson(urlPath, links)
				.then(() =>
				{
					res.json({
						status: 200,
						data: {
							url: `https://${process.env.DOMAIN_ROOT}/${short}`
						}
					});
				}).catch(err =>
				{
					console.error(err);
					res.sendStatus(500, err);
				});
		}).catch(err =>
		{
			console.error(err);
			res.sendStatus(500, err);
		});
});

module.exports = router;
