import { documentContent } from "./house/content";

let type = (currentText, fullText, signifier = "_") => {
    let hadSignifier = false;

    // remove the signifier
    if (currentText[currentText.length - 1] == signifier) {
        currentText = currentText.substring(0, currentText.length - 1);
        hadSignifier = true;
    }

    if (currentText != fullText) currentText += fullText[currentText.length];

    // if next character is a space just add it
    if (fullText[currentText.length] == " ") currentText += " ";

    // re add the signifier
    if (!hadSignifier) currentText = `${currentText}${signifier}`

    return currentText;
}

let typeOutTag = (id, speed = 2.5, stop = false, signifier = "_") => {
    // initiate
    let element = document.getElementById(id);
    let fullText = element.textContent;

    element.textContent = element.textContent[0];

    // start
    let animationWait = getComputedStyle(element).getPropertyValue("animation-delay");
    let wait = parseInt(animationWait.substring(0, animationWait.length - 1)) * 1000;

    animationWait = getComputedStyle(element).getPropertyValue("animation-duration");
    wait += parseInt(animationWait.substring(0, animationWait.length - 1)) * 250;

    setTimeout(() => {
            let interval = setInterval(() => {
            element.textContent = type(element.textContent, fullText, signifier);

            if (stop && element.textContent == fullText) clearInterval(interval);
        }, (speed * 1000) / fullText.length - 1);
    }, wait);
}

documentContent[document.title].items.forEach(element => {
	typeOutTag(element.elementId, element.speed, element.stop, element.signifier);
});