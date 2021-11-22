var requestPromise = require('request-promise');
var util = require('../util/util');
var logger = require('../util/log-util');
var axios = require('axios');
module.exports = {
    request: function(options) {
        logger.info('Requesting with the following configs: ' + JSON.stringify(options));
        return requestPromise(options);
    },
    requestPost: function(url,data,headers){
        logger.info('Requesting with the following configs: data-> ' + JSON.stringify(data) + 
        ' and URL->'+url+ ' and headers->'+JSON.stringify(headers));
        return axios.post(url, data, headers);
    }
};