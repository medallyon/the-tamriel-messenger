const fs = require("fs-extra")
    , client = require("../../client")
    , request = require("request-promise");

const STORED_NEWS_PATH = `${client.Client.__paths.persistence}/modules/fetchLatestNews/latest.json`
    , ESO_NEWS_URL = "https://www.elderscrollsonline.com/en-us/news";

function replaceNewsArticleImage(msg)
{
    return new Promise(async function(resolve, reject)
    {
        if (msg.args.length < 2)
            return msg.reply("You must specify the article ID and the new image URL as arguments for this command.").catch(reject);

        let selectedArticle = 0
            , newUrl = ""
            , imageRegExp = /(https?:\/\/)?(www\.?)?esosslfiles-a\.akamaihd\.net\/cms\/\d{4,5}\/\d{2}\/.{32}\.(jpg|png|jpeg|bmp)/
            , articles = await fs.readJson(STORED_NEWS_PATH);

        selectedArticle = parseInt(msg.args[0]);
        newUrl = msg.args[1];

        if (!imageRegExp.test(newUrl))
            return reject("The specified image URL does not originate from the ESO image distribution services. Please only make use of images provided in News Articles found at <" + ESO_NEWS_URL + ">.");

        request(newUrl).then(function()
        {
            articles[selectedArticle].imageUrl = newUrl;
            fs.outputJson(STORED_NEWS_PATH, articles).then(function()
            {
                resolve("The new URL for this article was successfully saved.");
            }).catch(reject);
        }).catch(function()
        {
            reject("The new URL you provided did not resolve in an OK. It was not saved.");
        });
    });
}

replaceNewsArticleImage.meta = {
    name: "replaceNewsArticleImage",
    description: "Choose an article to replace its associated image with a specified URL.",
    alias: [ "replaceNewsArticleImage", "replaceArticleImage" ],
    usage: "<image-URL>",
    permissions: 900
};

module.exports = replaceNewsArticleImage;
