const EventEmitter = require("events");

class NewsManagerWrapper extends EventEmitter
{
	/**
	 * @param {Firebase} db
	 */
	constructor(db)
	{
		super();

		this.config = { name: "news" };

		/**
		 * @type {Array<NewsManager>}
		 */
		this.languages = Array.from(Object.values(new (require(join(__dirname, "news", "languages")))(db)));

		let readyCount = 0;
		for (const manager of this.languages)
		{
			this[manager.config.name] = manager;
			
			manager.once("ready", () =>
			{
				if (++readyCount === this.languages.length)
					this.emit("ready");
			});

			manager.on("value", article =>
			{
				this.emit("value", article);
			});
		}
	}
}

module.exports = NewsManagerWrapper;
