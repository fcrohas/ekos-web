export default class SocketUi {
    static #instance = null;

    constructor(options) {
        this.messageConn = new WebSocket("ws://" + options.host + ":" + options.port + "/socket/ui")
        this.dataConn = new WebSocket("ws://" + options.host + ":" + options.port + "/socket/data")
        // Prepare events
        this.events = []
        this.dataEvents = []
        // message channel
        this.messageConn.onopen = (event) => this.onOpen(event)
        this.messageConn.onmessage = (message) => this.onMessage(message)
        this.messageConn.onclose = () => this.onClose()
        // data channel
        this.dataConn.binaryType = 'arraybuffer';
        this.dataConn.onopen = (event) => this.onOpen(event)
        this.dataConn.onmessage = (message) => this.onData(message)
        this.dataConn.onclose = () => this.onClose()
    }

    static getInstance(options) {
        if (SocketUi.#instance == null) {
            SocketUi.#instance = new SocketUi(options)
        }
        return SocketUi.#instance;
    }

    registerEvent(filters, callback) {
        if (filters.length >0 ) {
            filters.forEach( filter => {
                if (this.events[filter] == undefined) {
                    this.events[filter] = []
                }
                this.events[filter].push(callback)
            })
        }
    }

    registerDataEvent(callback) {
        this.dataEvents.push(callback)
    }

    onMessage(message) {
        // Call the register callback
        console.log('message=', message.data)
        const parsedMessage = JSON.parse(message.data)
        Object.keys(this.events).forEach( filter => {
            if (parsedMessage.type != undefined && parsedMessage.type.startsWith(filter)) {
                this.events[filter].forEach(callback => callback(parsedMessage))
            }
        })
    }

    onData(message) {
        // Call the register callback
        this.dataEvents.forEach( callback => {
            callback(message.data)
        })
    }

    onOpen(event) {
        console.log(event)
        console.log("Successfully connected to the echo websocket server...")
    }

    onClose() {
        console.log("Connection closes...")
    }
}
