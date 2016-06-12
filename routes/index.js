var express = require('express');
var router = express.Router();
var request = require('request');

var movies = {
    "status": "ok",
    "status_message": "Query was successful",
    "data": {
        "movie_count": 4873,
        "limit": 1,
        "page_number": 1,
        "movies": [{
            "id": 5211,
            "url": "https:\/\/yts.ag\/movie\/weaponized-2016",
            "imdb_code": "tt4776564",
            "title": "WEAPONiZED",
            "title_english": "WEAPONiZED",
            "title_long": "WEAPONiZED (2016)",
            "slug": "weaponized-2016",
            "year": 2016,
            "rating": 5.5,
            "runtime": 91,
            "genres": ["Action", "Sci-Fi", "Thriller"],
            "summary": "A damaged homicide detective (Johnny Messner) must prevent a grieving father from unleashing a \"robotic virus\" that he believes will destroy the terrorist cell that murdered his son, but at an unimaginable cost.",
            "description_full": "A damaged homicide detective (Johnny Messner) must prevent a grieving father from unleashing a \"robotic virus\" that he believes will destroy the terrorist cell that murdered his son, but at an unimaginable cost.",
            "synopsis": "A damaged homicide detective (Johnny Messner) must prevent a grieving father from unleashing a \"robotic virus\" that he believes will destroy the terrorist cell that murdered his son, but at an unimaginable cost.",
            "yt_trailer_code": "OLgpUebFYTM",
            "language": "English",
            "mpa_rating": "Unrated",
            "background_image": "https:\/\/yts.ag\/assets\/images\/movies\/weaponized_2016\/background.jpg",
            "background_image_original": "https:\/\/yts.ag\/assets\/images\/movies\/weaponized_2016\/background.jpg",
            "small_cover_image": "https:\/\/yts.ag\/assets\/images\/movies\/weaponized_2016\/small-cover.jpg",
            "medium_cover_image": "https:\/\/yts.ag\/assets\/images\/movies\/weaponized_2016\/medium-cover.jpg",
            "large_cover_image": "https:\/\/yts.ag\/assets\/images\/movies\/weaponized_2016\/large-cover.jpg",
            "state": "ok",
            "torrents": [{
                "url": "https:\/\/yts.ag\/torrent\/download\/5BA0A8EE52492732BD04319C12162D77579E800D.torrent",
                "hash": "5BA0A8EE52492732BD04319C12162D77579E800D",
                "quality": "720p",
                "seeds": 0,
                "peers": 0,
                "size": "680.28 MB",
                "size_bytes": 713325281,
                "date_uploaded": "2016-03-05 06:32:55",
                "date_uploaded_unix": 1457177575
            }],
            "date_uploaded": "2016-03-05 06:32:55",
            "date_uploaded_unix": 1457177575
        }]
    },
    "@meta": {"server_time": 1457161385, "server_timezone": "EST5EDT", "api_version": 2, "execution_time": "0 ms"}
};

/* GET home page. */
router.get('/', function (req, res) {
    request({
        method: 'GET',
        uri: 'https://yts.ag/api/v2/list_movies.json?limit=50'
    }, function(err, resp, body) {
        try {
            body = JSON.parse(body);
        } catch (e) {
            console.log(e);
            return res.status(500).render('error', {message:'Error', error:new Error()});
        }
        return res.render('index', {data: body.data});
    });
});

router.get('/page/:page/:query?', function(req, res) {
    var query = encodeURIComponent(req.params.query || '');
    console.log(query);
    request({
        method: 'GET',
        uri: 'https://yts.ag/api/v2/list_movies.json?limit=50&page=' + req.params.page + '&query_term=' + query
    }, function(err, resp, body) {
        try {
            body = JSON.parse(body);
        } catch (e) {
            console.log(e);
            return res.status(500).render('error', {message:'Error', error:new Error()});
        }
        return res.render('movies', {data: body.data, nextPage: (body.data.page_number + 1) + '/' + query});
    })
});

router.get('/downloads', function(req, res) {
    return res.render('downloads', {downloads:global.downloading_movies});
});

module.exports = router;
