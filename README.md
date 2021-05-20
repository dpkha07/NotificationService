# Notification Service

This is done assuming that SQS is implemented in place so that the nodejs consumer listens to it and acts on the request accordingly.

The API contains 1 endpoint and 1 consumer 
(API can be used to hit directly via front end or postman)
or else push into SQS

A CRON tab can be used to schedule the notifications and regularly check for requests to push into SQS
  


