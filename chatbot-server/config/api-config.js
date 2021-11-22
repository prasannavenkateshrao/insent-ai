'use strict'
var environment = require('./environment');
module.exports = {
    userAPI: {
        "url":environment.config.url+'/getuser?url=insent-recruitment.web.app',
        "headers":{
            "authorization": environment.config.authorization,
            "userid": environment.config.userid
        },
        simple: false, 
        resolveWithFullResponse: true,
        json: true
    },
    privateChannelAPI:{
        "headers":{
            "authorization": environment.config.authorization
        },
        simple: false, 
        resolveWithFullResponse: true,
        json: true
    }
};