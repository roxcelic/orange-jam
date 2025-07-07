import { call } from "./api";

export let documentContent = {
    "Home": {
        items: [
            {
                elementId: "title",
                speed: 3,
                stop: false,
                signifier: "_",
                text: async () => {
                    return `hoiiii`;
                }
            },
            {
                elementId: "content",
                speed: 3,
                stop: true,
                signifier: "_",
                text: async () => {
                    return "you can now connect to the api look!!";
                }
            },
            {
                elementId: "content2",
                speed: 3,
                stop: true,
                signifier: "_",
                text: async () => {
                    let spotifyApi = await call("spotify");
                    return `api status: ${(await call()).status == "online" ? `connected and heres a demo, you can see im listening to ${spotifyApi == null ? "nothing ):" : `${spotifyApi.track.title} by ${spotifyApi.album.artists[0].name}!`}` : "disconnected"}`;
                }
            },
            {
                elementId: "content3",
                speed: 3,
                stop: true,
                signifier: "_",
                text: async () => {
                    let adminApi = await call("admin");
                    return `${(await call()).status == "online" ? `admin status: ${adminApi.status == undefined ? 0 : 1}` : "" }`;
                }
            },
        ]
    }
};