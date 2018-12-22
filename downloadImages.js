#!/usr/bin/env node
var fs = require('fs');
var games;

function getImages() {

    games = JSON.parse(fs.readFileSync('./docs/games/games.json', 'utf8'));

    for (let index in games) {
        let game = games[index];

        if (game.logoURL.includes("http")) {
            // Download to a directory and save with the original filename
            let options = {
                url: game.logoURL,
                dest: './docs/games/covers/' + game.name.replace(/[^A-Z0-9]+/ig, '') + ".jpg" // Save to /path/to/dest/image.jpg
            };

            console.log(options.dest);

            let download = require('image-downloader');
            download.image(options)
                .then(({ filename, image }) => {
                    // console.log(game.name, filename)
                    games[index].logoURL = "./games/covers/" + filename.replace(/[^A-Z0-9]+/ig, '_').replace('_docs_games_covers_', '').replace('_jpg', '.jpg');
                    delete games[index].iconURL;
                    games[index].disabled = "false";
                    fs.writeFile('./docs/games/games.json', JSON.stringify(games), 'utf8');
                })
                .catch((err) => {
                    console.error(game.name, " erro");
                });
        }
    };
};

getImages();


