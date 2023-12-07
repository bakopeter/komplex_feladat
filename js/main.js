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
function JatekFelvetel(game) {
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
    delete game.id;
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
        name="gameRadio" value=${game.id} id=${game.id}>`);
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
    return games;
}
/*
Minden esetben az adatok tárolása és listázása esetén is esemény figyelők 
felhasználásával hívja meg a függvényeket.
*/
document.querySelector("#gameCollection").addEventListener("submit", (event) => {
    event.preventDefault();
    JatekFeltoltes(JatekFelvetel(game), `http://localhost:3000/games`).then(
        json => SzerverValasz(json, SikeresFeltoltes)
    );
});

document.querySelector("#gameCollection").addEventListener("click", event => {
    if (event.target == document.getElementById("listGames")) {
        ListaLekeres("http://localhost:3000/games").then(
            data => ListaFrissites(data)).then((games) => Listazas(games));
    };

    if (event.target == document.getElementById("deleteGame")) {
        const radioButtons = document.querySelectorAll('input[name="gameRadio"]');

        let selectedGame = null;
        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                selectedGame = radioButton.value;
                break;
            }
        }
        let deletedGame;
        for (const game of games) {
            if (game.id == selectedGame) {
                deletedGame = game;
            }
        }

        if (selectedGame != null) {
            JatekTorles(`http://localhost:3000/games/${selectedGame}`, deletedGame).then(
                json => {
                    if (JSON.stringify(json) == `{}`) {
                        SzerverValasz(deletedGame, SikeresTorles);
                    }
                })
        }
    };

    if (event.target == document.getElementById("insertGame")) {
        JsonAdatFrissites(games, `http://localhost:3000/games`);
    };
});
/*
A Json szerver által visszaküldött válasz és callback függvény használatával 
üzenetet küld a felhasználónak, hogy az újonnan elmentett játék feltöltődött-e 
a szerverre.
*/
function SikeresFeltoltes(data) {
    rendszeruzenet = `A(z) ${data.gameTitle} nevű játék sikeresen feltöltődött a 
    szerverre. Megtekintéséhez kattints a listázás gombra!`;

    return rendszeruzenet;
};

function SikeresTorles(data) {
    rendszeruzenet = `A(Z) ${data.gameTitle} nevű játék sikeresen törlődött a 
    szerverről!`;

    return rendszeruzenet;
};

function SzerverValasz(data, Callback) {
    window.alert(Callback(data));
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
function JatekTorles(url, deletedGame = null) {
    let fetchOptions = {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };

    if (deletedGame != null) {
        if (confirm(`Biztosan törlöd a(z) ${deletedGame.gameTitle} játékot a szerverről?`)) {
            return fetch(url, fetchOptions)
                .then(resp => resp.json());
        }
    }
    else {
        return fetch(url, fetchOptions)
            .then(resp => resp.json());
    }

}
/**/
function JsonAdatFrissites(games, url) {
    ListaLekeres("http://localhost:3000/games").then(
        data => ListaFrissites(data)).then(
            () => games.forEach(game => {
                JatekTorles(`${url}/${game.id}`, game).then(
                    json => JSON.stringify(json))
            })
        ).then(
            () => games.forEach(game => {
                JatekFeltoltes(game, url).then(
                    json => JSON.stringify(json))
            })
        ).then(
            () => ListaLekeres("http://localhost:3000/games")).then(
                (games) => Listazas(games)).then(
                    data => ListaFrissites(data)).then(
                        () => window.alert("Sikeres adatfrissítés!"));
};
/*
Szúrja be a mintában látható játékot az első helyre az ára 14.99€. 
Listázza az így keletkezett tömböt a konzolra.
*/
