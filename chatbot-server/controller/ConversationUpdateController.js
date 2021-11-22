const updateConversationService = require('../services/UpdateConversationService');
const logger = require('../util/log-util');
const dataCacheService = require('../services/DataCacheService');
module.exports = function(req, res) {
    var operation = req.query.operation;
    if(operation != null){
        dataCacheService.manageData(null).then(function(cachedUserInfo) {
            if(cachedUserInfo == 'undefined' || cachedUserInfo == null){
                logger.error('This API can functions as per flow of data, user data is not found in cache hence returning error');
                res.status(500).send({
                    "code": '009',
                    "msg": 'User information not found, API invocation failed'
                });
            }
            logger.debug('Cached data retrieved successfully'+JSON.stringify(cachedUserInfo));
            if(operation == 'read'){
                logger.info('inside InitialDataLoadController initiating service call for triggering read API');
                updateConversationService.intimateReadAPI(req,cachedUserInfo).then(function(readAPIResponse) {
                    res.json(readAPIResponse);	
                }).catch(function(error) {
                    logger.error('error occurred in service invocation of read API call, exiting with error code '+ error.CODE+ ' and message '+error.MSG);
                    res.status(500).send({
                        "code": error.CODE,
                        "msg": error.MSG
                    });
                });
            }else if(operation == 'deliver'){
                logger.info('inside InitialDataLoadController initiating service call for triggering deliver API');
                updateConversationService.intimateDeliverAPI(req,cachedUserInfo).then(function(deliverAPIResponse) {
                    res.json(deliverAPIResponse);	
                }).catch(function(error) {
                    logger.error('error occurred in service invocation of deliver API call, exiting with error code '+ error.CODE+ ' and message '+error.MSG);
                    res.status(500).send({
                        "code": error.CODE,
                        "msg": error.MSG
                    });
                });
            }else if(operation == 'spentTime'){
                var eventType = req.query.eventType;
                var timestamp = req.query.timestamp;
                var field = req.query.field;
                var timeSpent= req.query.timeSpent;
                if(eventType == null || timestamp == null || field == null || timeSpent == null){
                    res.status(400).send({
                        "code": "400",
                        "msg": "Bad request"
                    });
                }
                logger.info('inside InitialDataLoadController initiating service call for triggering spentTime API');
                updateConversationService.intimateSpentTimeAPI(req,cachedUserInfo).then(function(spentTimeAPIResponse) {
                    res.json(spentTimeAPIResponse);	
                }).catch(function(error) {
                    logger.error('error occurred in service invocation of spentTime API call, exiting with error code '+ error.CODE+ ' and message '+error.MSG);
                    res.status(500).send({
                        "code": error.CODE,
                        "msg": error.MSG
                    });
                });
            }else{
                res.status(400).send({
                    "code": "400",
                    "msg": "Bad request"
                });
            }
        }).catch(function(error) {
            logger.error('error occurred while retrieving caching data');
            res.status(500).send({
                "code": '008',
                "msg": 'Retrieval of cached data encountered an error, try again later.'
            });
        });
    }else{
        res.status(400).send({
            "code": "400",
            "msg": "Invalid request"
        });
    }
}