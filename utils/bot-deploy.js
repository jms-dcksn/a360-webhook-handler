const request = require('request')

//Return the run as user ID to be used in the bot deployment API

const botDeploy = (crURL, token, botID, runAsUserID, botInput, callback) => {
    const url = crURL + 'v3/automations/deploy'
    request({
        url : url,
        method :"POST",
        headers : {
            "content-type": "application/json",
            "X-Authorization": token
        },
        body: {
            'fileId': botID,
            'botInput': botInput,
            'runAsUserIds':[runAsUserID],
            'callbackInfo':{},
            'poolIds': [],
            'overrideDefaultDevice': false
        },
        json: true
        }, (e, r, body)=>{
        if(e){
            callback('Connection with control room failed. Please try again.', undefined)
        } else if (r.body.message){
            callback(body.message, undefined)
        } else {
            callback(undefined, {
                deploymentId: r.body.deploymentId
            })
        }
    })
}

module.exports = botDeploy