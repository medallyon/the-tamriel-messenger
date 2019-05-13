const path = require("path")
    , client = require(path.join(__base, "client"));

function tweet(tweetObject)
{
    this.fetchWebhook(process.env.TWEETER_WEBHOOK_ID, process.env.TWEETER_WEBHOOK_TOKEN).then(function(webhook)
    {
        webhook.send(`https://twitter.com/${tweetObject.user.screen_name}/status/${tweetObject.id_str}`, {
            username: tweetObject.user.name,
            avatarURL: tweetObject.user.profile_image_url_https
        }).then(function()
        {
            console.log(`\nSuccessfully sent ${tweetObject.user.name}'s tweet to WEBHOOK.`);
        }).catch(function(err)
        {
            console.error(err);
        });
    });
}

module.exports = tweet;
