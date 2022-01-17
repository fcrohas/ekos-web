import { BaseRouter } from './base-router.js';

export class PolarAlignApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/pah";
    }

    static register(context) {
        const polarApi = new PolarAlignApi(context);
        polarApi.router.post('/start', (req, res) => polarApi.runCommand('polar_start', req.query, res));
        polarApi.router.post('/stop', (req, res) => polarApi.runCommand('polar_stop', req.query, res));
        polarApi.router.post('/slew-done', (req, res) => polarApi.runCommand('polar_slew_done', req.query, res));
        polarApi.router.post('/set-crosshair', (req, res) => polarApi.runCommand('polar_set_crosshair', req.query, res));
        polarApi.router.post('/star-select-done', (req, res) => polarApi.runCommand('polar_star_select_done', req.query, res));
        polarApi.router.post('/refreshing-done', (req, res) => polarApi.runCommand('polar_refreshing_done', req.query, res));
        polarApi.router.post('/refresh', (req, res) => polarApi.runCommand('polar_refresh', req.query, res));
        polarApi.router.post('/reset-view', (req, res) => polarApi.runCommand('polar_reset_view', req.query, res));
        polarApi.router.post('/set-zoom', (req, res) => polarApi.runCommand('polar_set_zoom', req.query, res));
        // Prepare websocket event
        //context.websocket.registerFilter(['pah_'], (message) => polarApi.onRegisterEvent(message));
        return polarApi.router;
    }
}
