class AbstractError extends TypeError
{
	constructor(message, options, fileName, lineNumber)
	{
		super(message || `${new.target.toString()} is abstract. You may not instantiate abstract classes directly.`, options, fileName, lineNumber);
	}
}

module.exports = AbstractError;
