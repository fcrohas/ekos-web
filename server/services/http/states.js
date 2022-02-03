import { BaseRouter } from './base-router.js';

export class StatesApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
        this.commands = [];
    }

    static mountPath() {
        return "/api/states";

    }

    static register(context) {
        const baseRouter = new BaseRouter();
        const statesApi = new StatesApi(context);
        baseRouter.router.post('/online', (req, res) => statesApi.setOnline(req, res));
        baseRouter.router.get('/states', (req, res) => statesApi.runCommandAndWait('get_states', req.query, res));
        // Prepare websocket event
        context.websocket.registerFilter(['new_', 'set_client_state'], (message) => statesApi.onStateEvent(message));
        return baseRouter.router;
    }

    onStateEvent(message) {
        if (this.commands[message.type] != null) {
            this.commands[message.type](message.payload);
        } else {
            // unsolicited event go to final UI
            this.context.websocket.sendUi(message);
        }
    }

    registerEvent(cmd, event) {
        this.commands[cmd] = event;
    }

    releaseEvent(cmd) {
        this.commands[cmd] = null;
    }

    setOnline(req, res) {
        // Switch to online mode
        this.context.websocket.sendMessage({
            type:"set_client_state",
            payload : {
                state: true
            }
        });
        res.status(200).send();
    }
}
