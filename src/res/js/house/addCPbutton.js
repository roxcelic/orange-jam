export async function addCPbutton() {
    const collection = document.getElementsByClassName("astro-code");
    for (let item of collection) {
        item.insertBefore(createCPbutton(item), item.children[0]);
    }
}

function createCPbutton(elementToCopy) {
    // wrapper
    let wrapper = document.createElement("div");
    wrapper.className = "codeCopyButtonWrapper";
    

    let el = document.createElement("div");
    el.className = "codeCopyButton"
    el.textContent = "copy"

    el.addEventListener("click", function (e) {
        navigator.clipboard.writeText(elementToCopy.textContent);

        this.textContent = "copied";
    
        setTimeout(() => {
            this.textContent = "copy";
        },1000);
    });

    wrapper.appendChild(el);
    return wrapper;
}