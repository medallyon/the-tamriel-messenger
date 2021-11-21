const { Collection } = require("@discordjs/collection")
	, EventEmitter = require("events")
	, rt = require("firebase/database");

/**
 * @typedef {Object} GenericDataManagerConfig
 * @param {string} path - The path for this manager's data entries in the JSON database tree
 * @param {string} [name] - The name to use for reference in the managers object
 * @param {class} [Model] - Resolve any data objects into instances specified by this model class
 * @param {Object} [onValue] - Options passed through to the Firebase database onValue function
 */

class GenericDataManager extends EventEmitter
{
	/**
	 * @param {Firebase} firebase
	 * @param {GenericDataManagerConfig} config
	 */
	constructor(firebase, config)
	{
		super();

		this._ready = false;

		/**
		 * @type {Firebase}
		 */
		this.firebase = firebase;

		/**
		 * @type {GenericDataManagerConfig}
		 */
		this.config = config;

		/**
		 * @type {Collection}
		 */
		this.cache = new Collection();

		// wrapper on the scrummy onValue "event" that firebase provides. disgusting.
		rt.onValue(rt.ref(this.firebase.db, this.config.path), snapshot =>
		{
			const data = snapshot.val() || {};
			for (const [ key, val ] of Object.entries(data))
				this.cache.set(key, this.config.Model ? new this.config.Model(val) : val);

			this.emit("ready", this.cache.filter(x => data[x.id]));
		}, {
			onlyOnce: this.config.onValue?.onlyOnce || false
		});
	}

	/**
	 * Retrieve the data with the specified ID.
	 * @param {string|number} id
	 * @type {Promise<Model>}
	 */
	get(id)
	{
		if (this.cache.has(id))
			return Promise.resolve(this.cache.get(id));

		return new Promise((resolve, reject) =>
		{
			const ref = rt.ref(this.firebase.db);
			rt.get(rt.child(ref, `${this.config.path}/${id}`))
				.then(snapshot =>
				{
					if (snapshot.exists())
						resolve(undefined);

					let data = snapshot.val();
					if (this.config.Model && !(data instanceof this.config.Model))
						data = new this.config.Model(data);

					resolve(data);
				}).catch(reject);
		});
	}

	_prepareDataForUpdate(...data)
	{
		data = data.filter(inst => inst.id != null);

		const updates = {};
		for (const inst of data)
		{
			this.cache.set(inst.id, this.config.Model ? new this.config.Model(inst) : inst);
			updates[`${this.config.path}/${inst.id}`] = inst instanceof this.config.Model ? inst.toJSON() : inst;
		}

		return updates;
	}

	_update(updates)
	{
		for (const update of Object.values(updates).filter(x => x != null))
			this.emit("value", update);

		return rt.update(rt.ref(this.firebase.db), updates);
	}

	/**
	 * Update the given data.
	 * @param {Array<Object>} data
	 * @return {Promise}
	 */
	update(...data)
	{
		const updates = this._prepareDataForUpdate(...data);
		return this._update(updates);
	}
	add(...data) { return this.update(...data); }

	/**
	 * Delete the data with the specified IDs.
	 * 
	 * @param {...string|...Model} ids
	 * @return {Promise}
	 */
	delete(...ids)
	{
		ids = ids.map(id => id instanceof this.config.Model ? id.id : id).filter(id => (typeof id) === "string");

		const updates = {};
		for (const id of ids)
		{
			this.cache.delete(id);
			updates[`${this.config.path}/${id}`] = null;
		}

		return this._update(updates);
	}
}

module.exports = GenericDataManager;
