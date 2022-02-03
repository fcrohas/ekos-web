import { BaseRouter } from './base-router.js';

export class CaptureApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
        this.commands = [];
    }

    static mountPath() {
        return "/api/capture";

    }

    static register(context) {
        const captureApi = new CaptureApi(context);

        captureApi.router.get('/sequences', (req, res) => captureApi.runCommandAndWait("capture_get_sequences", req.params, res));
        captureApi.router.delete('/sequence/:id', (req, res) => captureApi.runCommand("capture_remove_sequence", req.params, res));
        captureApi.router.post('/sequence', (req, res) => captureApi.runCommand("capture_add_sequence", req.body, res));
        captureApi.router.post('/preview', (req, res) => captureApi.runCommand('capture_preview', req.query, res));
        captureApi.router.post('/toggle-video', (req, res) => captureApi.runCommand('capture_toggle_video', req.query, res));
        captureApi.router.post('/toggle-camera', (req, res) => captureApi.runCommand('capture_toggle_camera', req.query, res));
        captureApi.router.post('/toggle-filter-wheel', (req, res) => captureApi.runCommand('capture_toggle_filter_wheel', req.query, res));
        captureApi.router.post('/start', (req, res) => captureApi.runCommand('capture_start', req.query, res));
        captureApi.router.post('/stop', (req, res) => captureApi.runCommand('capture_stop', req.query, res));
        captureApi.router.post('/limits', (req, res) => captureApi.runCommand('capture_set_limits', req.query, res));
        captureApi.router.get('/limits', (req, res) => captureApi.runCommandAndWait('capture_get_limits', req.query, res));
        captureApi.router.post('/loop', (req, res) => captureApi.runCommand('capture_loop', req.query, res));
        captureApi.router.get('/get-calibration-settings', (req, res) => captureApi.runCommandAndWait('capture_get_calibration_settings', req.query, res));
        captureApi.router.post('/set-settings', (req, res) => captureApi.runCommand('capture_set_settings', req.query, res));
        captureApi.router.get('/get-file-settings', (req, res) => captureApi.runCommandAndWait('capture_get_file_settings', req.query, res));

        // Prepare websocket event
        context.websocket.registerFilter(['capture_'], (message) => captureApi.onRegisterEvent(message));
        return captureApi.router;
    }
}
