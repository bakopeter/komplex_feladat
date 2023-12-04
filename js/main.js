/*
Hozzon létre olyan adatszerkezetet, amely képes eltárolni az űrlapból érkező 
adatokból tetszőleges mennyiségűt.
*/
let games = [];
const game = {};
/*
Készítsen függvényt Atvalt(euro) néven, amely paraméterként megkapja azt, hogy 
hány Euro a játék, és visszaadja forintban az értékét. Az aktuális árfolyamot 
használja fel, minden esetben egész értékre kerekítve jelenjen meg az ár.
*/
function Atvalt(euro) {
    let rate = 380;
    huf = (euro * rate).toFixed();
    return huf;
}
/*
Készítsen JatekFelvetel() néven függvényt mely a felhasználó által megadott 
játékot lementi egy adatszerkezetbe (ez most a szimulált adatbázis). 
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

    return game;
};
//A lementett játékot feltölti a Json szerverre (ez most a szimulált adatbázis:).
function JatekFeltoltes(game, url) {
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    };
    return fetch(url, fetchOptions).then(
        response => response.json());
};
/*
Készítsen Listazas() néven függvényt mely a fenti táblázat adatait tölti fel a 
megfelelő formátumu adatokkal. 
*/
function CreateGameElement(parentElement, childElement, data) {
    let gameData = document.createElement(childElement);
    parentElement.appendChild(gameData);
    gameData.innerHTML = data;

    return gameData;
};

function Listazas(games) {
    let gameTable = document.getElementById("gameTable");
    gameTable.style.visibility = "visible";
    let gameBody = document.getElementById("gameBody");
    gameBody.innerHTML = "";
    let i = 1;

    games.forEach(game => {
        let gameRow = document.createElement("tr");
        gameRow.className = " table-striped";
        gameBody.appendChild(gameRow);
        CreateGameElement(gameRow, "td", game.gameTitle);
        CreateGameElement(gameRow, "td", Atvalt(game.gamePrice));
        CreateGameElement(gameRow, "td", game.gameStudio);
        CreateGameElement(gameRow, "td", game.gameOnline);
        CreateGameElement(gameRow, "td", `<input class="form-check-input" type="radio" 
        name="gameRadio" value=${i} id=${i}>`);
        i++;
    });

    gameRow = document.createElement("tr");
    gameRow.className = " table-striped";
    gameBody.appendChild(gameRow);
    CreateGameElement(gameRow, "th", "Össz ár (Ft)");
    CreateGameElement(gameRow, "th", Atvalt(OsszErtek(games)));
};
//Lekéri az elmentett játékok listáját a Json szerverről.
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
//Frissíti a játék objektumok tömbjét a Json szerverről letöltött adatokkal.
function ListaFrissites(data) {
    games = [];
    for (let row of data) {
        games.push(row);
    }
}
/*
Minden esetben az adatok tárolása és listázása esetén is esemény figyelők 
felhasználásával hívja meg a függvényeket.
*/
document.querySelector("#gameCollection").addEventListener("submit", (event) => {
    event.preventDefault();
    JatekFeltoltes(JatekFelvetel(), `http://localhost:3000/games`).then(
        json => SzerverValasz(json, Uzenet)
    );
});

document.querySelector("#gameCollection").addEventListener("click", event => {
    if (event.target == document.getElementById("listGames")) {
        ListaLekeres("http://localhost:3000/games").then(
            data => ListaFrissites(data)).then(() => Listazas(games));
    };

    const radioButtons = document.querySelectorAll('input[name="gameRadio"]');

    if (event.target == document.getElementById("deleteGame")) {
        let selectedGame;
        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                selectedGame = radioButton.value;
                break;
            }
        }
        JatekTorles(`http://localhost:3000/games/${selectedGame}`).then(
            json => window.alert(JSON.stringify(json)))
    }
});
/*
A Json szerver által visszaküldött válasz és callback függvény használatával 
üzenetet küld a felhasználónak, hogy az újonnan elmentett játék feltöltődött-e 
a szerverre.
*/
function Uzenet(rendszeruzenet) { window.alert(rendszeruzenet) };

function SzerverValasz(json, Callback) {
    rendszeruzenet = `A(Z) ${json.gameTitle} nevű játék sikeresen feltöltődött a 
    szerverre. Megtekintéséhez kattints a listázás gombra!`;

    Callback(rendszeruzenet);
};
/*
Az OsszErtek függvény kiszámolja, az Atvalt függvény átváltja forintra, majd a 
Listazas függvény a táblázat utolsó sorába kiírja az összes játék árát.
*/
function OsszErtek(games) {
    let gameSum = 0;
    games.forEach(game => gameSum += game.gamePrice);

    return gameSum;
}
/*
Törli a kijelölt játékot a gyűjteményből. 
*/
function JatekTorles(url) {
    let fetchOptions = {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };

    if (confirm("Biztosan törli a játékot?")) {
        return fetch(url, fetchOptions)
            .then(resp => resp.json());
    }
}

/*
Szúrja be a mintában látható játékot az első helyre az ára 14.99€. 
Listázza az így keletkezett tömböt a konzolra.
*/
