const NewsManager = require(join("..", "NewsManager.js"))
	, NewsArticle = require(join(__libdir, "classes", "database", "models", "NewsArticle.js"));

class FrenchManager extends NewsManager
{
	constructor(db)
	{
		super(db, {
			name: "fr",
			path: "news/fr",
			Model: NewsArticle,
			onValue: {
				onlyOnce: true
			}
		});
	}
}

module.exports = FrenchManager;
