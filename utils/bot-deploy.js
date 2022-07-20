const axios = require('axios')

const deploy = async (url, token, botId, runAsUserId, poolId, botInput, callbackInfo) => {
    url = url + 'v3/automations/deploy'
    try{
        const { data } = await axios(
        {
            method: 'post',
            url: url,
            data: {
                    'fileId': botId,
                    'callbackInfo':callbackInfo,
                    'runAsUserIds':[runAsUserId], //Run As User should have default device set - otherwise Pool ID is needed
                    'poolIds': [poolId],
                    'overrideDefaultDevice': false,
                    'botInput': botInput
                },
            headers : {
                "Content-Type": "application/json",
                "X-Authorization": token
            }
        });
        if(data.message){
            const message = data.message
            return [message, undefined]
        }
        const deploymentId = data.deploymentId
        return [undefined, deploymentId]
    } catch (error) {
        return [error.response.data.message, undefined]
        
    }
}

//Return the run as user ID to be used in the bot deployment API

module.exports = deploy