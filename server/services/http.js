import express from 'express';
import cors from 'cors';
import Busboy from 'busboy';
import logger from 'morgan';
import { MountApi } from './http/mount.js';
import { ProfilesApi } from './http/profiles.js';
import { CaptureApi } from './http/capture.js';
import { StatesApi } from './http/states.js';
import { FocusApi } from './http/focus.js';
import { PolarAlignApi } from './http/polar-align.js';
import { AuthenticateApi } from './http/authenticate.js';
import {GuideApi} from './http/guide.js';
import {DomeApi} from './http/dome.js';
import {AlignApi} from './http/align.js';
import {AstroApi} from './http/astro.js';

const corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
};

export class HttpServer {
    constructor(context) {
        this.http = express();
        this.http.use(express.json({ limit: '10mb', extended: true}));
        //this.http.use(bodyParser.raw());
        this.http.use(cors(corsOptions));
        logger.token('type', (req, res) => { return req.headers['content-type'] });
        //this.http.use(logger('[:date[iso]] [ACCESS] :remote-addr - ":method :url HTTP/:http-version" :status :type :res[content-length] :response-time ms'));
        this.options = context;
    }

    registerRoute(path, router) {
        this.http.use(path, router);
    }

    async start() {
        // Register all routes
        this.registerRoute(MountApi.mountPath(), MountApi.register(this.options));
        this.registerRoute(StatesApi.mountPath(), StatesApi.register(this.options));
        this.registerRoute(FocusApi.mountPath(), FocusApi.register(this.options));
        this.registerRoute(ProfilesApi.mountPath(), ProfilesApi.register(this.options));
        this.registerRoute(CaptureApi.mountPath(), CaptureApi.register(this.options));
        this.registerRoute(PolarAlignApi.mountPath(), PolarAlignApi.register(this.options));
        this.registerRoute(GuideApi.mountPath(), GuideApi.register(this.options));
        this.registerRoute(DomeApi.mountPath(), DomeApi.register(this.options));
        this.registerRoute(AlignApi.mountPath(), AlignApi.register(this.options));
        this.registerRoute(AstroApi.mountPath(), AstroApi.register(this.options));
        this.registerRoute(AuthenticateApi.mountPath(), AuthenticateApi.register({storage:this.options.storage}));
        // Prepare website ui
        this.http.use(express.static(this.options.webpath));
        // Start http listener
        const server = await this.http.listen(this.options.port);
        // Prepare websocket
        this.options.websocket.setupSocket(server);
        console.info('Listenning to HTTP port', this.options.port);
    }

    process( req, res, next) {
        if (req.headers['content-type']!== undefined && req.headers['content-type'].indexOf('multipart') !== -1) {
            var busboy = new Busboy({ headers: req.headers });
            const multipart = {};
            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                multipart[fieldname] = { filename: filename, mimetype: mimetype };
                const chunk = [];
                file.on('data', (data) => {
                    chunk.push(data);
                });
                file.on('end', () => {
                    console.log('File [' + fieldname + '] Finished');
                    multipart[fieldname].data = Buffer.concat(chunk);
                });
            });
            busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
                console.log('Field [' + fieldname + ']: value: ' + inspect(val));
            });
            busboy.on('finish', () => {
                if (this.request !== null && this.request !== undefined) {
                    this.request(req.query, req.method, req.url, req.headers, multipart, res);
                } else {
                    res.status(500).send({humanMessage: 'RabbitMQ connection may be lost', systemMessage: ''})
                }
            });
            req.pipe(busboy);
        } else {
            next();
        }
    }
}
