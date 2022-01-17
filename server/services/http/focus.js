import { BaseRouter } from './base-router.js';

export class FocusApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/focus";
    }

    static register(context) {
        const focusApi = new FocusApi(context);
        focusApi.router.post('/start', (req, res) => focusApi.runCommand('focus_start', req.query, res));
        focusApi.router.post('/capture', (req, res) => focusApi.runCommand('focus_capture', req.query, res));
        focusApi.router.post('/stop', (req, res) => focusApi.runCommand('focus_stop', req.query, res));
        focusApi.router.post('/reset', (req, res) => focusApi.runCommand('focus_reset', req.query, res));
        focusApi.router.post('/in', (req, res) => focusApi.runCommand('focus_in', req.query, res));
        focusApi.router.post('/out', (req, res) => focusApi.runCommand('focus_out', req.query, res));
        focusApi.router.post('/loop', (req, res) => focusApi.runCommand('focus_loop', req.query, res));
        focusApi.router.post('/set-settings', (req, res) => focusApi.runCommand('focus_set_settings', req.query, res));
        focusApi.router.post('/set-crosshair', (req, res) => focusApi.runCommand('focus_set_crosshair', req.query, res));
        focusApi.router.post('/set-primary-settings', (req, res) => focusApi.runCommand('focus_set_primary_settings', req.query, res));
        focusApi.router.post('/set-process-settings', (req, res) => focusApi.runCommand('focus_set_process_settings', req.query, res));
        focusApi.router.post('/set-mechanics-settings', (req, res) => focusApi.runCommand('focus_set_mechanics_settings', req.query, res));
        focusApi.router.get('/get-primary-settings', (req, res) => focusApi.runCommandAndWait('focus_get_primary_settings', req.query, res));
        focusApi.router.get('/get-process-settings', (req, res) => focusApi.runCommandAndWait('focus_get_process_settings', req.query, res));
        focusApi.router.get('/get-mechanics-settings', (req, res) => focusApi.runCommandAndWait('focus_get_mechanics_settings', req.query, res));
        // Prepare websocket event
        context.websocket.registerFilter(['focus_'], (message) => focusApi.onRegisterEvent(message));
        return focusApi.router;
    }

}
