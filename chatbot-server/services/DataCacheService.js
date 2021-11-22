/*
 * Data cache service is used to
 * cache the data which has been requested
 * to be cached so that during subsequent action
 * the needed cached data gets
 * picked up and flow is proceeded successfully.
 */
const logger = require('../util/log-util'),
Promise = require('bluebird'),
U = require('underscore'),
NodeCache = require("node-cache"),
cache = new NodeCache(),
masterCacheKey = 'MasterDataKey',
util = require('../util/util');
		function handleData(req) {
            return new Promise(function(resolve, reject) {
				if(checkKey(req, masterCacheKey) && req == null){
					var cachedData = getDatafromCache(req, masterCacheKey);
					logger.debug('cachedData->'+JSON.stringify(cachedData));
					resolve(cachedData);
				}else{
					logger.debug('setting latest data to cache');
					setLatestCache(req,resolve);
				}
            });           
		}

/**
 * Checks whether data is already
 * present in request object cache and returns it.
 * */
function getDatafromCache(req, key) {
    logger.debug("Obtaining data stored in cache "+ key+ " and the value stored is ->"+JSON.stringify(cache.get(key)));
    return cache.get(key);
}

/**
 * Function to check if event object exist in request, if yes clear
 * any existing value in cache and set the latest object to cache.
 */
function setLatestCache(req,resolve){
		logger.debug('setting latest data from cache');
		if (checkKey(req, masterCacheKey)) {
			logger.debug("Found data in cache so clearing");
			cache.del(masterCacheKey);
        }else{
        	logger.debug("No cache on data found hence setting latest data"+JSON.stringify(req));
        }
		resolve(setDataToCache(masterCacheKey,req));
}

/**
 * Sets the request object in the cache
 */
function setDataToCache(masterCacheKey, req){
	logger.debug("Setting data to cache"+JSON.stringify(req));
	cache.set(masterCacheKey, req, 0);
	return req;
}

/**
 * Function to check whether cache has
 * the request value present.
 */
function checkKey(req, key) {
    logger.debug("Checking for data object in cache");
    if (U.isEmpty(cache.get(key))) {
        logger.debug("Returning " + U.isEmpty('derp'));
        return false;
    } else {
        logger.debug("Found data request in cache");
        return true;
    }
}
module.exports = {
	manageData: function(req) {
        return handleData(req);
	},
    _: {
		handleData: handleData,
		getDatafromCache: getDatafromCache,
		setLatestCache: setLatestCache,
		setDataToCache: setDataToCache,
		checkKey: checkKey
	}
}