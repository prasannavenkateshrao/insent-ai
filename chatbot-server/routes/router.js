let express = require('express');
let router = express.Router();
let cors = require('cors');
const csrf = require('csurf');

const homeController = require('../controller/InitialDataLoadController');
const botDataController = require('../controller/BotDataController');
const conversationUpdateController = require('../controller/ConversationUpdateController');
const csrfProtection = csrf({ cookie: true });

//Implement csurf protection
router.use(csrfProtection);

router.use(function (req, res, next) {
 res.cookie('XSRF-TOKEN', req.csrfToken());
 next()
});
router.get('/get/chat-bot',homeController);
router.get('/retrieve/chat-bot/data',botDataController);
router.get('/update/user/conversation',conversationUpdateController);
module.exports = router;
