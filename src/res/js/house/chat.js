function spawnMessage(message){
    let newMessage = document.createElement("P");
    newMessage.textContent = message[0];
    newMessage.style.color = message[1];
    newMessage.id = message[2];
    window.scrollTo(0, document.body.scrollHeight);
    return newMessage;
}

function getOldChat(chat){
    chat = [...chat.children];

    let fullchatlog = chat.map((message) => [message.textContent, message.style.color, message.id]);

    return fullchatlog;
}

async function displayChat(interval = null, chat = null, speed = null, delay = 0) {
    if (speed != null && interval != null && speed.value != delay){
        console.log("changing chat refresh speed");
        clearInterval(interval);
        loadChat(speed.value);
        console.log("changed chat value");
        return null;
    }

    try {
        let response = await fetch("https://api.roxcelic.love/api/v1/chat/view")
        let data = await response.json();
        data.chat = Array.isArray(data.chat) ? data.chat : [["basic message", "#783432", 0]];

        let previousMessages = getOldChat(chat);
        let difference = [];
        let index = 0;

        if (previousMessages[0] == undefined){
            difference = data.chat;
        } else if (previousMessages[previousMessages.length - 1][2] != data.chat[data.chat.length - 1][2]){  
            let finalSnow = previousMessages[previousMessages.length - 1][2];
              
            data.chat.forEach((message, ChatIndex) => {
                if (message[2] == finalSnow) index = ChatIndex + 1;
            });

            difference = data.chat.slice(index);
        } else {
            console.log("unchaged");
        }

        difference.forEach(message => {
            chat.appendChild(spawnMessage(message));
        });

        return data;
    } catch (e) {
        console.log(e);
        if (interval != null) clearInterval(interval);
    }
}

export async function loadChat(delay = 0) {
    let chat = document.getElementById("chat");
    let speed = document.getElementById("chatSpeed");
    delay = speed.value;

    let display = setInterval(() => {
        displayChat(display, chat, speed, delay);
        console.log("refreshed chat");
    }, delay); 
}

export async function sendMessage() {
    let data = {
        upload: document.getElementById("chatMessage").value,
        color: document.getElementById("chatColor").value
    }

    document.getElementById("chatMessage").value = "";

    try {
        await fetch("https://api.roxcelic.love/api/v1/chat/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let chat = document.getElementById("chat");
        displayChat(null, chat);
    } catch (e) {
        console.log(e);
    }
}