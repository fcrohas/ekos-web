import Config from "./config"
import axios from "axios"

export default class CaptureApi {

    static capture( parameters) {
        axios.post(Config.serverUrl() + '/api/capture/preview',null, { params : parameters }).then( (response) => {
            console.log('Capture preview', response.data)
        })
    }

    static start() {
        axios.post(Config.serverUrl() + '/api/capture/start').then( (response) => {
            console.log('Capture started', response.data)
        })
    }

    static stop() {
        axios.post(Config.serverUrl() + '/api/capture/stop').then( (response) => {
            console.log('Capture stop', response.data)
        })
    }
}
