// variables
let api = "https://api.roxcelic.love/api/";

let elements = {
    form: document.getElementById("login/form"),
    name: document.getElementById("login/name"),
    password: document.getElementById("login/password"),
    submit: document.getElementById("login/submit"),
    result: document.getElementById("login/result")
}

// functions
let login = async () => {
    try {
        let message = {
            username: elements.name.value,
            password: elements.password.value
        }

        message = JSON.stringify(message);
        console.log(message);

        let response = await fetch(`${api}account/loginWithBluesky`, {
            method: "POST",
            body: message,
            credentials: "include",
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        });
          
        let data = await response.json();

        if (data.status == "succesfull" || data.status == "unsuccesfull") {
            window.location.href = "/chat"
        }
        
        elements.result.innerText = JSON.stringify(data);
    } catch (e) {
        console.log(e.code);
        elements.result.innerText = "an error occured possibly icorrect sign in details, view console for more details";
    }
}

elements.name.focus();
elements.submit.addEventListener("click", () => {login()})
alert("please read my disclaimer before signing in");