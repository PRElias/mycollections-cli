var app = {
    games: [],
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
    let gameDistinctList = JSON.parse(response);

    //Ordenando
    gameDistinctList.sort(function (a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });

    //Removendo propriedades pra poder fazer o distinct
    for (var index in gameDistinctList) {
        delete gameDistinctList[index].store;
        delete gameDistinctList[index].appID;
        delete gameDistinctList[index].system;
    }

    //Removendo duplicatas
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
    gameDistinctList = multiDimensionalUnique(gameDistinctList);

    //Montando elementos HTML
    var items = [];
    for (var index in gameDistinctList) {
        var game = gameDistinctList[index];
        if (game.disabled === 'false') {
            items.push(
                "<span class='game col-lg-2 col-sm-6 col-md-6 col-xs-12' id='" + game.name + "' onclick='showDetails(this.id)'>" +
                "<p class='gameName'>" + game.name + "</p>" +
                "<img class='cover' src='" + game.logoURL + "' data-game='" + game.name + "' alt='logo' /img>" +
                "</span>"
            );
            app.availableTags.push(game.name);
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
            "<p>" + game.system + game.store + "</p>"
        );
    }

    var wrapper = document.createElement('div');
    wrapper.innerHTML = items.join("");

    var main = document.querySelector('.modal-body');
    main.innerHTML = "";
    main.appendChild(wrapper);
};


window.onload = function () {
    app.getGames();
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