import Config from "./config"
import axios from "axios"

export default class ProfileApi {

    static start(name) {
        return axios.post(Config.serverUrl() + '/api/profiles/' + name + '/start')
    }

    static stop(name) {
        return axios.post(Config.serverUrl() + '/api/profiles/' + name + '/stop')
    }
}
