import { BaseRouter } from './base-router.js';

export class DomeApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/dome";
    }

    static register(context) {
        const domeApi = new DomeApi(context);
        domeApi.router.post('/park', (req, res) => domeApi.runCommand('dome_park', req.query, res));
        domeApi.router.post('/unpark', (req, res) => domeApi.runCommand('dome_unpark', req.query, res));
        domeApi.router.post('/goto', (req, res) => domeApi.runCommand('dome_goto', req.query, res));
        domeApi.router.post('/stop', (req, res) => domeApi.runCommand('dome_stop', req.query, res));
        // Prepare websocket event
        context.websocket.registerFilter(['dome_'], (message) => domeApi.onRegisterEvent(message));
        return domeApi.router;
    }
}
