export default class Config {

    static serverUrl() {
        return 'http://' + Config.host() + ':' + Config.port()
    }

    static host() {
        return 'localhost'
    }

    static port() {
        return '3000'
    }

}
