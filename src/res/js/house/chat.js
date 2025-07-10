import { call, post } from "./api";
import { weatherData } from "./weatherManager";

let chat = {
    elements: {
        chat: document.getElementById("chat_chat"),
        sendButton: document.getElementById("chat_sendButton"),
        messageBox: document.getElementById("chat_messageBox"),
        colorBox: document.getElementById("chat_colorBox"),
        nameBox: document.getElementById("chat_nameBox"),
        chatNameBox: document.getElementById("chat_chatNameBox"),
        chatSpeed: document.getElementById("chat_chatSpeed")
    },
    config: {
        api: {
            chatView: (chatName) => {return `chat/view?chatName=${chatName}`},
            chatPost: () => {return `chat/post?chatName`},
            isAdmin: async () => {return (await call("admin")).status == "admin"}
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

                // update chat color
                document.documentElement.style.setProperty("--chatBg", weatherData.config.color(0.5));
            }, delay); 

        },
        // sends the current loaded message
        async sendMessage() {
            let data = {
                upload: chat.elements.messageBox.value,
                color: chat.elements.colorBox.value,
                name: chat.elements.nameBox.value,
                chatName: chat.elements.chatNameBox.value
            }

            chat.elements.messageBox.value = "";

            await post("chat/post", data);
            chat.run.loadChat();
        },
        /* provided by
        https://gist.github.com/ZeeshanMukhtar1/d313da2c0aaa997c4125fcb2e2ca9c77
        */
        checkImageURL (url) {
            if (!url) return false
            else {
                const pattern = new RegExp('^https?:\\/\\/.+\\.(png|jpg|jpeg|bmp|gif|webp)$', 'i');
                return pattern.test(url);
            }
        },

        // this will return all new messages
        async getNewMessages() {
            let data = await call(chat.config.api.chatView(chat.elements.chatNameBox.value));
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

                let attachment = {
                    added: false,
                    url: ""
                }

                let messages = message[0].split(" ");
                let messageContent = "";

                messages.forEach(mess => {
                    let newContent = `${mess} `;
                    if (mess.slice(0, 8) == "https://" || mess.slice(0, 7) == "http://") {
                        if (chat.run.checkImageURL(mess)) {
                            attachment.added = true;
                            attachment.url = mess;
                            newContent = "";
                        } else {
                            newContent = `<a href="${mess}">${mess}</a>`;
                        }
                    }

                    messageContent += newContent;
                });

                console.log(messageContent);

                let pappaMessage = document.createElement("P");
                pappaMessage.className = "host";
                pappaMessage.style.fontSize = "xx-small";
                pappaMessage.style.marginTop = "5px";
                pappaMessage.style.marginLeft = "5px";
                pappaMessage.textContent = `${message[3]}--${formattedDate}--${new Date(message[4]).toTimeString().split(' ')[0]}`;
                pappaMessage.id = message[2];
                
                let newMessage = document.createElement("P");
                newMessage.className = "chatMessage";
                newMessage.style.fontSize = "medium";
                newMessage.style.marginLeft = "-5px";
                newMessage.innerHTML = messageContent;
                newMessage.style.color = message[1];

                pappaMessage.appendChild(newMessage);

                if (attachment.added) {
                    let image = document.createElement("img");
                    image.className = "chatImage";
                    image.src = attachment.url;

                    pappaMessage.appendChild(image);
                }
                
                chat.elements.chat.scrollTo(0, chat.elements.chat.scrollHeight);
            
                return pappaMessage;
            } catch (e) {
                console.log(e);
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
                let admin = await chat.config.api.isAdmin();
            
                data.forEach(item => {
                    // removes the .json
                    item = item.substring(0, item.length - 5);
        
                    if (item != "admin"){
                        chat.elements.chatNameBox.appendChild(chat.run.newOption(item));
                    } else if (admin) {
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
            chat.elements.sendButton.addEventListener("click", this.sendMessage);

            // allows you to send with the enter button
            chat.elements.messageBox.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    chat.run.sendMessage()
                }
            });

            // loads the chatrooms
            await chat.run.loadChatRooms(); 

            // resets the document on chatroom change
            chat.elements.chatNameBox.addEventListener('change', function() {
                chat.elements.chat.innerHTML = "";
            });
        }
    }
}

function chatExpand (event = null, type = 1, el = this) {
    let classes = el.getAttribute("class").split(" ");

    switch (type) {
        case 1:
            if (!classes.includes("open")) classes.push("open");

            break;
        case 2:
            if (classes.includes("open")) classes = classes.filter(e => e !== 'open');   

            break;
    }

    el.setAttribute("class", classes.join(" "));
};

export {chat, chatExpand};