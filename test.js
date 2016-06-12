var client = new require('webtorrent')();
var magnet = 'magnet:?xt=urn:btih:42FDF1AEEE3C641BE8C41BC1FEEDDF87A50CAE12&dn=The+Hunger+Games%3A+Mockingjay+-+Part+2+%282015%29+%5B1080p%5D+%5BYTS.AG%5D&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337';
var mv = require('mv');

String.prototype.endsWithAny = function(variadic) {
    for (var arg of arguments) {
        if (this.endsWith(arg))
            return true;
    }
    return false;
};

client.add(magnet, function(torrent) {
    for (var file of torrent.files) {
        if (!file.name.endsWithAny('.mp4', '.m4v', '.avi', '.mkv')) {
            file.deselect();
        } else {
            console.log(file);
        }
    }
    torrent.on('done', function() {
        console.log('done downloading torrent.');
        for (var file of torrent.files) {
            if (file.name.endsWithAny('.mp4', '.m4v', '.avi', '.mkv')) {
                mv(torrent.path + '/' + file.path, '/plex/Movies/' + file.name, function(err) {
                    console.log('Attempted mv of torrent to movies directory. (' + err + ')');
                    process.exit(1);
                });
            }
        }
    });
    torrent.on('download', function(bytes) {
        console.log('progress: ' + torrent.progress);
    });
});
