const AWS = require('aws-sdk');

class SQSProxy {

    constructor() {
        this.sqs = new AWS.SQS();
    }

    delete(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.sqs.deleteMessage(params).promise();
                return resolve(result);
            } catch (error) {
                return reject(error);
            }
        })
    }
}

module.exports = SQSProxy;