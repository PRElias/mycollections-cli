var app = {
    games: []
};

app.getGames = function () {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../json/games.json', true);
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
    var items = [];

    for (var index in app.games) {
        var game = app.games[index];
        items.push(
            "<span class='game col-lg-2 col-sm-6 col-md-6 col-xs-12' id='" + game.appID + "'>" +
            "<img class='cover' src='" + game.logoURL + "' data-game='" + encodeURIComponent(game.name) + "' alt='logo' /img>" +
            "</span>"
        );
    }

    var wrapper = document.createElement('div');
    wrapper.innerHTML = items.join("");

    var main = document.querySelector('div.main_div');
    main.appendChild(wrapper);

};

window.onload = function () {
    app.getGames();
}

function navigateToGame() {
    var pesquisa = encodeURIComponent($('#procurar').val().toUpperCase());
    var jogo = document.getElementById(pesquisa);

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
    var availableTags = [];
    $("div#main_div.row.main_div").children("span").children("img").each(function () {
        availableTags.push($(this).attr("data-game"));
    });

    $("#procurar").autocomplete({
        source: availableTags,
        select: function (event, ui) {
            event.preventDefault();
            $('#procurar').val(ui.item.value);
            navigateToGame();
        }
    });
});