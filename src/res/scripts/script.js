let fuck = async () => {
    document.querySelectorAll('special-text').forEach((item) => {

        let items = [];
        for (let i = 0; i < item.innerText.length; i++) {
            let newText = document.createElement("P");
            newText.innerText = item.innerText[i] != " " ? item.innerText[i] : ".";
            newText.style.animationDelay = `${i * 0.1}s`;
            items.push(newText);
        }

        item.innerText = "";
        items.forEach((newText) => item.appendChild(newText));
    });
}

fuck();