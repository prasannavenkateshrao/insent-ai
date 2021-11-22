const serviceConfig = require('../config/api-config'),
   Promise = require('bluebird'),
   httpUtil = require('../util/http-util'),
   util = require('../util/util'),
   logger = require('../util/log-util'),
   exception = require('../config/exception.json');
   function triggerPrivateChannelAPI(req,cachedUserInfo) {
    var requestObj = util.createApiRequest(req, 'privateChannel', cachedUserInfo);
        return new Promise(function(resolve,reject){
            httpUtil.request(requestObj).then(
                function(response) {
                    if(response.statusCode.toString().trim() === '200'){
                        logger.info('Success response received from privateChannel API'+response);
                        let validatedRes = validateApiResponse(response.body);
                        if (validatedRes === 'SUCCESS') {
                            var processedResponse = getProcessedResponse(response.body);
                            if(util.isDefined(processedResponse)){
                                return resolve(processedResponse);
                            }
                            else{
                                logger.error('Mandatory information not returned back from privateChannel API');
                                return resolve('NO_DATA');
                            }
                        } 
                        else if(validatedRes === 'NO_DATA'){
                            logger.error('Mandatory information not returned back from privateChannel API');
                            return resolve('NO_DATA');
                        } 
                        else{
                            reject(exception.Private_Channel_General_Exception);
                        }
                    }
                    else{
                        reject(exception.Private_Channel_General_Exception);
                    }
                })
            .catch(function(error) {
                logger.error('Exception occurred while calling privateChannel API');
                reject(exception.Private_Channel_General_Exception);
            })
        });
   }
   /**
 * Function responsible for validating whether the get user api call has returned
 * mandatory response tags which are required for processing
 */
 function validateApiResponse(response) {
    if(util.isDefined(response) && util.isDefined(response.channelId) && util.isDefined(response.messages) && 
        util.isDefined(response.end) && util.isDefined(response.messages[0]) && util.isDefined(response.messages[0].type) &&
        util.isDefined(response.messages[0].input) && util.isDefined(response.messages[0].input[0].key) &&
        util.isDefined(response.messages[0].input[0].name) && util.isDefined(response.messages[0].input[0].type)){
        return 'SUCCESS';
    }else{
        return 'NO_DATA';
    }
 }
 /**
 * Function responsible for processing the response from account lite and filtering the accounts
 * based on Corporate actions requirements and returning the list of accounts that has to be
 * passed to events search API call
 */
  function getProcessedResponse(response) {
	var aggregatedConversationData = {
	    	'isLastConversation': response.end,
            'conversationType': response.messages[0].type,
            'conversationKey': response.messages[0].input[0].key,
			'conversationValue': response.messages[0].input[0].name

	};
	return aggregatedConversationData;
}
module.exports = {
	getBotData: function(req,cachedUserInfo) {
        return triggerPrivateChannelAPI(req,cachedUserInfo);
	},
    _: {
    	triggerPrivateChannelAPI: triggerPrivateChannelAPI,
    	validateApiResponse: validateApiResponse,
    	getProcessedResponse: getProcessedResponse
    }
}