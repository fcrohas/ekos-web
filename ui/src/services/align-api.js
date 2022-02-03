import Config from "./config"
import axios from "axios"

export default class AlignApi {
    static start() {
        axios.post(Config.serverUrl() + '/api/align/solve').then((response) => {
            console.log('Align started', response.data)
        })
    }

    static stop() {
        axios.post(Config.serverUrl() + '/api/align/stop').then((response) => {
            console.log('Align stop', response.data)
        })
    }
}
