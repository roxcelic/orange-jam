import { test, displayUpdate } from "./house/DisplayManager";

let distrobuteInformation = ["1", "2", "3", "4"];

async function buildWorld(params) {
    distrobuteInformation.forEach(display => {

        displayUpdate(document.getElementById(`${display}menu`), document.getElementById(`${display}item`), display);

        document.getElementById(`${display}menu`).onchange = function() {
            displayUpdate(document.getElementById(`${display}menu`), document.getElementById(`${display}item`), display);
        };
    });
}

buildWorld();