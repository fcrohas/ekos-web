import { WebSocketServer } from "ws";
import { URL, URLSearchParams } from "url";

export class WebSocket {
    static #CLOUD = "/cloud/ekos";
    static #MEDIA = "/media/ekos";
    static #MESSAGE = "/message/ekos";
    static #UI = "/socket/ui";
    static #DATA = "/socket/data";
    static #socketPaths = [WebSocket.#CLOUD, WebSocket.#MEDIA, WebSocket.#MESSAGE, WebSocket.#UI, WebSocket.#DATA];

    constructor(http) {
        this.eventFilter = [];
    }

    setupSocket(http) {
        this.sockets = [];
        WebSocket.#socketPaths.forEach( (name) => {
            this.sockets[name] = new WebSocketServer({
                noServer: true,
                path: name
            });
            this.sockets[name].on( "connection", (connection, request) => {
                this.onConnection(name, connection, request);
            });
        })
        http.on("upgrade", (request, socket, head) => this.onUpgrade(request, socket, head));
    }

    onUpgrade(request, socket, head) {
        const url = new URL(request.url, "http://localhost:3000");
        this.sockets[url.pathname].handleUpgrade(request, socket, head, (websocket) => this.doUpgrade(url.pathname, websocket, request, socket));
    }

    doUpgrade(pathname, websocket, request, socket) {
        if (this.sockets[pathname] != undefined) {
            this.sockets[pathname].emit("connection", websocket, request);
        } else {
            socket.destroy();
        }
    }

    onConnection(name, connection, request) {
        const [_path, params] = request?.url?.split("?");
        const connectionParams = new URLSearchParams(params);
        connection.on("message", (message) => this.onMessage(name, message, connection, connectionParams));
        connection.on("close", (message) => console.log(name, " closed..."));
        if (name == WebSocket.#MEDIA) {
            console.log("Configure media !");
            this.sendMedia({ type: "set_blobs", payload: true } );
        }
    }

    onMessage(name, message, connection, connectionParams) {
        if (name == WebSocket.#MEDIA) {
            this.sendDataUi(message)
        } else {
            const parsedMessage = JSON.parse(message);
            // check where to send event
            let notFound = true;
            Object.keys(this.eventFilter).forEach((key) => {
                if (parsedMessage.type.startsWith(key)) {
                    this.eventFilter[key](parsedMessage);
                    notFound = false;
                }
            })
            // when client is online
            // configure it
            if (parsedMessage.payload.online) {
                if (name == WebSocket.#MESSAGE) {
                    console.log("Configure image xfer !");
                    this.sendMessage({ type: "option_set_image_transfer", payload: { value : true } } );
                }
            }
            if (notFound) {
                //console.log(name,'=', JSON.parse(message));
            }
        }
    }

    registerFilter(filters, event) {
        filters.forEach( filter => {
            this.eventFilter[filter] = event;
        });
    }

    toJSON(msg) {
        return JSON.stringify(msg, (key,value) => {
            if (typeof value === 'string') {
                if (value.startsWith('[') && value.endsWith(']')) {
                    // Array received, split it
                    value = value.replace("[",'');
                    value = value.replace("]",'');
                    const values = value.split(',');
                    return values;
                } else {
                    if (value.indexOf('.') !== -1) {
                        const newFloatValue = parseFloat(value);
                        if (isNaN(newFloatValue)) {
                            return value;
                        } else {
                            console.log(key, ' is float=', newFloatValue)
                            return newFloatValue;
                        }
                    } else {
                        const newIntValue = parseInt(value);
                        if (!isNaN(newIntValue)) {
                            console.log(key, ' is int=', newIntValue)
                            return newIntValue;
                        } else {
                            return value;
                        }
                    }
                }
            }
            return value;
        });
    }

    sendMessage(msg) {
        this.sockets[WebSocket.#MESSAGE].clients.forEach( client => {
            client.send(this.toJSON(msg), { binary: false });
        });
    }

    sendMedia(msg) {
        this.sockets[WebSocket.#MEDIA].clients.forEach( client => {
            client.send(this.toJSON(msg), { binary: false });
        });
    }

    sendCloud(msg) {
      this.sockets[WebSocket.#CLOUD].clients.forEach( client => {
          client.send(JSON.stringify(msg), { binary: false });
      });
    }

    sendUi(msg) {
        this.sockets[WebSocket.#UI].clients.forEach( client => {
            client.send(JSON.stringify(msg), { binary: false });
        });
    }

    sendDataUi(data) {
        this.sockets[WebSocket.#DATA].clients.forEach( client => {
            client.send(data, { binary: true });
        });
    }
}
