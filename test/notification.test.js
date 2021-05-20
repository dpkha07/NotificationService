process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();


chai.use(chaiHttp);

//parent block
describe('Notifications', () => {

    /*
     * Test the /POST sendNotif
     */
    describe('Send Notification', () => {
        it('it should not send a notification according to the data and medium in the request', (done) => {
            let data = {
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
            chai.request(app)
                .post('/sendNotif')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql("Missing required fields!");
                    done();
                });
        });

    });

});

