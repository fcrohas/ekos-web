import { BaseRouter } from './base-router.js';

export class GuideApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/guide";
    }

    static register(context) {
        const guideApi = new GuideApi(context);
        guideApi.router.post('/start', (req, res) => guideApi.runCommand('guide_start', req.query, res));
        guideApi.router.post('/stop', (req, res) => guideApi.runCommand('guide_stop', req.query, res));
        guideApi.router.post('/capture', (req, res) => guideApi.runCommand('guide_capture', req.query, res));
        guideApi.router.post('/loop', (req, res) => guideApi.runCommand('guide_loop', req.query, res));
        guideApi.router.post('/clear', (req, res) => guideApi.runCommand('guide_clear', req.query, res));
        guideApi.router.post('/report', (req, res) => guideApi.runCommand('guide_report', req.query, res));
        guideApi.router.post('/set-settings', (req, res) => guideApi.runCommand('guide_set_settings', req.query, res));
        // Prepare websocket event
        //context.websocket.registerFilter(['guide_'], (message) => guideApi.onRegisterEvent(message));
        return guideApi.router;
    }
}
