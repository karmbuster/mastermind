// Get the player's name and pass to local storage
let url = "mastermind.html";
let name = document.querySelector("#name");

function saveName() {
    localStorage.setItem("theName", name.value);
    //window.open(url, "_self");
    location.href = url;
}
