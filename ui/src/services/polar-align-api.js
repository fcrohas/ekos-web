import Config from "./config"
import axios from "axios"

export default class PolarAlignApi {

    static resetView() {
        axios.post(Config.serverUrl() + '/api/pah/reset-view').then( (response) => {
            console.log('Capture reset view', response.data)
        })
    }

    static start() {
        axios.post(Config.serverUrl() + '/api/pah/start').then( (response) => {
            console.log('Capture started', response.data)
        })
    }

    static stop() {
        axios.post(Config.serverUrl() + '/api/pah/stop').then( (response) => {
            console.log('Capture stop', response.data)
        })
    }

    static refresh(refreshValue) {
        axios.post(Config.serverUrl() + '/api/pah/refresh', null, { params : {value : refreshValue}}).then( (response) => {
            console.log('Capture preview', response.data)
        })
    }

    static refreshDone() {
        axios.post(Config.serverUrl() + '/api/pah/refresh-done').then( (response) => {
            console.log('Capture preview', response.data)
        })
    }

    static setCrossHair(x,y) {
        axios.post(Config.serverUrl() + '/api/pah/set-crosshair', null, { params : {x : x, y: y}}).then( (response) => {
            console.log('Capture preview', response.data)
        })
    }

    static selectDone() {
        axios.post(Config.serverUrl() + '/api/pah/select-done').then( (response) => {
            console.log('Capture preview', response.data)
        })
    }

    static setZoom(scaleValue) {
        axios.post(Config.serverUrl() + '/api/pah/set-zoom', null, { params : {scale : scaleValue}}).then( (response) => {
            console.log('Capture preview', response.data)
        })
    }

    static slewDone() {
        axios.post(Config.serverUrl() + '/api/pah/slew-done').then( (response) => {
            console.log('Capture preview', response.data)
        })
    }
}
