const serviceConfig = require('../config/api-config'),
   Promise = require('bluebird'),
   httpUtil = require('../util/http-util'),
   util = require('../util/util'),
   logger = require('../util/log-util'),
   requestPromise = require('request-promise'),
   exception = require('../config/exception.json'),
   environment = require('../config/environment');
   eventList=[]
   function triggerReadAPI(req,cachedUserInfo) {
        logger.debug('inside triggerReadAPI method'+JSON.stringify(cachedUserInfo));
        var data={};
        return new Promise(function(resolve,reject){
            let config = {
                headers: {
                    'authorization': 'Bearer V9WxVwHha8pFPNCMz2PK',
                    'userid': cachedUserInfo.userId
                }
              }
            httpUtil.requestPost(environment.config.url+'/user/channels/'+cachedUserInfo.channelId+'/read', data, config)
            .then((res) => {
                if(res != null && res.status == 200){
                    var success = {
                        'updateStatus':'success'
                    }
                    return resolve(success);
                }else{
                    reject(exception.Read_General_Exception);
                }
            }).catch((err) => {
                console.error(err);
            });
        });
   }
   function triggerDeliverAPI(req,cachedUserInfo) {
        logger.debug('inside triggerDeliverAPI method'+JSON.stringify(cachedUserInfo));
        var data={};
        return new Promise(function(resolve,reject){
            let config = {
                headers: {
                    'authorization': 'Bearer V9WxVwHha8pFPNCMz2PK',
                    'userid': cachedUserInfo.userId
                }
            }
            httpUtil.requestPost(environment.config.url+'/user/channels/'+cachedUserInfo.channelId+'/delivered', data, config)
            .then((res) => {
                if(res != null && res.status == 200){
                    var success = {
                        'updateStatus':'success'
                    }
                    return resolve(success);
                }else{
                    reject(exception.Read_General_Exception);
                }
            }).catch((err) => {
                console.error(err);
            });
        });
    }
    function triggerSpentTimeAPI(req,cachedUserInfo) {
        var eventData = {
            "eventType": req.query.eventType,
            "timestamp": req.query.timestamp,
            "url": "insent-recruitment.web.app/",
            "props": {
                "channelId": cachedUserInfo.channelId,
                "field": req.query.field
            }
        };
        eventList.push(eventData);
        var data={
            "timeSpent": parseInt(req.query.timeSpent),
            "events": eventList
        };
        return new Promise(function(resolve,reject){
            let config = {
                headers: {
                    'authorization': 'Bearer V9WxVwHha8pFPNCMz2PK',
                    'userid': cachedUserInfo.userId
                }
            }
            httpUtil.requestPost(environment.config.url+'/user/pageVisit/spentTime/'+cachedUserInfo.sessionId, data, config)
            .then((res) => {
                if(res != null && res.status == 200){
                    var success = {
                        'updateStatus':'success'
                    }
                    return resolve(success);
                }else{
                    reject(exception.Read_General_Exception);
                }
            }).catch((err) => {
                console.error(err);
            });
        });
    }
module.exports = {
	intimateReadAPI: function(req,cachedUserInfo) {
        return triggerReadAPI(req,cachedUserInfo);
	},
    intimateDeliverAPI:function(req,cachedUserInfo){
        return triggerDeliverAPI(req,cachedUserInfo);
    },
    intimateSpentTimeAPI:function(req,cachedUserInfo){
        return triggerSpentTimeAPI(req,cachedUserInfo);
    },
    _: {
    	triggerReadAPI: triggerReadAPI,
        triggerDeliverAPI: triggerDeliverAPI,
        triggerSpentTimeAPI: triggerSpentTimeAPI
    }
}