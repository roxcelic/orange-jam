import { loadChat, sendMessage } from "./house/chat";
import { Music } from "./house/music";
import { loadDiscord, loadBsky, loadGithub } from "./house/socials";
import { buildblog } from "./house/blog";

async function setup(params) {
    // load the music icon
    await Music();

    // load things based on the page
    console.log(`loding '${window.location.pathname}' content`);
    switch (window.location.pathname){
        case "/chat/" || "/chat" || "chat":
            await loadChat();
            document.getElementById("chatSend").addEventListener("click", sendMessage);

            document.getElementById("chatMessage").addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    sendMessage()
                }
            });

            // save the color
            let color = document.getElementById("chatColor");
            color.value = document.cookie.split('; ').find(row => row.startsWith('color='))?.split('=')[1];

            color.addEventListener('input', function() {
                document.cookie = `color=${this.value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
            });

            break;
        case "/socials/" || "/socials" || "socials":
            await loadDiscord();
            await loadBsky();
            await loadGithub();

            break;
        case "/blog/" || "/blog" || "blog":
            await buildblog();

            break;
    }
}

setup();