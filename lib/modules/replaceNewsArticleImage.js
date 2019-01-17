const fs = require("fs-extra")
    , client = require("../../client")
    , request = require("request-promise");

const STORED_NEWS_PATH = `${client.Client.__paths.persistence}/modules/fetchLatestNews/latest.json`
    , ESO_NEWS_URL = "https://www.elderscrollsonline.com/en-us/news";

async function replaceNewsArticleImage(msg)
{
    if (msg.args.length < 2)
        return msg.reply("You must specify the article ID and the new image URL as arguments for this command.").catch(console.error);

    let selectedArticle = 0
        , newUrl = ""
        , imageRegExp = /(https?:\/\/)?(www\.?)?esosslfiles-a\.akamaihd\.net\/cms\/\d{4,5}\/\d{2}\/.{32}\.(jpg|png|jpeg|bmp)/
        , articles = await fs.readJson(STORED_NEWS_PATH);

    selectedArticle = parseInt(msg.args[0]);
    newUrl = msg.args[1];

    if (!imageRegExp.test(newUrl))
        return msg.reply("The specified image URL does not originate from the ESO image distribution services. Please only make use of images provided in News Articles found at <" + ESO_NEWS_URL + ">.").catch(console.error);

    request(newUrl).then(function()
    {
        articles[selectedArticle].imageUrl = newUrl;
        fs.outputJson(STORED_NEWS_PATH, articles).then(function()
        {
            msg.reply("The new URL for this article was successfully saved.").catch(console.error);
        }).catch(function(err)
        {
            console.error(err);
            msg.reply("The new URL could not be saved for some reason:```js\n" + err + "```").catch(console.error);
        });
    }).catch(function()
    {
        msg.reply("The new URL you provided did not resolve in an OK. It was not saved.").catch(console.error);
    });
}

replaceNewsArticleImage.meta = {
    name: "replaceNewsArticleImage",
    description: "Choose an article to replace its associated image with a specified URL.",
    alias: [ "replaceNewsArticleImage", "replaceArticleImage" ],
    permissions: 900
};

module.exports = replaceNewsArticleImage;
