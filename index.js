const express = require('express');
const auth = require('./utils/auth')
const runAsUser = require('./utils/run-as-user')
const botDeploy = require('./utils/bot-deploy')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/version', (req, res) => {
    res.status(200).send("A360 Webhook Handler. Version 1.0");
});

app.get('/', (req, res) => {
    res.status(200).send("Hi there.");
});

app.post('/webhook', (req, res) => {
    auth(req.body.controlRoomUrl, req.body.userName, req.body.password, (error, {token}={}) => {
        if(error){
            return res.send({
                error: error
            })
        }
        runAsUser(req.body.controlRoomUrl, token, req.body.runAsUser, (error, {userId, device} = {}) => {
            if(error){
                return res.send({
                    error: error
                })
            }
            botDeploy(req.body.controlRoomUrl, token, req.body.botId, userId, req.body.botInput, (error, {deploymentId}={})=>{
                if(error){
                    return res.send({
                        error: error
                    })
                }
                res.send({
                    deploymentId: deploymentId
                })
            })
        })
    })
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});