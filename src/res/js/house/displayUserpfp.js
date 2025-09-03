import { call } from "./api";
import { config } from "../config";

export async function displayUserPfp() {
    let data = await call();
    console.log(data);
    if (data.loggedIn) {
        let pfp = document.getElementById("user_profile_pciture");
        pfp.src = `${config.api}/api/users/${data.username}/pfp`;
        console.log("hi");
    }
}