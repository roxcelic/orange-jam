function getWebcardData(type) {
    return {
        webcard: document.getElementById(`${type}webcard`),
        icon: document.getElementById(`${type}icon`),
        name: document.getElementById(`${type}Name`),
        username: document.getElementById(`${type}Username`)
    }
}

export async function loadDiscord() {
    let display = getWebcardData("discord");

    try {
        let response = await fetch("https://api.roxcelic.love/api/v1/discord");
        let data = await response.json();

        let discord = {
            banner: data.userInfo.banner == null ? null : `url('https://cdn.discordapp.com/avatars/${data.userInfo.id}/${data.userInfo.banner}.png')`,
            bannerColor: data.userInfo.banner_color,
            pfpUrl: `url('https://cdn.discordapp.com/avatars/${data.userInfo.id}/${data.userInfo.avatar}.png')`,
            displayName: data.userInfo.global_name,
            username: `@${data.userInfo.username}`
        };
        
        if (discord.banner == null) display.webcard.style.backgroundColor = discord.bannerColor;
        else display.webcard.style.backgroundImage = discord.banner;

        display.icon.style.backgroundImage = discord.pfpUrl;
        display.name.textContent = discord.displayName;
        display.username.textContent = discord.username;
    } catch (e) {
        display.webcard.parentElement.parentElement.removeChild(display.webcard.parentElement);
    }
}

export async function loadBsky() {
    let display = getWebcardData("bsky");

    try {
        let response = await fetch("https://api.roxcelic.love/api/v1/bsky");
        let data = await response.json();

        let bsky = {
            banner: `url('${data.profile.banner}')`,
            pfpUrl: `url('${data.profile.avatar}')`,
            displayName: data.profile.displayName,
            username: `@${data.profile.handle}`,
            url: `https://bsky.app/profile/${data.profile.handle}`
        };
        
        display.webcard.href = bsky.url;
        display.webcard.style.backgroundImage = bsky.banner;
        display.icon.style.backgroundImage = bsky.pfpUrl;
        display.name.textContent = bsky.displayName;
        display.username.textContent = bsky.username;
    } catch (e) {
        display.webcard.parentElement.parentElement.removeChild(display.webcard.parentElement);
    }
}

export async function loadGithub() {
    let display = getWebcardData("github");

    try {
        let response = await fetch("https://api.roxcelic.love/api/v1/github");
        let data = await response.json();

        let github = {
            pfpUrl: `url('${data.avatar_url}')`,
            displayName: data.name,
            username: `@${data.login}`,
            url: data.html_url
        };
        
        display.webcard.href = github.url;
        display.icon.style.backgroundImage = github.pfpUrl;
        display.name.textContent = github.displayName;
        display.username.textContent = github.username;
    } catch (e) {
        display.webcard.parentElement.parentElement.removeChild(display.webcard.parentElement);
    }
}