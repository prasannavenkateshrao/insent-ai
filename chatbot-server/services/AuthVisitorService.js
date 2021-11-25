const serviceConfig = require('../config/api-config'),
   Promise = require('bluebird'),
   httpUtil = require('../util/http-util'),
   util = require('../util/util'),
   logger = require('../util/log-util'),
   requestPromise = require('request-promise'),
   axios = require('axios')
   exception = require('../config/exception.json'),
   environment = require('../config/environment');
   function triggerVisitorAuthAPI(req, cachedUserInfo) {
        logger.debug('inside visitor auth method');
        const data = {
            socket_id: req.query.socketId,
            channel_name: cachedUserInfo.subscriptionChannel
        };
        return new Promise(function(resolve,reject){
            var headers={};
            httpUtil.requestPost(environment.config.url+'/pusher/presence/auth/visitor?userid='+cachedUserInfo.userId, data,headers)
            .then((res) => {
                let validatedRes = validateApiResponse(res.data);
                if (validatedRes === 'SUCCESS') {
                    var processedResponse = getProcessedResponse(res.data);
                    if(util.isDefined(processedResponse)){
                        return resolve(processedResponse);
                    }
                    else{
                        logger.error('Mandatory information not returned back from visitorAuth API');
                        return resolve('NO_DATA');
                    }
                } 
                else if(validatedRes === 'NO_DATA'){
                    logger.error('Mandatory information not returned back from visitorAuth API');
                    return resolve('NO_DATA');
                } 
                else{
                    reject(exception.Visitor_Auth_General_Exception);
                }
            }).catch((err) => {
                console.error(err);
            });
        });
   }
   /**
 * Function responsible for validating whether the visitor auth api call has returned
 * mandatory response tags which are required for processing
 */
 function validateApiResponse(response) {
    if(util.isDefined(response) && util.isDefined(response.channel_data) && 
        util.isDefined(response.auth)){
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
	    	'channelData': response.channel_data,
            'authKey': response.auth

	};
	return aggregatedConversationData;
}
module.exports = {
	getVisitorAuthData: function(req, cachedUserInfo) {
        return triggerVisitorAuthAPI(req, cachedUserInfo);
	},
    _: {
    	triggerVisitorAuthAPI: triggerVisitorAuthAPI,
    	validateApiResponse: validateApiResponse,
    	getProcessedResponse: getProcessedResponse
    }
}