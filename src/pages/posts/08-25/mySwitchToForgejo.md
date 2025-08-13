---
layout: '../../../layouts/md/blog.astro'
title: my switch to forgejo
desc: why and how I stopped using github
author: roxie
dateWritten: 13/08/2025
dateUpdated: 13/08/2025
tags: ["rant", "webdesign", "anti-ai", "yap"]
---
# Heyyy,
This one is a bit different to all of my other posts so far I think. 
Firstly, I HATE AI. So with github becoming all ai focused and it looking like thats going to be their bussiness model for the far far future. Id rather not have the projects I put all of my time into in the hands of people like that. So when one of my friends gave me some alternatives to github, I took a look at my options,

- [tangled.sh](https://tangled.sh)
- [Forgejo](https://forgejo.org/)
- [gitolite](https://gitolite.com/gitolite/index.html) -- backend
    - [cgit](https://git.zx2c4.com/cgit/about/) -- frontend

The one I decided to go with was [Forgejo](https://forgejo.org) but I might come back to [tangled.sh](https://tangled.sh) at some point in the future.

## setup
The setup for Forgejo wasnt that bad at all really, it was as simple as `sudo pacman -S forgejo` and then adding it to my nginx configs. It has nice and easy buttons for repo migration from github to Forgejo and when I do swap a repo, all I have to do is change to origin locally

> I did have to add some line in my nginx configs when pushing to bigger repos

```bash
git remote set-url origin {new repo url}
```

## post setup
> all the paths used here are specific to me and may be slighty different for other users

After setting it up I wanted to customise it and here are the ways I found of doing so,
- Hosting files can be done in `/var/lib/forgejo/custom/public/assets/img/`
    - This is used for things like favicons, default profile icons, etc
    - I also host a wallpaper here, that I dont use
    - [docs](https://forgejo.org/docs/latest/contributor/customization/#changing-the-logo)
- templete files can be edited in `/var/lib/forgejo/custom/templetes/`
    - these are used for custom designs on webpages
    - [docs](https://forgejo.org/docs/latest/contributor/customization/#customizing-forgejo-pages-and-resources)
- basic config gaes are done in (for me, your $customPath may be different) `/etc/forgejo/app.ini`
- themes can be added by making a `theme-{themename}.css` file in `/var/lib/custom/public/assets/css/`
    - once youve written a theme here youll have to add it in this format to `/etc/forgejo/app.ini`
```ini 
[ui]
THEMES = {theme1}, {theme2}, {etc}
DEFAULT_THEME = {theme1}
```
> after making any changes to any forgejo files you must restart forgejo for this to take effect, on arch the command is `sudo systemctl restart forgejo`

* some themes I found are:
    - [GolDNenex/forgejo-purple-fever](https://github.com/GolDNenex/forgejo-purple-fever)
    - [Troplo/earl-grey](https://github.com/Troplo/earl-grey)
    - [dark-firepit/gitea-custom-themes](https://git.oat.zone/dark-firepit/gitea-custom-themes/src/branch/master)
        - this is for `gitea` but they are practically the same theme wise
> you dont have to use themes made by other people as they are just css files but I found myself to be pretty bad at themeing this

## final steps
Since my website was hosted via a form of link between github and cloudflare, I had to find a new way of hosting my website. I could host it myself but I dont really have the hardware to host that many things so I am forced to stick with cloudflare (an issue I want to solve soon enough, since they are also heavily leaning into ai) but my solution was to use cloudflares command line too `wrangler` and add an entry to my `package.json` file on my websites respective node project
```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "deploy": "npm run build; npx wrangler pages deploy ./dist/"
  },
```

# Thank you for reading!