const firebase = require("firebase/app")
	, rt = require("firebase/database");

/**
 * @typedef {Object} FirebaseConfig
 * @property {string} apiKey
 * @property {string} authDomain
 * @property {string} projectId
 * @property {string} storageBucket
 * @property {string} appId
 * @property {string} messagingSenderId
 * @property {string} measurementId
 */

class Firebase
{
	/**
	 * A wrapper for `getDataBase()`.
	 */
	get db()
	{
		return rt.getDatabase();
	}

	/**
	 * @param {DiscordClient} client
	 * @param {FirebaseConfig} config
	 */
	constructor(client, config)
	{
		/**
		 * @type {DiscordClient}
		 */
		this.client = client;

		/**
		 * @type {FirebaseConfig}
		 */
		this.config = config;

		firebase.initializeApp(this.config);

		const managers = new (require(join(__dirname, "managers")))(this);
		for (const [ name, manager ] of Object.entries(managers))
		{
			if ([ "client", "config" ].some(x => x === name))
				throw new Error("DataManagers cannot be named 'client' or 'config'.");

			this[name] = manager;
		}
	}
}

module.exports = Firebase;
