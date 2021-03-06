import express from 'express';
import querystring from 'querystring';
import logger from 'morgan';

export class BaseRouter {

    constructor() {
        this.router = express.Router();
        logger.token('type', (req, res) => { return req.headers['content-type'] });
        this.router.use(logger('[:date[iso]] [ACCESS] :remote-addr - ":method :url HTTP/:http-version" :status :type :res[content-length] :response-time ms'));
        this.commands = [];
    }

    mountPath() {
        return "/";
    }

    register() {
    }

    onRegisterEvent(message) {
        if (this.commands[message.type] != null) {
            this.commands[message.type](message.payload);
            console.log('Command event', message);
        } else {
            // unsolicited event but match a filter so send it to UI
            this.context.websocket.sendUi(message);
            console.log('Unsolicited event', message);
        }
    }

    registerEvent(cmd, event) {
        this.commands[cmd] = event;
    }

    releaseEvent(cmd) {
        this.commands[cmd] = null;
    }

    async runCommandAndWait(command, params, response) {
        this.registerEvent( command, (data) => {
            this.releaseEvent( command);
            response.status(200).send(data);
        });
        // run command
        this.context.websocket.sendMessage({
            type: command,
            payload : params
        });
    }

    async runCommand(command, params, response) {
        // run command
        this.context.websocket.sendMessage({
            type: command,
            payload : params
        });
        response.status(200).send();
    }

    async runMediaCommand(command, params, response) {
        // run command
        this.context.websocket.sendMedia({
            type: command,
            payload : params
        });
        response.status(200).send();
    }
}
