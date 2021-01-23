const fs = require("fs-extra")
	, express = require("express")
	, router = express();

router.get("/", function(req, res)
{
	res.sendStatus(200);
});

router.use(express.static(join(__dirname, "content")));

const domainDir = join(__webdir, "domains")
	, dirs = fs.readdirSync(domainDir);

for (const domain of dirs)
{
	const domainPath = join(domainDir, domain);
	if (!fs.statSync(domainPath).isDirectory())
		continue;

	if (fs.readdirSync(domainPath).indexOf("i") > -1 && fs.statSync(join(domainPath, "i")).isDirectory())
		router.use(`/${domain}`, express.static(join(domainPath, "i")));
}

module.exports = router;
