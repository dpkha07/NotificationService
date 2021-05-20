const http = require('request');

class NotificationRequest {

    sendNotification(data) {
        return new Promise(async (resolve, reject) => {
            try { 
                const parsedData = JSON.parse(data);
                const uri = parsedData.url;
                const headers = parsedData.headers;
                let apiBody = JSON.stringify(data);

                http.post({
                    headers: headers,
                    url: uri,
                    body: apiBody
                }, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    }
                    if (response.statusCode != 200) {
                        return reject({
                            message: "Error occured while Getting Response from Server",
                            body: body
                        })
                    }
                    return resolve(JSON.parse(body));
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new NotificationRequest();
