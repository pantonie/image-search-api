var express = require("express");
var app = express();
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/learnyoumongo';
require('dotenv').load();
var search = require('node-bing-api')({ accKey: process.env.BING_KEY });
var db, images;
//var search = new Search('');



function select(img){
    return {
        'url': img.contentUrl,
        'title': img.name,
        'thumbnail': img.thumbnailUrl,
        'size': img.contentSize
    }
}
//console.log(process.env.BING_KEY);



mongo.connect (url, function(err, database){
    if (err) return console.error(err);
    db = database;
    app.listen(process.env.PORT || 80, () => {
        console.log('application listening on port 80');
    });
    images = db.collection('images');
    //db.collection('images').remove();
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/api/latest', function(req, res){
    images.find({}, {date: 1, request: 1, _id: 0}, {limit: 10, sort: {'date': -1}}).toArray(function(err, results){
        if (err) console.error(err);
        //console.log(results);
        res.send(results);
    })
});
app.get('/api/imagesearch/:search', function(req, res){
    //console.log(+req.query.offset, req.params.search);
    images.insert({date: new Date().toLocaleString(), request: req.params.search})
    search.images(req.params.search, {top: +req.query.offset || 10}, function(err, ress, results){
        if (err) console.error(err);
        res.send(results.value.map(select))
        //res.send(results);
    })
})