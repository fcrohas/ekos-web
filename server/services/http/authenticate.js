import { BaseRouter } from './base-router.js';

export class AuthenticateApi extends BaseRouter {

    constructor(context) {
        super();
        this.context = context;
    }

    static mountPath() {
        return "/api/authenticate";

    }

    static register(context) {
        const baseRouter = new BaseRouter();
        const authenticateApi = new AuthenticateApi(context);
        baseRouter.router.post('/', (req, res) => authenticateApi.login(req, res));
        return baseRouter.router;
    }

    login(req, res) {
        console.log(req.data);
        res.status(200).send({
            "token": "TOKEN",
            "success": true,
        });
    }
}
