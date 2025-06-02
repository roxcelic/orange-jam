export async function test() {
    console.log("test");
}

// the inner html of each option
let world = {
    "base": (param) => {
        let text = `
            base${param}
        `
        return text;
    },
    "theme": (param) => {
        let basicbox = (name, id, type) => {
            let defaultText = `<p><h3>${name}:</h3><input id="${name}-${id}" type=${type}><hr></p>`;

            return defaultText;
        }

        let customisableOptions = [
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
            ["DisplayBaseHeight", "text"],
        ]

        let text = `<div class="themeBox">`;

        customisableOptions.forEach(element => {
            text += basicbox(element[0], param, element[1]);
        });

        text += "</div>";

        return text;
    },
}

export async function displayUpdate(menu, item, id) {
    if (world[menu.value] != undefined)
        item.innerHTML = world[menu.value](id);
    else
        item.innerHTML = "hu";

    switch(menu.value) {
        case "base":
            console.log("base");

            break;
        default:
            console.log("default"); 

            break;
    }
}