const express = require("express")
	, bodyParser = require("body-parser")
	, cookieParser = require("cookie-parser")
	, vhost = require("vhost");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// configure CORS (https://enable-cors.org/server_expressjs.html)
app.use(function(req, res, next)
{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// load all domains and their respective router
const domains = require(join(__dirname, "domains"));
for (const d in domains)
{
	if (d === "root")
		continue;

	// configure each router
	const router = domains[d];
	router.set("views", join(__webdir, "routes", d, "views"));
	router.set("view engine", "ejs");

	if (process.env.NODE_ENV === "production")
		app.use(vhost(`${d}.${process.env.DOMAIN_ROOT}`, router));
	else
		app.use(`/${d}`, router);
}
app.use("/", domains.root);

// catch 404
app.use(function(req, res)
{
	res.sendStatus(404);
});

app.listen(process.env.PORT, function()
{
	console.log(`App started and listening on: ${process.env.PORT}, using ${Object.keys(domains).length} routers:\n${Object.keys(domains).join(", ")}`);
});

module.exports = app;
