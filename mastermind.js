const colorKeys = {
    "O": "images/orange.png",
    "P": "images/purple.png",
    "G": "images/green.png",
    "R": "images/red.png",
    "Y": "images/yellow.png",
    "B": "images/blue.png"
}
const colorKeysReverse = {
    "file:///C:/Users/Kevin/Projects/Web/mastermind/images/orange.png": "O",
    "file:///C:/Users/Kevin/Projects/Web/mastermind/images/purple.png": "P",
    "file:///C:/Users/Kevin/Projects/Web/mastermind/images/green.png": "G",
    "file:///C:/Users/Kevin/Projects/Web/mastermind/images/red.png": "R",
    "file:///C:/Users/Kevin/Projects/Web/mastermind/images/yellow.png": "Y",
    "file:///C:/Users/Kevin/Projects/Web/mastermind/images/blue.png": "B"
}

let rowNum = 0;
let solutionArray = [];
let win = false;
let guessTable = document.querySelector("#guessTable");
let table = document.createElement("table");
table.className = "game";
guessTable.appendChild(table);

// put the solution into an array
let solution = document.querySelector(".solution");
//console.log(solution.childNodes[0]);
solution.childNodes.forEach((element) => { 
    if (element.nodeType != 3)
        solutionArray.push(element);
});

let solutionValues = [];
solutionArray.forEach((element) => {
    solutionValues.push(colorKeysReverse[element.src]);
});
console.log(solutionValues);


// take the name from local storage and use it in the title
let title = document.querySelector("#title");
let name = localStorage.getItem("theName");
title.innerHTML = localStorage.getItem("theName") + "'s Mastermind";

// return to the first page when EXIT is clicked
let url = "index.html";

// Exit button to go back to index.html
document.querySelector("#exit").onclick = () => {
    location.href = url;
};

// Place to store the color selected
let colorStorage = "";


// Transfer the color picked to storage
let radios = document.getElementsByName("color");
radios.forEach((element) => {
    element.addEventListener("click", () => {
        colorStorage = element.value;
        //console.log(colorStorage);
    });
});

let guesses = [];
let pegs = [];

// Depending on what is in color storage, update the guesses
let picks = document.getElementsByName("pick");
picks.forEach((element) => {
    element.addEventListener("click", (event) => {
        event.preventDefault(); // do not need this line if buttons were replaced with divs
        //console.log(element);
        let img = document.createElement("img");
        if (colorStorage != "") {
            guesses[element.value - 1] = colorStorage;
            //console.log(guesses);
            //console.log(guesses.length);
            img.src = colorKeys[colorStorage];
            element.replaceChild(img, element.firstChild);
            //colorStorage = ""; // remove to be able to keep the selected color stored.
        }
    });
});

// When clicking Guess, convert the guess to an array that stores the guesses
let guessButton = document.querySelector("#guess").onclick = () => {
    rowNum += 1;
    clear();
    let count = 0;
    guesses.forEach((element) => {
        if(element)
            count = count + 1;
    });
    if (count < 4)
        error();
    else {
        var pegs = compare();
        console.log("red: ", pegs[0]);
        console.log("white: ", pegs[1]);
        var row = append(pegs, rowNum, table);
        table.appendChild(row);
        clearGuesses();
        if (pegs[2] == true) {
            youWin();
        }
    }
};


// TODO function to generate the <tr> and <td>s of the next guess
function append(pegs, rowNum, table) {
    let tableDataNum = document.createElement("td");
    tableDataNum.innerHTML = rowNum + ": ";
    tableDataNum.className = "numbers";
    let row = document.createElement("tr");
    row.appendChild(tableDataNum);
    let tableData = document.createElement("td");
    guesses.forEach((element) => {
        let button = document.createElement("button");
        let img = document.createElement("img");
        img.src = colorKeys[element];
        button.appendChild(img);
        button.name = "picker";
        tableData.appendChild(button);
    });
    row.appendChild(tableData);
    let numRedPegs = pegs[0];
    let numWhitePegs = pegs[1];
    for (i = 1; i <= numRedPegs; i++) {
        let redImg = document.createElement("img");
        redImg.src = "images/redpeg.png";
        row.appendChild(redImg);
    }
    for (j = 1; j <= numWhitePegs; j++) {
        let whiteImg = document.createElement("img");
        whiteImg.src = "images/whitepeg.png";
        row.appendChild(whiteImg);
    }
    return row;
    }


// Compare the guess to the solution
function compare() {
    let white = 0;
    let red = 0;
    for (i = 0; i < guesses.length; i++) {
        for (j = 0; j < solutionValues.length; j++) {
            if ((guesses[i] == solutionValues[j]) && (i == j)){
                red = red + 1;            }
            else if ((guesses[i] == solutionValues[j]) && (i != j))
                white = white + 1;
        }
    }
    if (red == 4)
        win = true;
    return [red, white, win];
}

function clearGuesses() {
    picks.forEach((element) => {
        element.firstChild.src = "images/empty.png";
    });
}

// TODO function to generate the pegs


let statusMessage = document.querySelector("#status");
let message = document.createElement("h2");

function error() {
    message.innerHTML = "Must Select a Color for All Spheres!";
    statusMessage.appendChild(message);
}

function clear() {
    message.innerHTML = "";
}

function youWin() {
    message.innerHTML = "You guessed correctly!";
    statusMessage.appendChild(message);
    let guessButton = document.querySelector("#guess");
    let giveUpButton = document.querySelector("#giveup");
    let pickTable = document.querySelector("#playTable");
    guessButton.style.display = "none";
    giveUpButton.style.display = "none";
    pickTable.style.display = "none";
}

// Reload the page when New Game is chosen
let newGameButton = document.querySelector("#newGame").onclick = () => {
    location.reload();
};

let giveUpButton = document.querySelector("#giveup").onclick = () => {
    // This needs to put the solution in the guess row
    message.innerHTML = "You gave up!";
    statusMessage.appendChild(message);
    let guessButton = document.querySelector("#guess");
    let giveUpButton = document.querySelector("#giveup");
    let pickTable = document.querySelector("#playTable");
    guessButton.style.display = "none";
    giveUpButton.style.display = "none";
    pickTable.style.display = "none";
    rowNum += 1;
    let tableDataNum = document.createElement("td");
    tableDataNum.innerHTML = rowNum + ": ";
    tableDataNum.className = "numbers";
    let row = document.createElement("tr");
    row.appendChild(tableDataNum);
    let tableData = document.createElement("td");
    solutionValues.forEach((element) => {
        let button = document.createElement("button");
        let img = document.createElement("img");
        img.src = colorKeys[element];
        button.appendChild(img);
        button.name = "picker";
        tableData.appendChild(button);
    });
    row.appendChild(tableData);
    for (i = 1; i <= 4; i++) {
        let redImg = document.createElement("img");
        redImg.src = "images/redpeg.png";
        row.appendChild(redImg);
    }
    table.appendChild(row);
};

/*
This is a change
*/

/*
This is the secind change
*/

/*
This is anoterh chnage again
*/