import { config } from "../config";
import { call } from "../house/api";
import { elements } from "./utils";

export async function findClickedChat(e) {
    let target = e.target;

    while (target.parentElement) {
        if(target.className === "chatMessage") await doChatActivity(target);

        target = target.parentElement;
    }

    return null;
}

let doChatActivity = async (chat) => {
    switch(elements.chatFunction.value) {
        case "base":
            console.log(`clicked chat with id: ${chat.id}`);    

            break;
        case "delete":
            console.log(`${config.api}/api/chat?target=${chat.id}`);
            call(`chat?target=${chat.id}`);
            console.log(`deleted chat: ${chat.id}`);    

            break;
        case "viewProfile":
            let chatLink =  chat.children[1].children[0].children[0].href;
            console.log(chatLink);
            window.Location.href = chatLink;
            console.log(window.location.href);

            break;
    }
}