'use strict';

const got = require('got');
const fuzzySet = require('fuzzyset.js');

const express = require('express');
const bodyParser = require('body-parser');
const webhook = express();

const source = "node-blindtest-webhook";

webhook.use(
    bodyParser.urlencoded({
        extended: true
    })
);

webhook.use(bodyParser.json());

webhook.post("/webhook", function(req, res) {
    var result = req.body.result;
    var action = result.action;
    var parameters = result.parameters ? result.parameters : null;
    var context = req.body.result.contexts[0] ? req.body.result.contexts[0] : null;

    switch(action) {
        case "input.welcome":
            res.json({
                speech: '<speak>Salut Cronos Lab, voici le labo Blind Test.<break time="1.0s"/>Demander moi de démarrer en me donnant une catégorie ou demander moi la liste des catégories disponibles.</speak>',
                displayText: "Salut Cronos Lab, voici le labo Blind Test. Demander moi de démarrer en me donnant une catégorie ou demander moi la liste des catégories disponibles.",
                source: source
            });
            break;
        case 'blindtest.user':
            res.json({
                speech: "",
                displayText: "",
                source: source
            });
            break;
        case "blindtest.categories":
            got("http://desolate-bastion-37509.herokuapp.com/categories").then(response => {
                var jsonBody = JSON.parse(response.body);
                var categories = ""; 
                jsonBody.forEach(category => {
                    categories += category + ' <break time="0.5s"/>';    
                });
                res.json({
                    speech: '<speak>Voici la liste des catégories disponibles : <break time="1.0s"/>' + categories +'</speak>',
                    displayText: "Voici la liste des catégories disponibles : " + categories,
                    source: source     
                });
            }).catch(err => {
                res.json({
                    speech: "Une erreur est survenue en interrogeant la base de données: " + err,
                    displayText: "Une erreur est survenue en interrogeant la base de données: " + err,
                    source: source
                });  
            });
            break;
        case "blindtest.start":
            got("https://desolate-bastion-37509.herokuapp.com/songs", 
                { 
                    body: { playlist: parameters.playlistName, index: 1 },
                    method: 'POST',
                    json: true,
                })
            .then(response => {
                var jsonBody = response.body;
                var formattedUrl = jsonBody.Url.replace('&', '&amp;');
                
                /*context.songTitle = jsonBody.Title;
                context.songIndex = 2;
                context.score = 0;
                context.playlistName = parameters.playlistName;*/

                res.json({
                    contextOut: [{
                        'name': 'Start-followup',
                        'lifespan': 5, 
                        'parameters': {
                            'songTitle': jsonBody.Title,
                            'songIndex': 2,
                            'score': 0,
                            'playlistName': parameters.playlistName
                        }
                    }],
                    speech: '<speak><audio src="' + formattedUrl +'" clipEnd="10s"></audio></speak>',
                    displayText: "Chanson lancée : " + jsonBody.Title,
                    source: source     
                });
            }).catch(err => {
                res.json({
                    speech: "Une erreur est survenue en interrogeant la base de données: " + err,
                    displayText: "Une erreur est survenue en interrogeant la base de données: " + err,
                    source: source
                });  
            });
            break;

        // Should be good to also get the number of songs from database and passe it through Contexts
        // Mandatory if playlist become to be random (10 songs from list of 100 f.e)
        case 'blindtest.game':
            // Check answer
            //Contexts Params seems to also be accessible as simple parameters if defined in dialogFlow web interface
            var playlistName = parameters.playlistName;
            var songIndex = parameters.songIndex;//.charAt(0) ? parameters.songIndex.charAt(0) : parameters.songIndex;
            var answer = parameters.answer;
            var songTitle = parameters.songTitle;
            var oldScore = parameters.score;//.charAt(0) ? parameters.score.charAt(0) : parameters.score;
            var fuzzy = FuzzySet([songTitle]);
            var fuzzyResult = fuzzy.get(answer);
            var resultSpeech = "";
            var newScore = 0;

            if(fuzzyResult !== 'undefined'){
                if (fuzzyResult[0][0] >= 0.7) {
                    resultSpeech = 'Bien joué ! <break time="0.5s"/>Suivante <break time="0.5s"/>'
                    newScore = oldScore + 1;
                }
            } else {
                    resultSpeech = 'Eh non, c\'était ' + songTitle + ' <break time="0.5s"/>Suivante <break time="0.5s"/>';
                    newScore = oldScore;
            }

            // Start next song
            got("https://desolate-bastion-37509.herokuapp.com/songs", 
            { 
                body: { playlist: playlistName, index: songIndex },
                method: 'POST',
                json: true,
            })
            .then(response => {
                console.log({"Response": response});
                console.log("Finished ? : " + response.body.hasOwnProperty('Warning'));
                if(response.body.hasOwnProperty('Warning')){
                    res.json({
                        //All empty to clean it
                        contextOut: [{
                            'name': 'Start-followup',
                            'lifespan': 0, 
                            'parameters': {}
                        }],
                        speech: '<speak>' + resultSpeech + 'La série est terminée. Ton score est de ' + newScore + ' sur 10</speak>',
                        displayText: "",
                        source: source
                    });
                } else {
                    var nextSongTitle = response.body.Title;
                    var nextSongUrl = response.body.Url.replace('&', '&amp;');
                    res.json({
                        contextOut: [{
                            'name': 'Start-followup',
                            'lifespan': 5, 
                            'parameters': {
                                'songTitle': nextSongTitle,
                                'songIndex': songIndex + 1,
                                'score': newScore,
                                'playlistName': playlistName
                            }
                        }],
                        speech: '<speak>' + resultSpeech + '<audio src="' + nextSongUrl +'" clipEnd="10s"></audio></speak>',
                        displayText: "Chanson lancée : " + nextSongTitle,
                        source: source     
                    });
                }
            }).catch(err => {
                res.json({
                    speech: "Une erreur est survenue en interrogeant la base de données: " + err,
                    displayText: "Une erreur est survenue en interrogeant la base de données: " + err,
                    source: source
                });  
            });
            break;
        default:
            return res.json({
                speech: "Unknown Command",
                displayText: "Unknown Command",
                source: source     
            });
    }
});

webhook.listen(process.env.PORT || 8000, function() {
    console.log("Server up and listening");
});