function openPost(post) {
    let listener = function(e) {
        let params = new URL(`${location.protocol}${location.host}${location.pathname}`);
        params.searchParams.set("post", post);

        window.location.href = params;
    }
    return listener;
}

function makePost(post) {
    let newpost = document.createElement("div");
    newpost.className = "blogpost";

    let newP = document.createDocumentFragment("p");
    newP.textContent = `${post.slice(0, post.length - 3)}`;

    newpost.appendChild(newP);
    newpost.addEventListener("click", openPost(post));
    return newpost;
}

async function loadPosts() {
    try {
        let response = await fetch("https://api.roxcelic.love/api/v1/paths?method=1")
        let data = await response.json();

        let posthold = document.getElementById("blogposts");

        data.forEach(post => {
            posthold.appendChild(makePost(post));
        });
    } catch (e) {
        console.log(e);
    }
}

async function loadSinglePost(post) {
    let posthold = document.getElementById("viewPost");

    const postdata = (data) => {
        return `
        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="description" content={ desc }/>
            <meta name="viewport" content="width=device-width" />
            <link rel="icon" type="image/x-icon" href="../icon.svg">

            <link href="/stylesheet/dist/styles.css" rel="stylesheet">

            <meta name="generator" content={Astro.generator} />
        </head>
        <style>
            html {
                background-Color: transparent;
            }

            input, button, textarea {
                width: calc(99% - 5px);
            }
        </style>
        <body>
            ${data}
        </body>
        </html>
        `
    }; 

    try {
        let response = await fetch(`https://api.roxcelic.love/api/v1/blog?method=1&post=${post.slice(0, post.length - 3)}`);
        let data = await response.json();

        posthold.srcdoc = postdata(data.message);

        posthold.style.height = "500px";
    } catch (e) {
        console.log(e);
    }
}

export async function buildblog() {
    let params = new URL(document.location.toString()).searchParams;
    let post = params.get("post");

    if (post == null){
        await loadPosts();
    } else {
        await loadSinglePost(post);
    }
}