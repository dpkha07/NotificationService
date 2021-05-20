const notifRequest = require('../request/notification.request');
const config = require('../../config/medium');
const ST = require('selecttransform').SelectTransform;
const SqsProxy = require('../proxy/sqs.proxy');

class NotificationBiz {

    /*
        Notification Biz Layer to call the request API of the service provider
        data : will be fetched from db in the required format as the template stored.
        medium : can be sms/email/whatsapp etc depending on which template can be fetched from db
        Storing the template in db makes it really configurable as there's no code change required
        For now, I am storing it in the config
    */
    sendNotification(params, data, medium) {
        return new Promise(async (resolve, reject) => {
            try {
                /* Sample data of the user and other info we might be getting from the db. We can dump all data and the
                template will filter automatically
                const data = {
                    "url": "https://sendSms.com",
                    "token": "xyz",
                    "data": [
                        {
                            "phone_no": 9999999999,
                            "content": "Hello",
                            "name": "Test"
                        }
                    ]
                };
                */
                const st = new ST();    //SelectTransform npm package which transforms given JSON according to the template
                const template = config.get(medium);
                const requiredData = st.transform(template, data);
                
                const result = await notifRequest.sendNotification(requiredData);
                if(result.status == 'success') {    //assuming the service would give back success in response
                    //set is_sent flag in logs table of db to indicate notification has been sent.
                    try {
                        const sqsProxy = new SqsProxy();
                        await sqsProxy.delete(params);  //pop the request from the queue
                    } catch (error) { console.log(JSON.stringify(error)) }
                } else {
                    //set is_sent flag to 0 to indicate failure and to use that to retry in future
                    //let request stay in sqs
                }
                resolve(result);
            } catch (error) {
                //set is_sent flag to 0 to indicate failure and to use that to retry in future
                reject(error);
            }
        });
    }


}

module.exports = NotificationBiz;