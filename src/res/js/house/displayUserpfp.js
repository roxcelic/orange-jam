import { call } from "./api";

export async function displayUserPfp() {
    let data = await call();
    console.log(data);
    if (data.loggedIn) {
        let pfp = document.getElementById("user_profile_pciture");
        pfp.src = `https://api.roxcelic.love/api/users/${data.username}/pfp`;
        console.log("hi");
    }
}