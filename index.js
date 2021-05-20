
const express = require('express');
const app = express();
const port = process.env.port || 3000;

const server = http.createServer(app);
const SQSConsumer = require('./src/biz/sqs-consumer.biz');

const notificationController = require('./src/controllers/notification.controller');

app.post('/sendNotif', notificationController.sendNotification);

//sqs for fetching the requests
const sqsnotifConsumer = new SQSConsumer(config.get('aws.sqs.notifQueue'));
sqsnotifConsumer.ingest();

server.listen(port, function () {
    console.log(`Running on ${port}`);
});

module.exports = app;