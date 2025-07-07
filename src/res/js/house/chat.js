import { call, post } from "./api";

let chat = {
    elements: {
        chat: document.getElementById("chat/chat"),
        sendButton: document.getElementById("chat/sendButton"),
        messageBox: document.getElementById("chat/messageBox"),
        colorBox: document.getElementById("chat/colorBox"),
        nameBox: document.getElementById("chat/nameBox"),
        chatNameBox: document.getElementById("chat/chatNameBox"),
        chatSpeed: document.getElementById("chat/chatSpeed")
    },
    config: {
        api: {
            chatView: (chatName) => {return `chat/view?chatName=${chatName}`},
            chatPost: () => {return `chat/post?chatName`}
        }
    },
    run: {
        // loads all the unread messages
        async loadChat() {
            (await chat.run.getNewMessages()).forEach(message => {
                let newMessage = chat.run.spawnMessage(message);
                chat.elements.chat.appendChild(newMessage);
            });
        },
        // this wil constantly update the chat
        async updateChat() {
            // let delay = chat.elements.chatSpeed.value;
            let delay = 1000;

            setInterval(async () => {
                chat.run.loadChat();
            }, delay); 

        },
        // sends the current loaded message
        async sendMessage() {
            let data = {
                upload: chat.elements.chat.value,
                color: chat.elements.colorBox.value,
                name: chat.elements.nameBox.value,
                chatName: chat.elements.chatNameBox.value
            }

            chat.elements.chat.value = "";

            await post("chat/post", data);
            chat.run.loadChat();
        },
        // this will return all new messages
        async getNewMessages() {
            let data = await call(chat.config.api.chatView());
            data.chat = Array.isArray(data.chat) ? data.chat : [["basic message", "#783432", 0]];

            let previousMessages = chat.run.getOldMessages();
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

            return difference;
        },
        // this will return all currently added messages
        getOldMessages (){
            return [...chat.elements.chat.children].map((message) => [message.textContent, message.style.color, message.id]);
        },
        // this will return a new message element
        spawnMessage (message) {
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
        },
        // new dropdown option
        newOption(value) {
            let option = document.createElement("option");
            
            option.value = value;
            option.innerText = value;
            option.id = `chat/${value}`;
            
            return option;
        },
        // load chat rooms
        async loadChatRooms () {
            try {
                let data = await call("paths?method=2");;
            
                data.forEach(item => {
                    // removes the .json
                    item = item.substring(0, item.length - 5);
        
                    if (item != "admin"){
                        chat.elements.chatNameBox.appendChild(chat.run.newOption(item));
                    }
                });
            } catch (e) {
                console.log(e);
            }
        },
        // initialises everything
        async init () {
            // send button
            chat.elements.sendButton.addEventListener("click", sendMessage);

            // allows you to send with the enter button
            chat.elements.chat.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    sendMessage()
                }
            });

            // loads the chatrooms
            await chat.run.loadChatRooms(); 

            // resets the document on chatroom change
            chat.elements.chatNameBox.addEventListener('change', function() {
                document.getElementById("chat").innerHTML = "";
            });
        }
    }
}

function chatExpand (event = null, type = 1, el = this) {
    let classes = el.getAttribute("class").split(" ");

    console.log(type);

    switch (type) {
        case 1:
            if (!classes.includes("open")) classes.push("open");

            break;
    }

    el.setAttribute("class", classes.join(" "));
};

export {chat, chatExpand};