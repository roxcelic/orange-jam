import { config } from "../config";
import { openFullScreenImage } from "../house/fullScreenImages";
// extras
//#region extras 

export let elements = {
    form: document.getElementById("chat/form"),
    chat: document.getElementById("chat/chat"),
    input: document.getElementById("chat/input"),
    sendButton: document.getElementById("chat/sendButton"),
    chatFunction: document.getElementById("chatFunctionSelect")
}

let createImage = (url, alt = "") => {
    let img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.className = "chatImage";

    img.addEventListener("click", () => {openFullScreenImage(img.src, img.getAttribute("alt"))});

    return img;
}

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

//#endregion

// chat building
//#region chat building
let createChatBody = (message) => {
    let el = {}

    el.main = document.createElement("pre");
    el.main.className = "chatMessage";
    el.main.id = message.chatID;

    el.ic = document.createElement("div");
    el.ic.className = "innerContent";

    el.name = document.createElement("p");
    el.name.className = "name";

    el.nameInner = document.createElement("a");
    el.nameInner.href = `/profile?user=${message.user.id}`

    el.nameI = document.createElement("i");
    el.nameI.innerText = message.user.username;

    el.imgContainer = null;

    return el;
}

let createChatPfp = (message, chatBody, previousChat) => {
    chatBody.pfp = document.createElement("div");

    if (previousChat == undefined || previousChat.user.id != message.user.id) {
        chatBody.pfp.className = "profilePicture";
        chatBody.pfp.style.backgroundImage = `url('${config.api}${message.user.pfp}')`;
    } else {
        chatBody.ic.style.marginBottom = "0px";
        chatBody.main.style.margin = "0";
        chatBody.main.style.marginTop = "-10px";
        chatBody.name.style.display = "none";
    }

    return chatBody;
}

let createChatContent = (message, chatBody) => {
    chatBody.content = document.createElement("p");
    chatBody.content.className = "content";
    chatBody.content.innerText = message.message;

    return chatBody;
}

let removeContent = (chatBody) => {
    chatBody.ic.style.minHeight = "0px";
    chatBody.content = document.createElement("div");

    return chatBody;
}
//#endregion

// embeds / images
//#region embeds / images
let findImagesWithin = (message, chatBody) => {
    if (img_url(message.message)) {
        chatBody.imgContainer = document.createElement("div");
        chatBody.imgContainer.className = "chatImageWrapper";

        findImages(message.message).forEach(image => {
            if (message.message.replaceAll(" ", "") == image) chatBody = removeContent(chatBody);

            chatBody.imgContainer.appendChild(createImage(image));
        });
    }

    return chatBody;
}

let findAccessabledEmbeds = (message, chatBody) => {
    if (url_url(message.message)) {
        // make image container if its null
        if (!chatBody.imgContainer) {
            chatBody.imgContainer = document.createElement("div");
            chatBody.imgContainer.className = "chatImageWrapper";
        }

        // find urls
        findEmbeds(message.message).forEach(url => {
            let emb = createEmbed(url);
            if (emb) {
                if (message.message == url) chatBody = removeContent(chatBody);

                chatBody.imgContainer.appendChild(emb);
            }
        })
    }

    return chatBody;
}

let finalise = (chatBody) => {
    // build
    chatBody.nameInner.appendChild(chatBody.nameI);
    chatBody.name.appendChild(chatBody.nameInner);
    chatBody.ic.appendChild(chatBody.name);
    chatBody.ic.appendChild(chatBody.content);
    chatBody.main.appendChild(chatBody.pfp);
    chatBody.main.appendChild(chatBody.ic);

    if (chatBody.imgContainer) chatBody.main.appendChild(chatBody.imgContainer);

    return chatBody.main;
}
//#endregion

// main chat function
//#region main chat
export let createChat = (message, previousChat, sendNotifs) => {
    let chatBody = createChatPfp(message, createChatBody(message), previousChat);
    chatBody = createChatContent(message, chatBody);

    // urls / embeds / images
    hydrateURLs(chatBody.content);
    
    // find images
    chatBody = findImagesWithin(message, chatBody);
    chatBody = findAccessabledEmbeds(message, chatBody);

    chatBody = finalise(chatBody);

    elements.chat.appendChild(chatBody);    
    elements.chat.scrollTop = elements.chat.scrollHeight;

    if (sendNotifs) new Notification(`new message from ${message.user.username}`, { body:  message.message});

    return message;
};
//#endregion