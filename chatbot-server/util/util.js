var path = require('path'),
 rootPath = require('app-root-path').path,
 apiConfig = require(rootPath + '/config/api-config.js'),
 exception = require(rootPath + '/config/exception.json'),
 logger = require('./log-util'),
 environment = require('../config/environment'),
 copiedUserResponse=null;
module.exports = {
    /**
     * Determines whether argument is undefined
     * @param item
     * @returns {boolean} returns true if argument is defined, returns false if argument is not defined
     */
    isDefined: function(item) {
        if (typeof item !== 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    //masks the header to remove sensitive information, can be used for logging purposes
    maskHeaders: function(headers) {
        var maskedHeaders = JSON.parse(JSON.stringify(headers)); // to create a copy of the headers
        for (var i in maskedHeaders) {
                maskedHeaders[i] = '*****';
        }
        return maskedHeaders;
    },
    //function responsible for creating api request structure
    createApiRequest: function(req, apiName,requestObject){
    	var config;
    	try {
    		switch(apiName) {
            case 'getUser':
            	config = apiConfig.userAPI;
                break;
            case 'privateChannel':
                config = apiConfig.privateChannelAPI;
                config.url = environment.config.url+'/user/channels/' + requestObject.channelId;
                config.headers.userid = requestObject.userId;
                break;
            }
            return config;
        } catch (e) {
            throw new Error(exception.Create_Request_Exception.CODE, exception.Create_Request_Exception.MSG);
        }
    }
};
