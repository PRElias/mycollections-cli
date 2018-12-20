#!/usr/bin/env node
const download = require('image-downloader')
var fs = require('fs');
var games = [];

var getGames = function () {
    games = JSON.parse(fs.readFileSync('./docs/games/games.json', 'utf8'));
}

var getImages = function (response) {

    for (var index in games) {
        var game = games[index];

        // Download to a directory and save with the original filename
        const options = {
            url: game.logoURL,
            dest: './docs/games/covers'                  // Save to /path/to/dest/image.jpg
        }

        download.image(options)
            .then(({ filename, image }) => {
                console.log('File saved to', filename)
            })
            .catch((err) => {
                console.error(err)
            })


    }

}

getGames();
getImages();

