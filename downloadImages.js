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
                dest: './docs/games/covers' // Save to /path/to/dest/image.jpg
            };

            let download = require('image-downloader');
            download.image(options)
                .then(({ filename, image }) => {
                    // console.log(game.name, filename)
                    games[index].logoURL = "./games/covers/" + filename.replace(/^.*[\\\/]/, '');
                    console.log(games[index]);
                })
                .catch((err) => {
                    console.error(game.name, " erro");
                });
        }
    };
};

getImages();

//Falta resolver como esperar apagar o getImages para depois salvar o arquivo
fs.writeFile('./docs/games/games.json', JSON.stringify(games), 'utf8');
