import { call, post } from "./house/api";

const params = new URLSearchParams(window.location.search);
let target = params.get("user");


let data = await call();

let user = undefined;
if(target) {

    user = await call(`users/${target}`);

    if (user instanceof Error || !user?.username) user = await call("user");
}
else user = await call("user");


// if not logged in login
if (!data.loggedIn && !target) window.location.href = "/api/logon";

let elements = {
    title: document.getElementById("profile/title"),
    pfp: document.getElementById("profile/pfp"),
    username: document.getElementById("profile/username"),
    pronouns: document.getElementById("profile/pronouns"),
    bio: document.getElementById("profile/bio"),
    edit: {
        self: document.getElementById("profile/edit"),
        pfpEdit: {
            form: document.getElementById("profile/pfp/form"),
            file: document.getElementById("profilePictureUpload"),
            display: document.getElementById("profilePictureUploadDisplay"),
            save :document.getElementById("profilePictureUploadButton")
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
        }
    }
}

// load base
elements.username.innerText = user.username;
elements.pronouns.innerText = user?.pronouns || "";
elements.bio.innerText = user.bio;
elements.pfp.src = `https://api.roxcelic.love/api/users/${user.id}/pfp`;

function loadEdit(data) {
    // pfp
    elements.edit.pfpEdit.file.addEventListener("change", () => {
        let image = elements.edit.pfpEdit.file.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(image);

        fileReader.onload = (fileReaderEvent) => {
            elements.edit.pfpEdit.display.style.backgroundImage = `url(${fileReaderEvent.target.result})`;
        }

        elements.edit.pfpEdit.save.disabled = false;
    });

    async function uploadPfp(e) {
        e.preventDefault();
        elements.edit.pfpEdit.form.disabled = true;

        let formData = new FormData(elements.edit.pfpEdit.form);

        try {
            let response = await fetch(`https://api.roxcelic.love/api/account/uploadProfilePicture`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            let data = await response.json();
            if (data instanceof Error) alert(data);
            else if (data.status == "unauthorised") alert("unauthorised, sorry but youll have to log in");
            else window.location.reload();
            
        } catch (e) {
            alert(e);
        }
        
        elements.edit.pfpEdit.form.disabled = false;
    }

    elements.edit.pfpEdit.form.addEventListener('submit', uploadPfp)

    // username
    elements.edit.usernameEdit.input.value = data.username; 
    elements.edit.usernameEdit.input.addEventListener("change", () => {
        elements.edit.usernameEdit.save.disabled = false;
    });
    elements.edit.usernameEdit.save.addEventListener("click", async (e) => {
        elements.edit.pronounsEdit.save.disabled = true;

        let res = await post("account/editAccountData", [["username", elements.edit.usernameEdit.input.value]]);
        if (res instanceof Error) alert(res);
        else if (res.status == "unauthorised") alert("unauthorised, sorry but youll have to log in");
        else window.location.reload();
        
        elements.edit.pronounsEdit.save.disabled = false;        
    });

    // pronouns
    elements.edit.pronounsEdit.input.value = data?.pronouns || ""; 
    elements.edit.pronounsEdit.input.addEventListener("change", () => {
        elements.edit.pronounsEdit.save.disabled = false;
    });
    elements.edit.pronounsEdit.save.addEventListener("click", async (e) => {
        elements.edit.pronounsEdit.save.disabled = true;

        let res = await post("account/editAccountData", [["pronouns", elements.edit.pronounsEdit.input.value]]);
        if (res instanceof Error) alert(res);
        else if (res.status == "unauthorised") alert("unauthorised, sorry but youll have to log in");
        else window.location.reload();
        
        elements.edit.pronounsEdit.save.disabled = false;        
    });

    // bio
    elements.edit.bioEdit.input.value = data.bio || ""; 
    elements.edit.bioEdit.input.addEventListener("change", () => {
        elements.edit.bioEdit.save.disabled = false;
    });
    elements.edit.bioEdit.save.addEventListener("click", async (e) => {
        elements.edit.bioEdit.save.disabled = true;

        let res = await post("account/editAccountData", [["bio", elements.edit.bioEdit.input.value]]);
        if (res instanceof Error) {
            alert(res);
        }
        else if (res.status == "unauthorised") alert("unauthorised, sorry but youll have to log in");
        else window.location.reload();
        
        elements.edit.bioEdit.save.disabled = false;        
    });
}

if (!target && data.loggedIn) {
    elements.title.innerText = `Hello, ${user.username},`;
    loadEdit(user);
}
else {
    elements.title.innerText = `${user.username},`;
    elements.edit.self.style.display = "none";
}