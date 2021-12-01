function loggedIn()
{
	console.log(`Successfully logged in as ${this.client.user.tag}.`);
}

module.exports = loggedIn;
