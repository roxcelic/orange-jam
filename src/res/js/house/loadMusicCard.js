import { call } from "./api";

export async function loadMusicCard() {
    let timeout = setInterval(async () => {
        console.log("refresh...");

        let data = await call("spotify");
        console.log(data);

        let elements = {
            albumIcon: document.getElementById("musicPlayerIcon"),
            title: document.getElementById("musicPlayerTitle"),
            progress: document.getElementById("musicPlayerProgressbarInner"),
            times: {
                start: document.getElementById("musicPlayerCurrentTime"),
                end: document.getElementById("musicPlayerEndTime")
            }
        }
    
        if (data && data.time.is_playing) {
            elements.albumIcon.src = data.album.images[0].url
            elements.albumIcon.alt = `the album cover for ${data.album.title} by ${data.track.artists[0].name} on spotify`
            elements.title.textContent = `roxie is currently listening to ${data.track.title} by ${data.track.artists[0].name} on ${data.album.title}`;
            elements.progress.style.width = calcPercent(data.time);
            elements.times.end.textContent = msToTime(data.time.duration);
        } else {
            console.log("end");
            
            elements.title.textContent = "roxie is listening to nothing </3";
            elements.albumIcon.remove();
            elements.times.end.textContent = "";
            
            clearInterval(timeout);
        }
    }, 2500);
}

function calcPercent(time) {
    return `${Math.round((time.progress_ms / time.duration) * 100)}%`;
}

// https://gist.github.com/irokhes/0cc3222078ac81a58f86c1a1c35a40be
function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds + "." + milliseconds;
}