const serviceConfig = require('../config/api-config'),
   Promise = require('bluebird'),
   httpUtil = require('../util/http-util'),
   util = require('../util/util'),
   logger = require('../util/log-util'),
   exception = require('../config/exception.json');
   function triggerGetUserAPI(req) {
    var requestObj = util.createApiRequest(req, 'getUser', null);
        return new Promise(function(resolve,reject){
            httpUtil.request(requestObj).then(
                function(response) {
                    if(response.statusCode.toString().trim() === '200'){
                        logger.info('Success response received from getUser API');
                        let validatedRes = validateApiResponse(response.body);
                        if (validatedRes === 'SUCCESS') {
                            var processedResponse = getProcessedResponse(response.body);
                            if(util.isDefined(processedResponse)){
                                return resolve(processedResponse);
                            }
                            else{
                                logger.error('Mandatory information not returned back from getUser API');
                                return resolve('NO_DATA');
                            }
                        } 
                        else if(validatedRes === 'NO_DATA'){
                            logger.error('Mandatory information not returned back from getUser API');
                            return resolve('NO_DATA');
                        } 
                        else{
                            reject(exception.Get_User_General_Exception);
                        }
                    }
                    else{
                        reject(exception.Get_User_General_Exception);
                    }
                })
            .catch(function(error) {
                logger.error('Exception occurred while calling getUser API');
                reject(exception.Get_User_General_Exception);
            })
        });
   }
/**
 * Function responsible for validating whether the get user api call has returned
 * mandatory response tags which are required for processing
 */
 function validateApiResponse(response) {
    if(util.isDefined(response) && util.isDefined(response.channelId) && util.isDefined(response.popupMessage) && 
        util.isDefined(response.popupMessage.message) && util.isDefined(response.session) &&
        util.isDefined(response.session.id) && util.isDefined(response.user) &&
        util.isDefined(response.user.id) && util.isDefined(response.settings) && 
        util.isDefined(response.settings.bot) && util.isDefined(response.settings.bot.name) &&
        util.isDefined(response.settings.bot.company) && util.isDefined(response.settings.bot.img) &&
        util.isDefined(response.settings.bot.widgetIcon) && util.isDefined(response.initiateSocketConnection) ){
        return 'SUCCESS';
    }else{
        return 'NO_DATA';
    }
}
/**
 * Function responsible for processing the response from user service
 * and aggregating the same with required information for UI consumption
 */
 function getProcessedResponse(response) {
	var aggregatedUserData = {
	    	'channelId': response.channelId,
            'sessionId': response.session.id,
            'userId': response.user.id,
			'popupMessage': response.popupMessage.message,
			'botName': response.settings.bot.name,
			'botCompanyName': response.settings.bot.company,
            'initiateSocketConnection':response.initiateSocketConnection,
            'subscriptionChannel':response.subscriptionChannel,
            'displayWidget':response.settings.widget.show,
            'widgetImage':response.settings.bot.widgetIcon

	};
	return aggregatedUserData;
}
module.exports = {
	getUserDetails: function(req) {
        console.log('service wired');
        return triggerGetUserAPI(req);
	},
    _: {
    	triggerGetUserAPI: triggerGetUserAPI,
    	validateApiResponse: validateApiResponse,
    	getProcessedResponse: getProcessedResponse
    }
}