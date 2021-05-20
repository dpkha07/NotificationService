const AWS = require('aws-sdk');
const https = require('https');
const { Consumer } = require('sqs-consumer');
const NotificationBiz = require('./notification.biz');

class SQSConsumer {
    constructor(conf) {
        this.conf = conf;
        AWS.config.update(conf);
        this.sqs = new AWS.SQS({
            httpOptions: {
                agent: new https.Agent({
                    keepAlive: true,
                })
            }
        });
        this.notificationBiz = new NotificationBiz();
    }

    ingest() {
        return new Promise(async (resolve, reject) => {
            try {
                const app = Consumer.create({
                    queueUrl: this.conf.queueUrl,
                    handleMessage: async (message) => {
                        if (message && message.body) {
                            const obj = {
                                ReceiptHandle: message.ReceiptHandle,
                                QueueUrl: this.conf.queueUrl,
                            };
                            try {
                                const body = JSON.parse(message.body);
                                const medium = JSON.parse(message.medium);
                                await this.notificationBiz.sendNotification(obj, body, medium);
                            } catch (error) {
                                console.log('JSON ERROR: ');
                            }
                        }
                    },
                    sqs: this.sqs
                });

                app.on('error', (err) => {
                    console.error(err.message);
                });

                app.on('processing_error', (err) => {
                    console.error(err.message);
                });

                app.start();

                console.log(`SQS consumer initiated!`);
                return resolve(true);
            } catch (error) {
                console.log(error);
                return resolve(false);
            }
        });
    }
}

module.exports = SQSConsumer;