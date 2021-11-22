const userDataService = require('../services/UserDataService');
const logger = require('../util/log-util');
const dataCacheService = require('../services/DataCacheService');
module.exports = function(req, res) {
    logger.info('inside InitialDataLoadController inititaing service call for triggering getUser API');
    userDataService.getUserDetails(req).then(function(getUserAPIResponse) {
        dataCacheService.manageData(getUserAPIResponse).then(function(cachedData) {
            logger.debug('Data cached successfully'+JSON.stringify(cachedData));
        }).catch(function(error) {
            logger.error('error occurred in caching data');
            res.status(500).send({
                "code": '008',
                "msg": 'Caching of data encountered an error, try again later.'
            });
        });
    	res.json(getUserAPIResponse);	
    }).catch(function(error) {
        logger.error('error occurred in service invocation of API call, exiting with error code '+ error.CODE+ ' and message '+error.MSG);
    	res.status(500).send({
            "code": error.CODE,
            "msg": error.MSG
        });
    });
}