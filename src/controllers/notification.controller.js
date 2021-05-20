const NotificationBiz = require('../biz/notification.biz');

module.exports = {
    
    sendNotification: async (request, response) => {
        const medium = request.body.medium;
        const data = request.body.data;

        const params = request.params;

        if (medium === undefined || data === undefined|| medium === "" || data === "") {
            res.status(400).json({error: "Missing required fields!"});
        } else {
            try {
                this.notificationBiz = new NotificationBiz();
                const result = await this.notificationBiz.sendNotification(params, data, medium);
                response.status(200).json({
                    success: true,
                    data: result
                });
            } catch (error) {
                response.status(500).json({
                    success: false,
                    error: error
                });
            }
        }
    }
}
