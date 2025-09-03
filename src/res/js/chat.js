// variables
import { openFullScreenImage } from "./house/fullScreenImages";
import { call } from "./house/api";
import { config } from "./config";
import { createChat, elements } from "./api/utils";
import { findClickedChat } from "./api/admin";

let user = await call();

// admin check
let adminCheck = async () => {
    return user.admin;
}


let lastId = () => {
    let chats = Array.from(elements.chat.children).map((el) =>[el.id, el]);

    return chats.length > 0 ? chats[chats.length - 1][0] : 0;
};

let refreshChat = () => {
    elements.chat.innerHTML = "";
    previousChat = null;

    fetchChat();
};

let previousChat;
let sendNotifs = false;


// functions
let sendMessage = async () => {
    try {
        let chatMessage = elements.input.value;
        elements.input.value = "";

        let message = {
            "message": chatMessage
        }
        message = JSON.stringify(message);

        let response = await fetch(`${config.api}/api/chat/send`, {
            method: "POST",
            body: message,
            credentials: "include",
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        });
          
        let data = await response.json();
        
        if (data.status == "unauthorised") {
            window.location.href = "/api/login"
        }

        fetchChat();
    } catch (e) {
        console.log(e);
    }
}

// create image 
let fetchChat = async () => {
    try {
        console.log('refreshing...');
        let response = await fetch(`${config.api}/api/chat/view`, {
            credentials: "include"
        });
        let data = await response.json();
    
        let workingdata = data.chat.reverse();
        let finalChat = [];
    
        for (let i = 0; i < workingdata.length; i++) {
            if (workingdata[i].chatID > lastId()) finalChat.push(workingdata[i]);
            else break;
        } 

        findDeletedChats(data.chat);
    
        finalChat.reverse().forEach(chat => {
            let newChatData = createChat(chat, previousChat, sendNotifs);
            
            previousChat = newChatData;
        });
    } catch (e) {
        console.log(e);
    }
}

let findDeletedChats = (chats) => {
    let chatMessages = Array.from(elements.chat.children).map((el) =>[el.id, el]);
    let chatIds = chats.map((chat) => chat.chatID.toString());
    chatMessages = chatMessages.filter((el) => !chatIds.includes(el[0]));

    if (chatMessages.length > 0) refreshChat();
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

// admin stuff
if (await adminCheck()){
    elements.chatFunction.style.display = "block";

    document.body.addEventListener("click", findClickedChat)
}