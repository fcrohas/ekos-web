import { BaseRouter } from './base-router.js';

export class AlignApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/align";
    }

    static register(context) {
        const alignApi = new AlignApi(context);
        alignApi.router.post('/solve', (req, res) => alignApi.runCommand('align_solve', req.query, res));
        alignApi.router.post('/stop', (req, res) => alignApi.runCommand('align_stop', req.query, res));
        alignApi.router.post('/load-and-skew', (req, res) => alignApi.runCommand('align_load_and_slew', req.query, res));
        alignApi.router.post('/set-file-extension', (req, res) => alignApi.runCommand('align_set_file_extension', req.query, res));
        alignApi.router.post('/set-settings', (req, res) => alignApi.runCommand('align_set_settings', req.query, res));
        // Prepare websocket event
        context.websocket.registerFilter(['align_'], (message) => alignApi.onRegisterEvent(message));
        return alignApi.router;
    }
}
