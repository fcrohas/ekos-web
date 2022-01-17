import Config from "./config"
import axios from "axios"

export default class FocusApi {
    static capture() {
        axios.post(Config.serverUrl() + '/api/focus/capture').then((response) => {
            console.log('Focus capture', response.data)
        })
    }

    static start() {
        axios.post(Config.serverUrl() + '/api/focus/start').then((response) => {
            console.log('Focus started', response.data)
        })
    }

    static stop() {
        axios.post(Config.serverUrl() + '/api/focus/stop').then((response) => {
            console.log('Focus stop', response.data)
        })
    }
}
