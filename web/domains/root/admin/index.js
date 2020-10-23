const express = require("express")
	, session = require("express-session")
	, FileStore = require("session-file-store")(session)
	, passport = require("passport")
	, DiscordStrategy = require("passport-discord").Strategy
	, middle = require(join(__webdir, "middleware"))
	, router = express.Router();

router.use(session({
	resave: true,
	saveUninitialized: false,
	secret: process.env.DOMAIN_ROOT,
	store: new FileStore({
		path: join(__basedir, "data", "sessions"),
		secret: process.env.DOMAIN_ROOT
	})
}));

/* PASSPORT */

passport.serializeUser(function(user, done)
{
	done(null, user);
});
passport.deserializeUser(function(obj, done)
{
	done(null, obj);
});

passport.use(new DiscordStrategy({
	clientID: process.env.PASSPORT_DISCORD_ID,
	clientSecret: process.env.PASSPORT_DISCORD_SECRET,
	callbackURL: `https://${process.env.DOMAIN_ROOT}/admin/oauth2/redirect`,
	scope: [ "identify" ]
},
function(accessToken, refreshToken, profile, cb)
{
	cb(null, profile);
}));

router.use(passport.initialize());
router.use(passport.session());

router.get("/login_actual", passport.authenticate("discord"));
router.get("/oauth2/redirect", passport.authenticate("discord", {
	successRedirect: "/admin/dashboard",
	failureRedirect: "/admin"
}), function(req, res)
{
	res.redirect("/admin/dashboard");
});

/* ROUTER SETUP */

router.use(function(req, res, next)
{
	require("ejs").clearCache();
	next();
});

router.get("/", function(req, res)
{
	if (req.isAuthenticated() && req.user)
		return res.redirect("/admin/dashboard");
	res.render("admin");
});

router.get("/login", function(req, res)
{
	if (req.isAuthenticated() && req.user)
		return res.redirect("/admin");
	res.redirect("/admin/login_actual");
});

router.get("/logout", function(req, res)
{
	if (req.isAuthenticated())
		req.logout();
	res.redirect("/admin");
});

router.get("/dashboard", middle.isAuthorised, middle.admin.userIsAdmin, function(req, res)
{
	res.render("admin/dashboard", req.content || {});
});

const fs = require("fs-extra")
	, hashID = new (require("hashids/cjs"))(process.env.DOMAIN_ROOT, 6);

router.post("/shorten", middle.isAuthorised, middle.admin.userIsAdmin, function(req, res)
{
	if (!req.body)
		return res.sendStatus(400);

	if (!req.body.link || (req.body.link && !req.body.link.length))
		return res.sendStatus(400);

	const urlPath = join(__basedir, "data", "admin", "shortLinks.json");
	fs.readJson(urlPath)
		.then(links =>
		{
			const existing = Object.values(links).find(x => x.original === req.body.link);
			if (!req.body.slug && existing)
			{
				const short = existing.short;
				return res.json({
					status: 200,
					data: {
						url: `https://${process.env.DOMAIN_ROOT}/${short}`
					}
				});
			}

			const short = (req.body.slug && req.body.slug.replace(/ /g, "-")) || hashID.encode(Math.floor(Math.random() * 100));
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
