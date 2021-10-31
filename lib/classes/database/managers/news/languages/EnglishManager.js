const NewsManager = require(join("..", "NewsManager.js"))
	, NewsArticle = require(join(__libdir, "classes", "database", "models", "NewsArticle.js"));

class EnglishManager extends NewsManager
{
	constructor(db)
	{
		super(db, {
			name: "en-us",
			path: "news/en-us",
			Model: NewsArticle,
			onValue: {
				onlyOnce: true
			}
		});
	}
}

module.exports = EnglishManager;
