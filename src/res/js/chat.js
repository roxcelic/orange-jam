// variables
import { openFullScreenImage } from "./house/fullScreenImages";
import { call } from "./house/api";

let api = "https://api.roxcelic.love";

let user = await call();

let elements = {
    form: document.getElementById("chat/form"),
    chat: document.getElementById("chat/chat"),
    input: document.getElementById("chat/input"),
    sendButton: document.getElementById("chat/sendButton")
}

let lastId = 0;
let previousChat;

let sendNotifs = false;

// Made by mashift -- https://marsh.zone
    // https://stackoverflow.com/a/3809435
    const URL_REGEX =/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const hydrateURLs = (element) =>
        element.innerHTML = element.innerHTML.replaceAll(URL_REGEX, (url) => `<a href="${url}" target="_blank">${url}</a>`);

// image management
    // i dont know how to use regex yayayayayyayayayayayayayyayayay america ya
    let IMG_REGEXT = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|webp|jpeg)/

    let img_url = (body) => 
        IMG_REGEXT.test(body);

    // find images
    let findImages = (body) =>
        body.split(" ").filter((word) => RegExp(IMG_REGEXT, 'g').test(word));

// embed management
    let url_url = (body) => 
        RegExp(URL_REGEX, 'i').test(body);

    let findEmbeds = (body) =>
        body.split(" ").filter((word) => URL_REGEX.test(word));

    let createEmbed = (url) => {
        let embedLink = new URL(url);
        let emebedParams = new URLSearchParams(embedLink.search);

        let searchURL = `${embedLink.hostname}/${embedLink.pathname.split('/')[1]}/`;

        let emebedURL = "";

        // base urls
        switch (embedLink.hostname) {
            case "youtu.be":
                emebedURL = `https://www.youtube.com/embed/${embedLink.pathname.split('/')[1]}`

                break;
        }

        // full urls
        if (emebedURL == "") switch (searchURL) {
            case "open.spotify.com/album/":
                emebedURL = `https://open.spotify.com/embed/album/${embedLink.pathname.split('/')[2]}`;

                break;
            case "music.youtube.com/watch/": case "www.youtube.com/watch/":
                emebedURL = `https://www.youtube.com/embed/${emebedParams.get("v")}`;

                break;
            default:
                return null;

                break;
        }

        // just in case
        let emebed = document.createElement('iframe');
        Object.assign(emebed, {
            className: "chatEmbed",
            src: emebedURL,
            height: "352"

        })
        return emebed;
    }

// functions
let sendMessage = async () => {
    try {
        let chatMessage = elements.input.value;
        elements.input.value = "";

        let message = {
            "message": chatMessage
        }
        message = JSON.stringify(message);

        let response = await fetch(`${api}/api/chat/send`, {
            method: "POST",
            body: message,
            credentials: "include",
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        });
          
        let data = await response.json();
        
        if (data.status == "unauthorised") {
            window.location.href = "/api/logon"
        }

        fetchChat();
    } catch (e) {
        console.log(e);
    }
}

// create image 
let createImage = (url, alt = "") => {
    let img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.className = "chatImage";

    img.addEventListener("click", () => {openFullScreenImage(img.src, img.getAttribute("alt"))});

    return img;
}

// make chat
let createChat = async (message) => {
    lastId = message.chatID;

    // elements
        // the wrapper
        let main = document.createElement("pre");
        main.className = "chatMessage";
        main.id = message.chatID;

        // "inner content"
        let ic = document.createElement("div");
        ic.className = "innerContent";

        // name
        let name = document.createElement("p");
        name.className = "name";

        let nameInner = document.createElement("a");
        nameInner.href = `/profile?user=${message.user.id}`

        let nameI = document.createElement("i");
        nameI.innerText = message.user.username;

    // the profile picture
        let pfp = document.createElement("div");
        if (previousChat == undefined || previousChat.user.id != message.user.id) {
            pfp.className = "profilePicture";
            pfp.style.backgroundImage = `url('${api}${message.user.pfp}')`;
        } else {
            ic.style.marginLeft = "60px";
            ic.style.marginBottom = "0px";

            main.style.margin = "0";
            main.style.marginTop = "-10px";

            name.style.display = "none";
        }

    // inner content
        let content = document.createElement("p");
        content.className = "content";
        content.innerText = message.message;


    // images / urls / embeds
    let imgContainer = null;
    let removeContent = () => {
        ic.style.minHeight = "0px";
        content = document.createElement("div");
    }

        hydrateURLs(content);
        if (img_url(message.message)) {
            imgContainer = document.createElement("div");
            imgContainer.className = "chatImageWrapper";

            findImages(message.message).forEach(image => {
                if (message.message.replaceAll(" ", "") == image) removeContent();

                imgContainer.appendChild(createImage(image));
            });
        }

        if (url_url(message.message)) {
            // make image container if its null
            if (!imgContainer) {
                imgContainer = document.createElement("div");
                imgContainer.className = "chatImageWrapper";
            }

            // find urls
            findEmbeds(message.message).forEach(url => {
                let emb = createEmbed(url);
                if (emb) {
                    if (message.message == url) removeContent();

                    imgContainer.appendChild(emb);
                }
            })
        }

    // build
        nameInner.appendChild(nameI);
        name.appendChild(nameInner);
        ic.appendChild(name);
        ic.appendChild(content);
        main.appendChild(pfp);
        main.appendChild(ic);

        if (imgContainer) main.appendChild(imgContainer);

        elements.chat.appendChild(main);
        
        elements.chat.scrollTop = elements.chat.scrollHeight;

        previousChat = message;

    // extra 
        // delete -- doesnt work fully as intented i dont think 
        // notifaction
        console.log(`attempting to send a notifaction, page minimised? ${sendNotifs}`);
        if (sendNotifs) {
            console.log("sending notifaction..");
            let notification = new Notification(`new message from ${message.user.username}`, { body:  message.message});
        }
};

let fetchChat = async () => {
    try {
        console.log('refreshing...');
        let response = await fetch(`${api}/api/chat/view`, {
            credentials: "include"
        });
        let data = await response.json();
    
        let workingdata = data.chat.reverse();
        let finalChat = [];
    
        for (let i = 0; i < workingdata.length; i++) {
            if (workingdata[i].chatID > lastId) finalChat.push(workingdata[i]);
            else break;
        } 
    
        finalChat.reverse().forEach(chat => {
            createChat(chat);
        });
    } catch (e) {
        console.log(e);
    }

}

// run
elements.chat.focus();
elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage()
});

setInterval(() => {fetchChat()}, 1000)

// notifaction management
let allowNotifactions = () => {
    if (!("Notification" in window)) {
        return;
    }

    Notification.requestPermission((result) => {
        console.log(`notifaction acces: ${result}`);
    });
}

// :3
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        sendNotifs = true;
    } else {
        sendNotifs = false;
    }
});

allowNotifactions();