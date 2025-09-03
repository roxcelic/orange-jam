import { call, post } from "../house/api";
import { config } from "../config";

const params = new URLSearchParams(window.location.search);
let target = params.get("user");


let userData = await call();

let user = undefined;
if(target) {
    user = await call(`users/${target}`);
    if (user instanceof Error || !user?.username) user = await call("user");
}

else user = await call("user");


// if not logged in login
if (!userData.loggedIn && !target) window.location.href = "/api/login";

let elements = {
    title: document.getElementById("profile/title"),
    pfp: document.getElementById("profile/pfp"),
    banner: document.getElementById("profile/banner"),
    username: document.getElementById("profile/username"),
    pronouns: document.getElementById("profile/pronouns"),
    bio: document.getElementById("profile/bio"),
    web: document.getElementById("profile/web"),
    edit: {
        self: document.getElementById("profile/edit"),
        pfpEdit: {
            form: document.getElementById("profile/pfp/form"),
            file: document.getElementById("profilePictureUpload"),
            display: document.getElementById("profilePictureUploadDisplay"),
            save :document.getElementById("profilePictureUploadButton")
        },
        bannerEdit: {
            form: document.getElementById("profile/banner/form"),
            file: document.getElementById("profileBannerUpload"),
            display: document.getElementById("profileBannerUploadDisplay"),
            save :document.getElementById("profileBannerUploadButton")
        },
        usernameEdit: {
            input: document.getElementById("profile/username/input"),
            save: document.getElementById("profile/username/save")
        },
        pronounsEdit: {
            input: document.getElementById("profile/pronouns/input"),
            save: document.getElementById("profile/pronouns/save")
        },
        bioEdit: {
            input: document.getElementById("profile/bio/input"),
            save: document.getElementById("profile/bio/save")
        },
        webEdit: {
            input: document.getElementById("profile/website/input"),
            save: document.getElementById("profile/website/save")
        }
    }
}

// load base
elements.username.innerText = user.username;
elements.pronouns.innerText = user?.pronouns || "";
elements.bio.innerText = user.bio;
elements.pfp.src = `${config.api}/api/users/${user.id}/pfp`;
elements.banner.style.backgroundImage = `url('${config.api}/api/users/${user.id}/banner')`;
elements.web.href = user.website;

function loadEdit(data) {
    // pfp

    async function displayNewImage(elements) {
        let image = elements.file.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(image);

        fileReader.onload = (fileReaderEvent) => {
            elements.display.style.backgroundImage = `url(${fileReaderEvent.target.result})`;
        }

        elements.save.disabled = false;
    }

    async function uploadPfp(e, elements, endpoint) {
        elements.form.disabled = true;

        let formData = new FormData(elements.form);

        try {
            let response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            let data = await response.json();
            if (data instanceof Error) alert(data);
            else if (data.status == "unauthorised") alert("unauthorised, sorry but youll have to log in");
            else {
                window.location.reload();
            }
            
        } catch (e) {
            alert(e);
            console.log(e);
        }
        
        elements.form.disabled = false;
    }

    elements.edit.pfpEdit.file.addEventListener("change", () => {displayNewImage(elements.edit.pfpEdit)});
    elements.edit.pfpEdit.form.addEventListener('submit', (e) => {
        e.preventDefault();
        uploadPfp(e, elements.edit.pfpEdit, `${config.api}/api/account/uploadProfilePicture`)
    });

    elements.edit.bannerEdit.file.addEventListener("change", () => {displayNewImage(elements.edit.bannerEdit)});
    elements.edit.bannerEdit.form.addEventListener('submit', (e) => {
        e.preventDefault();
        uploadPfp(e, elements.edit.bannerEdit, `${config.api}/api/account/uploadBanner`)
    });

    console.log(data);
    inject(elements.edit.webEdit, "website_link", data.website || "");
    inject(elements.edit.bioEdit, "bio", data.bio || "");
    inject(elements.edit.pronounsEdit, "pronouns", data.pronouns || "");
    inject(elements.edit.usernameEdit, "username", data.username || "");
}

function inject(el, send, def) {
    el.input.value = def; 
    el.input.addEventListener("change", () => {
        el.save.disabled = false;
    });

    el.save.addEventListener("click", async (e) => {
        el.save.disabled = true;

        let res = await post("account/editAccountData", [[send, el.input.value]]);
        if (res instanceof Error) {
            alert(res);
        }

        else if (res.status == "unauthorised") alert("unauthorised, sorry but youll have to log in");
        else window.location.reload();
        
        el.save.disabled = false;        
    });
}

if ((!target || target == userData.username) && userData.loggedIn) {
    elements.title.innerText = `Hello, ${user.username},`;
    loadEdit(user);
}
else {
    elements.title.innerText = `${user.username},`;
    elements.edit.self.style.display = "none";
}
