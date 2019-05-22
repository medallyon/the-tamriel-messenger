const request = require("request");

class APIWrapper
{
    constructor()
    {
        this.request = request.defaults({
            baseUrl: process.env.GROGSILE_API_DOMAIN,
            headers: {
                "User-Agent": `${process.env.APP_NAME}/${process.env.APP_VERSION}`,
                "Authorization": process.env.GROGSILE_API_KEY
            },
            json: true
        });
    }

    get(endpoint)
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            if (!endpoint)
                endpoint = "";

            self.request.get(endpoint, function(err, res, body)
            {
                if (err)
                    return reject(err);

                resolve(body);
            });
        });
    }

    post(endpoint, data)
    {
        let self = this;
        return new Promise(function(resolve, reject)
        {
            if (!endpoint)
                endpoint = "";

            self.request.post(endpoint, { body: data }, function(err, res)
            {
                if (err)
                    return reject(err);

                resolve(res);
            });
        });
    }
}

module.exports = APIWrapper;
