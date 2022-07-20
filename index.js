const express = require('express');
const auth = require('./utils/auth')
const runAsUser = require('./utils/run-as-user')
const botDeploy = require('./utils/bot-deploy')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/version', (req, res) => {
    res.status(200).send("A360 Webhook Handler. Version 2.0");
});

app.get('/', (req, res) => {
    res.status(200).send("Hi there.");
});

app.post('/webhook', async (req, res) => {
    let controlRoomUrl = req.body.controlRoomUrl
    if ( !controlRoomUrl.endsWith('/') ) {
        controlRoomUrl += '/'
    }
    const [tokenError, token] = await auth(controlRoomUrl, req.body.userName, req.body.password)
    if(tokenError){ res.send({
            error: tokenError
        })
    }

    const [userError, userId] = await runAsUser(controlRoomUrl, token, req.body.runAsUser)
    if(userError){ res.send({
            error: userError
        })
    }

    const [deployError, deploymentId] = await botDeploy(controlRoomUrl, token, req.body.botId, userId, req.body.poolId, req.body.botInput, req.body.callbackInfo)
    if(deployError){ res.send({
        error: deployError
    })
}
                
    res.send({
                deploymentId: deploymentId,
                callbackInfo: req.body.callbackInfo
            })
    });

app.post('/output', (req, res) => {
    console.log('Status: ', req.body.botOutput)
    //console.log('String output: ' + req.body.botOutput.output)
    res.send('Thanks for sharing')
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});