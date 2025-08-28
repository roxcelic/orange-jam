export async function fullScreenImages() {
    const collection = document.getElementsByTagName("img");
    let page = document.getElementById("mcContent");

    for (let item of collection) {
        if (page !== item && page.contains(item)) {
            item.addEventListener("click", () => {openFullScreenImage(item.src, item.getAttribute("alt"))});
        }
    }
}

export function openFullScreenImage(src, altText){
    if(document.getElementsByClassName("fullScreenImage").length == 0) {
        let wrapper = document.createElement("div");
        wrapper.className = "fullScreenImage";

        let image = document.createElement("img");
        image.className = "fullScreenImageContent";
        image.src = src;

        let alt = document.createElement("p");
        alt.className = "fullScreenImageAlt";
        alt.textContent = altText;

        wrapper.appendChild(image);
        wrapper.appendChild(alt);

        setTimeout(() => {
            wrapper.addEventListener("click", function (e) {
                if(e.target == wrapper) close(wrapper, image);
                else if (e.target == image) window.location.href = image.src;
            });
    
            window.addEventListener("resize", () => {close(wrapper)})
        }, 1000);

        document.body.appendChild(wrapper, image);
    }
}

function close(wrapper, image) {
    wrapper.style.opacity = "0";

    setTimeout(() => {
        wrapper.remove();
    }, 300);
}