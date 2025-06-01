export async function test() {
    console.log("test");
}

export async function displayUpdate(menu, item) {
    switch(menu.value) {
        case "base":
            item.innerText = "hey";    

            break;
        default:
            item.innerText = "hu";    

            break;
    }
}