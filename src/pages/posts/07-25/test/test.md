---
layout: '../../../../layouts/md/blog.astro'
title: test
desc: nothing but a test really
author: roxie
dateWritten: 06/07/2025
dateUpdated: 06/07/2025
tags: ["test"]
---

# hey
hiiii
# h1
## h2
### h3
#### h4
##### h5
###### h6

# test things
i like to do test thing!!
- hi
- hi
    - hi
        - hi
            - hi
                - hi
                   - hi

# hi
extra 

extra 

extra 

extra 

extra 

```js
let call = async (endpoint = "", root = "https://api.roxcelic.love/api/v1/") => {
    try {
        let response = await fetch(`${root}${endpoint}`);
        let data = await response.json();

        return data;
    } catch (e) {
        return e;
    }
};

let post = async (endpoint = "", content = {}, root = "https://api.roxcelic.love/api/v1/") => {
    try {
        let response = await fetch(`${root}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(content)
        });
        let data = await response.json();

        return data;
    } catch (e) {
        return e;
    }
};

export {call, post};
```

# image test
wallpaper:

![my website wallpaper](/wallpaper.png "my website wallpaper")