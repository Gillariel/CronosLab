'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
const source = "Node BlindTest";
//const swaggerUI = require('swagger-ui-express'),
//    swaggerDoc = require('./swagger.json');

const admin = require('firebase-admin');
var serviceAccount = require('./service-account-key.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount)});
var db = admin.firestore();

restService.use(
    bodyParser.urlencoded({
        extended: true
    })
);
restService.use(bodyParser.json());
//restService.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));


//Param : <Playlist Name>, optional <index> 
restService.post('/songs', function(req, res) {
    console.log({"Body received:": req.body});
    var playlist = req.body.playlist;
    // String concat due to some playlist name that are number only
    var index = req.body.index ? "" + req.body.index : "" + -1;

    console.log("Playlist Name: " + playlist);
    //get all songs
    if(index === -1) {
        console.log("no index received");
        var songs = [];
        db.collection('playlists').doc(playlist).collection('songs').get()
            .then(playlistDoc => {
                var cpt = 1;
                playlistDoc.forEach(song =>{
                    songs.push({
                        "Index": song.id,
                        "Title": song.data().Title,
                        "Url": song.data().Url
                    });
                    if(cpt === playlistDoc.size) 
                        return res.json(songs);
                    else
                        cpt++;
                });
            }).catch(err => {
                console.log("error getting all songs: " + err);
            });
    } else {
        console.log("Index received : " + index);
        db.collection('playlists').doc(playlist).collection('songs').get()
        .then(docs => { 
            if (docs.size < index)
                return res.json({
                    "Warning": "Not so many songs"
                });
            else{
                db.collection('playlists').doc(playlist).collection('songs').doc(index).get()
                .then(playlistDoc => {
                    return res.json({
                        "Title": playlistDoc.data().Title,
                        "Url": playlistDoc.data().Url
                    });
                }).catch(err => {
                    console.log("error getting all songs: " + err);
                });
            }
         }).catch(err => {
            console.log("error getting all songs: " + err);
        });
    }
});

restService.get('/categories', function(req, res) {
    var categories = [];
    db.collection('playlists').get()
    .then(playlists => {
        var cpt = 1;
        playlists.forEach(playlist => {
            categories.push(playlist.id);
            if(cpt === playlists.size)
                return res.json(categories);
            else
                cpt++;
        });
    }).catch(err => {
        return res.json({
            error: "Error while retrieving the categories from database"
        });
    });
});

restService.get('/score', function(req, res) {
    var users = [];
    db.collection('users').get()
    .then(docUsers => {
        //Counter for returning asynchronous result 
        var itemsProcessed = 1;
        docUsers.forEach(docUser => {
            getScores(docUser.id, function(user) {
                if(user !== "undefined")
                    users.push(user);
                if(itemsProcessed === docUsers.size) 
                    return res.json(users);
                else
                    itemsProcessed++;
            });
        });
    }).catch(err => {
        console.log("error: " + err);
    })
});

function getScores(pseudo, callback) {
    var user = {};
    user.Pseudo = pseudo;
    db.collection('users').doc(pseudo).collection('scores').get()
    .then(scores => {
        user.Playlists = {};
        var cpt = 0;
        scores.forEach(score => {
            user.Playlists[cpt] = {
                "Name": score.id,
                "Best": score.data().Best,
                "Average": score.data().Average,
                "Less": score.data().Less
            };
            cpt++;
        });
        callback(user);
    }).catch(err => {
        console.log("Error inside getScore : " + err);
        callback({});
    });
};

restService.listen(process.env.PORT || 8000, function() {
    console.log("Server up and listening");
});