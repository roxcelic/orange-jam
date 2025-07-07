import { documentContent } from "./house/content";
import { typeOutTag } from "./house/typeAnim";
import { drawOnWeather } from "./house/weatherManager";
import { chat, chatExpand } from "./house/chat";

// this theoretically should draw on the weather
drawOnWeather();

// this should give everything listed in ./house/content.js a nice little typeing animaiton
for (let element of documentContent[document.title].items) {
    typeOutTag(element.elementId, element.speed, element.stop, element.signifier, await element.text());
}

// opens the chat
chat.run.init();
chat.run.updateChat();

// if not function why function shaped #melienialCore
let compare = (target, comparison) => {
    while (target != undefined) {
        if (target == comparison) return true;
        target = target.parentElement;
    }

    return false;
}

// chat open / close
let chatDeg = document.getElementById("chatOutLine");
chatDeg.addEventListener("click", (event) => {
    chatExpand(event.target, 1, chatDeg);
});

document.body.addEventListener("click", (event) => {
    console.log(!compare(event.target, chatDeg));

    if (!compare(event.target, chatDeg)) {
        chatExpand(event.originalTarget, 2, chatDeg);
    }
});
