class EventMiddleware
{
	constructor(client)
	{
		this.client = client;
	}

	trigger()
	{
		throw new Error("NotImplementedError: The 'trigger' method must be implemented.");
	}
}

module.exports = EventMiddleware;
