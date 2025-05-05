function spawnMessage(message){
    try {
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(message[4]));
    
        let pappaMessage = document.createElement("P");
        pappaMessage.style.fontSize = "xx-small";
        pappaMessage.style.marginTop = "5px";
        pappaMessage.style.marginLeft = "5px";
        pappaMessage.textContent = `${message[3]}--${formattedDate}--${new Date(message[4]).toTimeString().split(' ')[0]}`;
        pappaMessage.id = message[2];
    
        let newMessage = document.createElement("P");
        newMessage.style.fontSize = "medium";
        newMessage.style.marginLeft = "-5px";
        newMessage.textContent = message[0];
        newMessage.style.color = message[1];
    
        window.scrollTo(0, document.body.scrollHeight);
    
        pappaMessage.appendChild(newMessage);
        return pappaMessage;
    } catch (e) {
        return document.createElement("P");
    }
}

function getOldChat(chat){
    chat = [...chat.children];

    let fullchatlog = chat.map((message) => [message.textContent, message.style.color, message.id]);

    return fullchatlog;
}

async function displayChat(interval = null, chat = null, speed = null, delay = 0) {
    let apiRoot = `api.roxcelic.love/`;

    if (speed != null && interval != null && speed.value != delay){
        console.log("changing chat refresh speed");
        clearInterval(interval);
        loadChat(speed.value);
        console.log("changed chat value");
        return null;
    }

    try {
        let response = await fetch(`${apiRoot}api/v1/chat/view?chatName=${document.getElementById("chatroom").value}`);
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
    let apiRoot = `api.roxcelic.love/`;

    let data = {
        upload: document.getElementById("chatMessage").value,
        color: document.getElementById("chatColor").value,
        name: document.getElementById("chatname").value,
        chatName: document.getElementById("chatroom").value
    }

    document.getElementById("chatMessage").value = "";

    try {
        await fetch(`${apiRoot}api/v1/chat/post`, {
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

export async function loadChats() {
    let dropdown = document.getElementById("chatroom");
    let apiRoot = `api.roxcelic.love/`;
    
    try {
        let resposne = await fetch(`${apiRoot}api/v1/paths?method=2`);
        let data = await resposne.json();
    
        data.forEach(item => {
            item = item.substring(0, item.length - 5);

            if (item != "admin"){
                dropdown.appendChild(newOption(item));
            }
        });
    } catch (e) {
        console.log(e);
    }

    let params = new URLSearchParams(window.location.search);
    let chat = params.get('chat');

    chat = chat != null ? `chat/${chat}` : `chat/${document.cookie.split('; ').find(row => row.startsWith('room='))?.split('=')[1]}`;

    document.getElementById(chat).selected = true;
}

function newOption(value) {
    let option = document.createElement("option");

    option.value = value;
    option.innerText = value;
    option.id = `chat/${value}`;

    return option;
}