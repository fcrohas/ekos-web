import Config from "./config"
import axios from "axios"

export default class DeviceApi {
    static cameras() {
        axios.get(Config.serverUrl() + '/api/devices/cameras').then((response) => {
            console.log('Align started', response.data)
        })
    }

    static mounts() {
        axios.get(Config.serverUrl() + '/api/devices/mounts').then((response) => {
            console.log('Align started', response.data)
        })
    }

}
