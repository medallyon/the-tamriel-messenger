const Command = require("../classes/DiscordCommand.js");

class Eval extends Command
{
	constructor(client)
	{
		super(client, {
			name: "eval",
			alias: [ "eval", "evaluate" ],
			description: "Evaluate a snippet of code. Only Developers may use this command.",
			permission: 900,
		});
	}

	_runFunc(resolve, reject)
	{
		if (!this.args.length)
			return reject("Some code is required for this command.");

		let result;
		try
		{
			result = eval(this.args.join(" "));
		}

		catch (err)
		{
			result = err;
		}

		this.channel.send(result || ((typeof result === "undefined") ? "undefined" : "null"), { code: "js", split: true })
			.catch(console.error);
	}

	run(msg)
	{
		const boundRun = this._runFunc.bind(msg);
		return new Promise(boundRun);
	}
}

module.exports = Eval;
