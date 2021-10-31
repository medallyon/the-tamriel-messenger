const { AbstractError } = require(join(__libdir, "classes", "errors"));

class Model
{
	get id()
	{
		return this._id;
	}
	set id(val)
	{
		this._id = val;
	}

	/**
	 * @param {string|number} id
	 * @param {Model|Object} [data={}]
	 */
	constructor(id, data = {})
	{
		if (new.target === Model)
			throw new AbstractError();

		this._id = id;
		this._data = data;

		this._data.id = this.id;
	}

	/**
	 * Returns a JSON-compatible representation of the object.
	 * @return {Object} JSON-compatible representation of the object.
	 */
	toJSON()
	{
		return this._data;
	}
}

module.exports = Model;
