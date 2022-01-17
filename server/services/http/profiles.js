import { BaseRouter } from './base-router.js';

export class ProfilesApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
        this.commands = [];
    }

    static mountPath() {
        return "/api/profiles";

    }

    static register(context) {
        const baseRouter = new BaseRouter();
        const profileApi = new ProfilesApi(context);
        baseRouter.router.get('/', (req, res) => profileApi.retrieve(req, res));
        baseRouter.router.post('/:name/start', (req, res) => profileApi.start(req, res));
        baseRouter.router.post('/:name/stop', (req, res) => profileApi.stop(req, res));
        // Prepare websocket event
        context.websocket.registerFilter(['profile_', 'get_profiles'], (message) => profileApi.onProfileEvent(message));
        return baseRouter.router;
    }

    onProfileEvent(message) {
        if (this.commands[message.type] != null) {
            this.commands[message.type](message.payload);
        } else {
            // unsolicited event
            console.log('Unsolicited profiles event', message);
        }
    }

    registerEvent(cmd, event) {
        this.commands[cmd] = event;
    }

    releaseEvent(cmd) {
        this.commands[cmd] = null;
    }

    retrieve(req, res) {
        this.registerEvent("get_profiles", (data) => {
            res.status(200).send(data);
            this.releaseEvent("get_profiles");
        });
        // get profiles list
        this.context.websocket.sendMessage({
            type:"get_profiles",
            payload : {}
        });
    }

    start(req, res) {
        this.registerEvent("profile_start", (data) => {
            res.status(200).send(data);
            this.releaseEvent("profile_start");
        });
        // get profiles list
        this.context.websocket.sendMessage({
            type:"profile_start",
            payload : {
                name: req.params.name
            }
        });
        res.status(200).send("Done !");
    }

    stop(req, res) {
        this.registerEvent("profile_stop", (data) => {
            res.status(200).send(data);
            this.releaseEvent("profile_stop");
        });
        // get profiles list
        this.context.websocket.sendMessage({
            type:"profile_stop",
            payload : {
                name: req.params.name
            }
        });
        res.status(200).send("Done !");
    }
}
