import { BaseRouter } from './base-router.js';

export class AstroApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/astro";
    }

    static register(context) {
        const astroApi = new AstroApi(context);
        astroApi.router.get('/get-almanac', (req, res) => astroApi.runCommandAndWait('astro_get_almanac', req.query, res));
        astroApi.router.get('/search-objects', (req, res) => astroApi.runCommandAndWait('astro_search_objects', req.query, res));
        astroApi.router.get('/get-objects-info', (req, res) => astroApi.runCommandAndWait('astro_get_objects_info', req.query, res));
        astroApi.router.get('/get-objects-image', (req, res) => astroApi.runCommandAndWait('astro_get_objects_image', req.query, res));
        astroApi.router.get('/get-objects-observability', (req, res) => astroApi.runCommandAndWait('astro_get_objects_observability', req.query, res));
        astroApi.router.get('/get-objects-riseset', (req, res) => astroApi.runCommandAndWait('astro_get_objects_riseset', req.query, res));
        // Prepare websocket event
        context.websocket.registerFilter(['astro_'], (message) => astroApi.onRegisterEvent(message));
        return astroApi.router;
    }
}
