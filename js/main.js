/*
1.	Hozzon létre olyan adatszerkezetet, amely képes eltárolni az űrlapból érkező adatokból 
tetszőleges mennyiségűt.
*/
let games = [];
const game = {};
/*
2.	Készítsen függvényt Atvalt(euro) néven, amely paraméterként megkapja azt, hogy hány 
Euro a játék, és visszaadja forintban az értékét. Az aktuális árfolyamot használja fel, 
minden esetben egész értékre kerekítve jelenjen meg az ár.
*/
function Atvalt(euro) {
    let rate = 380;
    huf = (euro * rate).toFixed(2);
    return huf;
}
/*
3.	Készítsen JatekFelvetel() néven függvényt mely a felhasználó által megadott játékot 
lementi egy adatszerkezetbe (ez most a szimulált adatbázis). 
*/
function JatekFelvetel() {
    game.gameTitle = document.getElementById("gameTitle").value;
    document.getElementById("gameTitle").value = "";
    game.gamePrice = Number(document.getElementById("gamePrice").value);
    document.getElementById("gamePrice").value = "";
    game.gameStudio = document.getElementById("gameStudio").value;
    document.getElementById("gameStudio").value = "";
    game.gameOnline = document.getElementById("gameOnline").checked;
    document.getElementById("gameOnline").checked = false;

    JatekFeltoltes(game);
};
//A lementett játékot feltölti a Json szerverre.
function JatekFeltoltes(game) {
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    };

    fetch(`http://localhost:3000/games`, fetchOptions).then(
        response => response.json()).then(
            json => console.log(json)
        );
}
/*
Készítsen Listazas() néven függvényt mely a fenti táblázat adatait tölti fel a megfelelő 
formátumu adatokkal. 
*/
function Listazas() {
    let gameTable = document.getElementById("gameTable");
    gameTable.style.visibility = "visible";
    let gameBody = document.getElementById("gameBody");
    gameBody.innerHTML = "";

    games.forEach(game => {
        let gameRow = document.createElement("tr");
        gameRow.className = " table-striped";
        gameBody.appendChild(gameRow);
        gameData = document.createElement("td");
        gameRow.appendChild(gameData);
        gameData.innerHTML = game.gameTitle;
        gameData = document.createElement("td");
        gameRow.appendChild(gameData);
        gameData.innerHTML = Atvalt(game.gamePrice);
        gameData = document.createElement("td");
        gameRow.appendChild(gameData);
        gameData.innerHTML = game.gameStudio;
        gameData = document.createElement("td");
        gameRow.appendChild(gameData);
        gameData.innerHTML = game.gameOnline;
    });
};

function ListaLekeres(url) {
    let fetchInit = {
        method: "GET",
        headers: new Headers(),
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(url, fetchInit).then(
        data => data.json(),
        err => console.error(err))
};

function ListaFrissites(data) {
    games = [];
    for (let row of data) {
        games.push(row);
    }
}
/*
4.	Minden esetben az adatok tárolása és listázása esetén is esemény figyelők 
felhasználásával hívja meg a függvényeket.
*/
document.querySelector("#gameCollection").addEventListener("click", event => {
    if (event.target == document.getElementById("saveGame")) {
        JatekFelvetel();
        ListTitles(games, Display);
    };
    if (event.target == document.getElementById("listGames")) {
        ListaLekeres("http://localhost:3000/games").then(
            data => ListaFrissites(data)).then(() => Listazas());
        
    };
})
/*
5.	Callback függvény segítségével listázza ki az összes játék nevét a konzolra egymástól 
vesszővel elválasztva.
*/
function Display(gameTitles) {
    console.log(gameTitles.toString());
};

function ListTitles(games, Callback) {
    let gameTitles = [];
    games.forEach(game => {
        gameTitles.push(game.gameTitle);
    });
    Callback(gameTitles);
};
/*
6.	Készítsen függvényt OsszErtek(jatekok) néven mely a konzolra kiírja az összes játék árát. 
A függvény paramétere a játékok tárolására szolgáló gyűjtemény.
7.	 Törölje az utolsó előtti játékot a gyűjteményből. 
8.	Szúrja be a mintában látható játékot az első helyre az ára 14.99€. 
9.	Listázza az így keletkezett tömböt a konzolra.
*/
