var client = require('webtorrent')();
var mv = require('mv');
var sha = require('sha256');
var request = require('request');

var save_directory = "/plex/Movies/";

String.prototype.endsWithAny = function(variadic) {
    for (var arg of arguments) {
        if (this.endsWith(arg))
            return true;
    }
    return false;
};

module.exports = function(io) {

    var downloads = io.of('/downloads');

    setInterval(function() {
        downloads.emit('update downloads', {movies:global.downloading_movies});
    }, 1000);

    io.of('/browse').on('connection', function(socket) {
        socket.on('download', function(data) {
            console.log('Attempting to download: ' + data.title);
            if (typeof global.downloading_movies[data.title] !== "undefined" || typeof data.title === "undefined" || typeof data.magnet === "undefined" || typeof data.thumbnail === "undefined")return;
            global.downloading_movies[data.title] = {
                id: sha(data.title),
                title: data.title,
                thumbnail: data.thumbnail,
                downloaded: 0,
                downloadSpeed: 0,
                progress: 0,
                remaining: {
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                }
            };
            client.add(data.magnet, {path:'/plex/downloads/'}, function (torrent) {
                torrent.on('done', function () {
                    for (var file of torrent.files) {
                        if (file.name.endsWithAny('.mp4', '.m4v', '.avi', '.mkv')) {
                            console.log(save_directory + data.title + '.' + file.name.split('.').pop());
                            mv(torrent.path + '/' + file.path, save_directory + data.title + '.' + file.name.split('.').pop(), function (err) {
                                console.log('Finished moving: ' + data.title);
                                console.log('Refreshing Plex library.');
                                request('http://localhost:32400/library/sections/all/refresh', function(){});
                            });
                        }
                    }
                });
                torrent.on('download', function() {
                    var r = torrent.timeRemaining;
                    global.downloading_movies[data.title].downloaded = torrent.downloaded;
                    global.downloading_movies[data.title].downloadSpeed = torrent.downloadSpeed;
                    global.downloading_movies[data.title].progress = torrent.progress.toFixed(2);
                    global.downloading_movies[data.title].remaining = {
                        hours: Math.floor(r/(1000*60*60))%24,
                        minutes: Math.floor(r/(1000*60))%60,
                        seconds: Math.floor(r/1000)%60
                    };
                });
            });
        });
    });

};