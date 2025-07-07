let call = async (endpoint = "", root = "https://api.roxcelic.love/api/v1/") => {
    try {
        let response = await fetch(`${root}${endpoint}`);
        let data = await response.json();

        return data;
    } catch (e) {
        return e;
    }
};

let post = async (endpoint = "", content = {}, root = "https://api.roxcelic.love/api/v1") => {
    try {
        let response = await fetch(`${root}${endpoint}`, {
            method: "POST",
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