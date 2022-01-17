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
        mountApi.router.get('/park', (req, res) => mountApi.runCommand("mount_park", req.query, res));
        mountApi.router.get('/unpark', (req, res) => mountApi.runCommand("mount_unpark", req.query, res));
        mountApi.router.get('/abort', (req, res) => mountApi.runCommand("mount_abort", req.query, res));
        mountApi.router.get('/sync-rade', (req, res) => mountApi.runCommand("mount_sync_rade", req.query, res));
        mountApi.router.get('/sync-target', (req, res) => mountApi.runCommand("mount_sync_rade", req.query, res));
        mountApi.router.get('/goto-rade', (req, res) => mountApi.runCommand("mount_goto_rade", req.query, res));
        mountApi.router.get('/goto-target', (req, res) => mountApi.runCommand("mount_goto_target", req.query, res));
        mountApi.router.get('/set-motion', (req, res) => mountApi.runCommand("mount_set_motion", req.query, res));
        mountApi.router.get('/set-tracking', (req, res) => mountApi.runCommand("mount_set_tracking", req.query, res));
        mountApi.router.get('/set-slewrate', (req, res) => mountApi.runCommand("mount_set_slew_rate", req.query, res));
        mountApi.router.get('/set-altitude-limits', (req, res) => mountApi.runCommand("mount_set_altitude_limits", req.query, res));
        mountApi.router.get('/set-ha-limits', (req, res) => mountApi.runCommand("mount_set_ha_limit", req.query, res));
        mountApi.router.get('/set-meridian-flip', (req, res) => mountApi.runCommand("mount_set_meridian_flip", req.query, res));
        mountApi.router.get('/set-autopark', (req, res) => mountApi.runCommand("mount_set_auto_park", req.query, res));
        mountApi.router.get('/set-everyday-auto-park', (req, res) => mountApi.runCommand("mount_set_everyday_auto_park", req.query, res));
        mountApi.router.get('/clear', (req, res) => mountApi.runCommand("mount_clear", req.query, res));
        return mountApi.router;
    }
}
