import { documentContent } from "./house/content";
import { typeOutTag } from "./house/typeAnim";
import { drawOnWeather } from "./house/weatherManager";

// this theoretically should draw on the weather
drawOnWeather();

// this should give everything listed in ./house/content.js a nice little typeing animaiton
for (let element of documentContent[document.title].items) {
    typeOutTag(element.elementId, element.speed, element.stop, element.signifier, await element.text());
}