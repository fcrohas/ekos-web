import { Storage } from './services/storage.js';
import { HttpServer } from './services/http.js';
import { WebSocket } from './services/websocket.js';

export default class Application {
    constructor() {
        this.cmdArgs = this.parseArgs(process.argv);
        this.storage = new Storage(this.cmdArgs['rootPath']);
        this.websocket = new WebSocket();
        this.web = new HttpServer({
            webpath: this.cmdArgs['httpPath'],
            port: this.cmdArgs['httpPort'],
            storage: this.storage,
            websocket: this.websocket
        });

    }

    parseArgs(args) {
        // remove command executable
        // and filename
        const argsByName = [];
        const params = args.slice(2);
        let c = 0;
        while ( c < params.length) {
            switch(params[c]) {
                case '--rootPath':
                    argsByName['rootPath'] = params[c+1];
                    c+=2;
                    break;
                case '--httpPath':
                    argsByName['httpPath'] = params[c+1];
                    c+=2;
                    break;
                case '--httpPort':
                    argsByName['httpPort'] = params[c+1];
                    c+=2;
                    break;
            }
        }
        return argsByName;
    }

    async run() {
        await this.web.start();
    }
}

const app = new Application();

await app.run();
