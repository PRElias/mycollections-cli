var app = {
    games: [],
    gameDistinctList: [],
    availableTags: []
};

app.getGames = function () {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './games/games.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            app.renderizeGames(xobj.responseText);
        }
    }
    xobj.send(null);
}

app.renderizeGames = function (response) {
    app.games = JSON.parse(response);
    app.gameDistinctList = JSON.parse(response);

    //Ordenando
    app.gameDistinctList.sort(function (a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });

    //Removendo propriedades pra poder fazer o distinct
    for (var index in app.gameDistinctList) {
        delete app.gameDistinctList[index].store;
        delete app.gameDistinctList[index].appID;
        delete app.gameDistinctList[index].system;
    }

    //Removendo duplicatas
    app.gameDistinctList = multiDimensionalUnique(app.gameDistinctList);

    //Montando elementos HTML
    var items = [];
    for (var index in app.gameDistinctList) {
        var game = app.gameDistinctList[index];
        if (game.disabled === 'false') {
            let gameName = game.name.replace("'", "");
            items.push(
                "<span class='game col-lg-2 col-sm-6 col-md-6 col-xs-12' id='" + gameName + "' onclick='showDetails(this.id)'>" +
                "<p class='gameName'>" + gameName + "</p>" +
                "<img class='cover' src='" + game.logoURL + "' data-game='" + gameName + "' alt='logo' /img>" +
                "</span>"
            );
            app.availableTags.push(gameName);
        }

    }

    var wrapper = document.createElement('div');
    wrapper.innerHTML = items.join("");

    var main = document.querySelector('div.main_div');
    main.appendChild(wrapper);

};

app.renderizeDetails = function (gameName) {

    let gameCopies = app.games.filter(function (g) {
        return g.name == gameName;
    });

    //Montando elementos HTML
    var items = [];
    for (var index in gameCopies) {
        var game = gameCopies[index];
        items.push(
            "<p>" + game.system + " / " + game.store + "</p>"
        );
    }

    let wrapper = document.createElement('div');
    wrapper.innerHTML = items.join("");

    let main = document.querySelector('.modal-body');
    main.innerHTML = "";

    let steamAppID = getSteamAppID(gameCopies);

    if (steamAppID != undefined){
        let steamLink = "https://store.steampowered.com/app/" + steamAppID;

        if(steamLink != undefined){
            let link = document.createElement('a');
            link.href = steamLink;
            link.innerHTML = "Link do Steam";
            link.target = "_blank";
            wrapper.appendChild(link);
        }
    }

    main.appendChild(wrapper);
};


window.onload = function () {
    app.getGames();
}

function getSteamAppID(gameCopies){
    for(var index in gameCopies){
        var game = gameCopies[index];
        if (game.appID != "")
            return game.appID;
    }
}

function navigateToGame() {
    var pesquisa = $('#procurar').val();
    var jogo = document.getElementById(pesquisa);
    console.log(pesquisa);

    if (jogo !== null) {
        $('html, body').animate({
            scrollTop: $(jogo).offset().top - 35
        }, 1000);
    }
}

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if (itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;

window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;

    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
        document.getElementById("main_div").style.marginTop = "50px";
    } else {
        document.getElementById("navbar").style.top = "-50px";
        document.getElementById("main_div").style.marginTop = "0";
    }
    prevScrollpos = currentScrollPos;
};

$('#procurar').focus(
    function () {
        $(this).val('');
    }
);

$('#procurar').click(
    function () {
        $(this).val('');
    }
);

//Autocomplete
$(function () {
    $("#procurar").autocomplete({
        source: app.availableTags,
        select: function (event, ui) {
            event.preventDefault();
            $('#procurar').val(ui.item.value);
            navigateToGame();
        }
    });
});

function showDetails(gameName) {
    app.renderizeDetails(gameName);
    $('.modal-title').text(gameName);
    $("#modal").modal('show');
}


function renderizeGeneralDetails() {
    
    let textoJogos = document.createElement('p');
    textoJogos.innerText = "Total de jogos únicos: " + app.gameDistinctList.length;
    let textoJogos2 = document.createElement('p');
    textoJogos2.innerText = "Total de jogos: " + app.games.length;

    let wrapper = document.createElement('div');
    wrapper.appendChild(textoJogos);
    wrapper.appendChild(textoJogos2);

    let main = document.querySelector('.modal-body');
    main.innerHTML = "";

    main.appendChild(wrapper);

    $('.modal-title').text("Detalhes");
    $("#modal").modal('show');
};
