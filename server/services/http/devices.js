import { BaseRouter } from './base-router.js';

export class DevicesApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/devices";
    }

    static register(context) {
        const devicesApi = new DevicesApi(context);
        devicesApi.router.get('/cameras', (req, res) => devicesApi.runCommandAndWait('get_cameras', {}, res));
        devicesApi.router.get('/mounts', (req, res) => devicesApi.runCommandAndWait('get_mounts', req.query, res));
        devicesApi.router.get('/filter-wheels', (req, res) => devicesApi.runCommandAndWait('get_filter_wheels', req.query, res));
        devicesApi.router.get('/domes', (req, res) => devicesApi.runCommandAndWait('get_domes', req.query, res));
        devicesApi.router.get('/caps', (req, res) => devicesApi.runCommandAndWait('get_caps', req.query, res));
        devicesApi.router.get('/stellarsolver-profiles', (req, res) => devicesApi.runCommandAndWait('get_stellarsolver_profiles', req.query, res));
        devicesApi.router.get('/drivers', (req, res) => devicesApi.runCommandAndWait('get_drivers', {}, res));
        devicesApi.router.get('/', (req, res) => devicesApi.runCommandAndWait('get_devices', {}, res));
        // Prepare websocket event
        context.websocket.registerFilter(['get_'], (message) => devicesApi.onRegisterEvent(message));
        return devicesApi.router;
    }
}
