import { config } from "../config";

let call = async (endpoint = "", root = `${config.api}/api/`) => {
    try {
        let response = await fetch(`${root}${endpoint}`, {
            credentials: "include"
        });
        let data = await response.json();

        return data;
    } catch (e) {
        return e;
    }
};

let post = async (endpoint = "", content = {}, root = `${config.api}/api/`) => {
    try {
        let response = await fetch(`${root}${endpoint}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(content)
        });
        let data = await response.json();

        return data;
    } catch (e) {
        return e;
    }
};

export {call, post};