export function replacePageVariables(content = {}) {
    console.log(content);
    buildChildren(content);
}

function buildChildren(content, base = "") {
    Object.keys(content).forEach(key => {
        if (hasChildrenNodes(content)) buildChildren(content[key], `${base}${key}:`);
        else {
            if(document.body.innerHTML.includes(`!{${base}${key}}`)) document.body.innerHTML = document.body.innerHTML.replaceAll(`!{${base}${key}}`, content[key]);
        }
    })
}

let hasChildrenNodes = (json) => {
    for(var child in json) {
        if(typeof json[child] == "object") {
            return true;
        }
    }

    return false;
}