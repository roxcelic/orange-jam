import { documentContent } from "./house/content";
import { typeOutTag } from "./house/typeAnim";
import { drawOnWeather } from "./house/weatherManager";

// this theoretically should draw on the weather
drawOnWeather();

// this should give everything listed in ./house/content.js a nice little typeing animaiton
documentContent[document.title].items.forEach(element => {
	typeOutTag(element.elementId, element.speed, element.stop, element.signifier, element.text);
});