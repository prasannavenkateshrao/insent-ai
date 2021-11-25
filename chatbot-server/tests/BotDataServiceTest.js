var expect    = require("chai").expect;
var requestPromise = require('request-promise');
var expectedUserDataResponse = {
    "channelId": "private-dR2tYfDLJkA4wosm216373179657521637327997415",
    "sessionId": "619f2acf1538fc001ee40949/619f2acf1538fc001ee4094a",
    "userId": "dR2tYfDLJkA4wosm21637317965752",
    "popupMessage": "Hello Sir/Mam, Welcome !!!<br />",
    "botName": "InsentBot",
    "botCompanyName": "Insent",
    "initiateSocketConnection": false,
    "subscriptionChannel": "presence-insentrecruit-widget-user-dR2tYfDLJkA4wosm21637317965752",
    "displayWidget": true,
    "widgetImage": "https://staging-uploads.insent.ai/insentrecruit/logo-insentrecruit-1636924693820?1636924693897"
};
var expectedChatBotResponse={
    "isLastConversation": false,
    "conversationType": "input",
    "conversationKey": "firstName",
    "conversationValue": "First Name",
    "visitorAuthResponse": "67bb469433cb732caa7a:d573dad1ee48a81f56dd5803419c3424ad53305a92764cbde2f19b033f6186a4"
};
describe("Bot data service test", function() {
describe("check get chatbot", function() {
    var url = "http://localhost:8000/get/chat-bot";
    it("verify response is getting returned as expected", function() {
        requestPromise(url, function(error, response, body) {
        expect(response.body).to.equal(expectedUserDataResponse);
      });
    });
  });
  describe("check get chatbot", function() {
    var url = "http://localhost:8000/retrieve/chat-bot/data?socketId=327294.74913090";
    it("verify response is getting returned as expected", function() {
        requestPromise(url, function(error, response, body) {
        expect(response.body).to.equal(expectedChatBotResponse);
      });
    });
  });
});