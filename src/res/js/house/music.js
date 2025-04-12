async function FetchMusicData(music) {
    try {
        let response = await fetch('https://api.roxcelic.love/api/v1/spotify');
        let data = await response.json();

        return data;
    } catch(e) {
        DeleteMusic(music);

        console.log("the api is unreachable or down");
    }
}

function getTimePassed(data){
    let currentTime = new Date();
    return currentTime - data.time.timeStamp;
}

// found this here https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function DisplayMusicData(data, music, interval) {   
    // increment
    music.count +=1;

    if (music.count >= 15){
        console.log("refreshing...");
        clearInterval(interval);
        Music();
        console.log("refreshed");
    }

    try {
        if (data.time.is_playing){
            let currentDuration = Math.min(Math.max((data.time.progress_ms + getTimePassed(data)), 0), data.time.duration);
            let currentPercent = currentDuration / data.time.duration;
            let textProgress = `${millisToMinutesAndSeconds(currentDuration)}/${millisToMinutesAndSeconds(data.time.duration)}`;
    
            music.hold.parentElement.href = data.track.url;
            music.AlbumCover.style.backgroundImage = `url('${data.album.images[0].url}')`
            music.Title.textContent = data.track.title;
            music.Artists.textContent = (data.track.artists.map((artist) => artist.name)).join(", ");
            music.progressbar.progress.style.width = `${currentPercent * 100}%`
            music.progressbar.duration.textContent = textProgress;

            if (currentPercent >= 1){
                console.log("refreshing...");
                clearInterval(interval);
                Music();
                console.log("refreshed");
            }

            return;
        }
    } catch (e) {}

    console.log("no music at all");
    clearInterval(interval);
    DeleteMusic(music);
}

function DeleteMusic(data) {
    data.hold.parentElement.href = null;
    data.AlbumCover.style.backgroundImage = null;
    data.Title.textContent = "No song playing";
    data.Artists.textContent = "sorry </3";
    data.progressbar.progress.style.width = "0";
    data.progressbar.duration.textContent = null;
}

export async function Music() {
    let music = {
        hold: document.getElementById("music"),
        AlbumCover: document.getElementById("musicAlbumCover"),
        Title: document.getElementById("musicTitle"),
        Artists: document.getElementById("musicArtists"),
        progressbar: {
            duration: document.getElementById("musicProgress"),
            hold: document.getElementById("musicProgressBar"),
            progress: document.getElementById("musicProgressBarProgress")
        },
        count: 0
    }
    let data = await FetchMusicData(music);

    let display = setInterval(() => {
        DisplayMusicData(data, music, display);
    }, 1000); 
}