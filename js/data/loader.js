import { adapterSeverData } from "./data-adapter";
import {results, tracks} from "./mock";

const OLD_SERVER_URL = `https://es.dump.academy/guess-melody`;
const SERVER_URL = `https://guessmelody.anatoly-dolgov.ru/assets/`;
// `https://guessmelody.anatoly-dolgov.ru/assets/save_result.php`;
// `https://guessmelody.anatoly-dolgov.ru/assets/get_data.php?results`;
const APP_ID = 22101989;
const checkStatus = (response) => {
    if (response.ok) {
        return response;
    } else {
        throw new Error(`${response.status}: ${response.statusText}`);
    }
};

const toJSON = (res) => res.json();

export default class Loader {
    static async loadData() {
        let result;
        try {
            const response = checkStatus(await fetch(`${SERVER_URL}get_data.php?questions`));
            result = toJSON(response);
        }
        catch (e) {
            throw new Error(e.message);
        }
        return result;
    }
    static async loadResults() {        
        let result = [...results];
        // try {
        //     // const response = checkStatus(await fetch(`${SERVER_URL}/stats/${APP_ID}`));
        //     const response = checkStatus(await fetch(`${SERVER_URL}get_data.php?results`));
        //     result = toJSON(response);
        // }
        // catch (e) {
        //     throw new Error(e.message);
        // }
        return result;
    }
    static async saveResults(data) {
        const requestSettings = {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': `application/json`
            },
            method: `POST`
        };        
        let response = {
            ok: true
        };
        // try {
        //     // response = checkStatus(await fetch(`${SERVER_URL}/stats/${APP_ID}`, requestSettings));
        //     response = checkStatus(await fetch(`${SERVER_URL}save_result.php`, requestSettings));          
        // }
        // catch (e) {
        //     throw new Error(e.message);
        // }
        return response.ok;
    }
}