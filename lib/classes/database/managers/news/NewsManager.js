const GenericDataManager = require(join(__libdir, "classes", "database", "GenericDataManager.js"))
	, NewsArticle = require(join(__libdir, "classes", "database", "models", "NewsArticle.js"));

class NewsManager extends GenericDataManager
{
	constructor(db, config)
	{
		super(db, Object.assign({
			name: "news",
			path: "news",
			Model: NewsArticle,
			onValue: {
				onlyOnce: true
			}
		}, config));

		this.cacheLimit = 5;
	}

	// prune old articles and update new articles
	update(...articles)
	{
		const updates = super._prepareDataForUpdate(...articles);

		if (this.cache.size > this.cacheLimit)
		{
			const amountToPrune = this.cache.size - this.cacheLimit
				, toPrune = Array.from(this.cache.values())
					.sort((a, b) => a.date - b.date)
					.slice(0, amountToPrune);

			for (const item of toPrune)
			{
				updates[`${this.config.path}/${item.id}`] = null;
				this.cache.delete(item.id);
			}
		}

		return super._update(updates);
	}
}

module.exports = NewsManager;
