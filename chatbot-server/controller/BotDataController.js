const botDataService = require('../services/BotDataService');
const authVisitorService = require('../services/AuthVisitorService');
const logger = require('../util/log-util');
const dataCacheService = require('../services/DataCacheService');
module.exports = function(req, res) {
    logger.info('inside BotDataController inititaing service call for triggering private/channelId API');
    dataCacheService.manageData(null).then(function(cachedUserInfo) {
        if(cachedUserInfo == 'undefined' || cachedUserInfo == null){
            logger.error('This API can functions as per flow of data, user data is not found in cache hence returning error');
            res.status(500).send({
                "code": '009',
                "msg": 'User information not found, API invocation failed'
            });
        }
        logger.debug('Cached data retrieved successfully'+JSON.stringify(cachedUserInfo));
        botDataService.getBotData(req,cachedUserInfo).then(function(botDataResponse) {
            authVisitorService.getVisitorAuthData(req,cachedUserInfo).then(function(visitorAuthDataResponse) {
                botDataResponse.visitorAuthResponse = visitorAuthDataResponse.authKey;
                cachedUserInfo.botData = botDataResponse;
                dataCacheService.manageData(cachedUserInfo).then(function(cachedData) {
                    logger.debug('Aggregated data cached successfully'+JSON.stringify(cachedData));
                }).catch(function(error) {
                    logger.error('error occurred in caching data');
                    res.status(500).send({
                        "code": '008',
                        "msg": 'Caching of data encountered an error, try again later.'
                    });
                });
                res.json(botDataResponse);
            }).catch(function(error) {
                logger.error('error occurred in service invocation of visitor authAPI call, exiting with error code '+ error.CODE+ ' and message '+error.MSG);
                res.status(500).send({
                    "code": error.CODE,
                    "msg": error.MSG
                });
            });
        }).catch(function(error) {
            logger.error('error occurred in service invocation of API call, exiting with error code '+ error.CODE+ ' and message '+error.MSG);
            res.status(500).send({
                "code": error.CODE,
                "msg": error.MSG
            });
        });
    }).catch(function(error) {
        logger.error('error occurred while retrieving caching data');
        res.status(500).send({
            "code": '008',
            "msg": 'Retrieval of cached data encountered an error, try again later.'
        });
    });
}