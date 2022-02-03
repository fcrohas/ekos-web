import { BaseRouter } from './base-router.js';

export class MountApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/mount";
    }

    static register(context) {
        const mountApi = new MountApi(context);
        mountApi.router.post('/park', (req, res) => mountApi.runCommand("mount_park", req.query, res));
        mountApi.router.post('/unpark', (req, res) => mountApi.runCommand("mount_unpark", req.query, res));
        mountApi.router.post('/abort', (req, res) => mountApi.runCommand("mount_abort", req.query, res));
        mountApi.router.post('/sync-rade', (req, res) => mountApi.runCommand("mount_sync_rade", req.query, res));
        mountApi.router.post('/sync-target', (req, res) => mountApi.runCommand("mount_sync_rade", req.query, res));
        mountApi.router.post('/goto-rade', (req, res) => mountApi.runCommand("mount_goto_rade", req.query, res));
        mountApi.router.post('/goto-target', (req, res) => mountApi.runCommand("mount_goto_target", req.query, res));
        mountApi.router.post('/set-motion', (req, res) => mountApi.runCommand("mount_set_motion", req.query, res));
        mountApi.router.post('/set-tracking', (req, res) => mountApi.runCommand("mount_set_tracking", req.query, res));
        mountApi.router.post('/set-slewrate', (req, res) => mountApi.runCommand("mount_set_slew_rate", req.query, res));
        mountApi.router.post('/set-altitude-limits', (req, res) => mountApi.runCommand("mount_set_altitude_limits", req.query, res));
        mountApi.router.post('/set-ha-limits', (req, res) => mountApi.runCommand("mount_set_ha_limit", req.query, res));
        mountApi.router.post('/set-meridian-flip', (req, res) => mountApi.runCommand("mount_set_meridian_flip", req.query, res));
        mountApi.router.post('/set-autopark', (req, res) => mountApi.runCommand("mount_set_auto_park", req.query, res));
        mountApi.router.post('/set-everyday-auto-park', (req, res) => mountApi.runCommand("mount_set_everyday_auto_park", req.query, res));
        mountApi.router.post('/clear', (req, res) => mountApi.runCommand("mount_clear", req.query, res));
        mountApi.router.get('/get-settings', (req, res) => mountApi.runCommandAndWait("mount_get_settings", req.query, res));
        context.websocket.registerFilter(['mount_'], (message) => mountApi.onRegisterEvent(message));
        return mountApi.router;
    }
}
