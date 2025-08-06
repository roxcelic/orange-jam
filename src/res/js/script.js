import { addCPbutton } from "./house/addCPbutton";
import { fullScreenImages } from "./house/fullScreenImages";
import { loadMusicCard } from "./house/loadMusicCard";

// functions
function displayRandomAlbum() {
    let wrapper = document.createElement("div");

    let albums = [
        ["21b4cDNse2AMpj94ykfuON?si=_Ef1a_RDTku08Bi1NbPWLA", "Revengeseekerz", "Jane Remover"]
    ];
    
    let selectedAlbum = albums[Math.floor(Math.random()*albums.length)];

    let album = document.createElement("iframe");
    album.style.borderRadius = "12px";
    album.src = `https://open.spotify.com/embed/album/${selectedAlbum[0]}`;
    album.height = "352";
    album.style.minWidth = "50vw";

    let albumText = document.createElement("p");
    albumText.textContent = `hiii, this album is ${selectedAlbum[1]} by ${selectedAlbum[2]} on spotify, this is randomly selected from a list of ${albums.length} possible album(s), if youd like to see another please refresh <3`;
    albumText.style.fontSize = "Xx-small";

    wrapper.appendChild(album);
    wrapper.appendChild(albumText);

    return wrapper;
}

// run
if (navigator.clipboard) addCPbutton();
fullScreenImages();

// page specific
switch(window.location.pathname) {
    case "/about_me/": case "/about_me":
        loadMusicCard();

        break;
}

// 404
switch(document.title) {
    case "404":
        document.getElementById("mcContent").appendChild(displayRandomAlbum());

        break;
}

console.log("js loaded");