import Config from "./config"
import axios from "axios"
import SocketUi from "@/services/websocket";

export default class States {

    static #instance = null

    static getInstance() {
        if (States.#instance === null) {
            States.#instance = new States()
        }
        return this.#instance
    }
    static start(name) {
        return axios.post(Config.serverUrl() + '/api/profiles/' + name + '/start')
    }

    static stop(name) {
        return axios.post(Config.serverUrl() + '/api/profiles/' + name + '/stop')
    }

    constructor() {
        this.states = []
        const ws = SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
        ws.registerEvent(['new_'], (event) => this.onEvent(event))
        this.events = []
    }

    onEvent(message) {
        if (message != undefined) {
            this.parse(message)
        }
    }

    registerEvent(event, callback) {
        if (this.events[event] == undefined) {
            this.events[event] = []
        }
        this.events[event].push(callback)
    }

    parse(message) {
        if (this.states[message.type] == undefined) {
            this.states[message.type] = {}
        }
        this.states[message.type] = Object.assign(this.states[message.type], message.payload)
        Object.keys(this.events).forEach( event => {
            if (message.type === event) {
                if (this.events[event] != undefined && this.events[event].length > 0) {
                    this.events[event].forEach(callback => callback(this.states[message.type]))
                }
            }
        })
    }

    getMount() {
        return this.states['new_mount_state']
    }

    getCamera() {
        return this.states['new_camera_state']
    }

    getGuide() {
        return this.states['new_guide_state']
    }

    getFocus() {
        return this.states['new_focus_state']
    }

    getCapture() {
        return this.states['new_capture_state']
    }

    getAlign() {
        return this.states['new_align_state']
    }

    getPolar() {
        return this.states['new_polar_state']
    }

    getConnection() {
        return this.states['new_connection_state']
    }
}
