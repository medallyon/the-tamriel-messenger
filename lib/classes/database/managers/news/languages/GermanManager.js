const NewsManager = require(join("..", "NewsManager.js"))
	, NewsArticle = require(join(__libdir, "classes", "database", "models", "NewsArticle.js"));

class GermanManager extends NewsManager
{
	constructor(db)
	{
		super(db, {
			name: "de",
			path: "news/de",
			Model: NewsArticle,
			onValue: {
				onlyOnce: true
			}
		});
	}
}

module.exports = GermanManager;
