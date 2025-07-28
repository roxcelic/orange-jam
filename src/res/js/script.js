import { documentContent } from "./house/content";
import { typeOutTag } from "./house/typeAnim";
import { drawOnWeather } from "./house/weatherManager";
import { chat } from "./house/chat";
import { replacePageVariables } from "./house/pageVariables";
import { call } from "./house/api";

async function buildPage() {
    
    let spotifydata = await call("spotify");
    let songdata = spotifydata != null ? `${spotifydata.track.title} by ${JSON.stringify(spotifydata.track.artists[0].name)}` : "nothing";

    replacePageVariables({
        "api": {
            "roxcelic": {
                "music": songdata
            }
        },
        "time": {
            "date": {
                "currentDate": `${new Date()}`
            }
        }
    });
    
    // this should give everything listed in ./house/content.js a nice little typeing animaiton
    if(documentContent[document.title]) for (let element of documentContent[document.title].items) {
        typeOutTag(element.elementId, element.speed, element.stop, element.signifier, await element.text());
    }
    
    switch (document.title) {
        case "chat":
            // opens the chat
            chat.run.init();
            chat.run.updateChat();
    
            break;
        case "Home":
            drawOnWeather();
    
            break;
    }       

    console.log("loaded js..");
}

buildPage();