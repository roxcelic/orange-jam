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
//chat.run.updateChat();
document.getElementById("chatOutLine").addEventListener("click", chatExpand);