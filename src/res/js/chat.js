// variables
let api = "https://api.roxcelic.love";

let elements = {
    form: document.getElementById("chat/form"),
    chat: document.getElementById("chat/chat"),
    input: document.getElementById("chat/input"),
    sendButton: document.getElementById("chat/sendButton")
}

let lastId = 0;
let previousChat;

// functions
let sendMessage = async () => {
    try {
        let message = {
            "message": elements.input.value
        }
        message = JSON.stringify(message);
        console.log(message);

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
            window.location.href = "/chat/logon"
        }

        elements.input.value = "";
        fetchChat();
    } catch (e) {
        console.log(e);
    }
}

// make chat
let createChat = async (message) => {
    lastId = message.chatID;

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

    // content
    let content = document.createElement("p");
    content.className = "content";
    content.innerText = message.message;

    // build
    name.appendChild(nameI);
    ic.appendChild(name);
    ic.appendChild(content);
    main.appendChild(pfp);
    main.appendChild(ic);

    elements.chat.appendChild(main);

    main.scrollIntoView({behavior: "smooth"});
    previousChat = message;
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