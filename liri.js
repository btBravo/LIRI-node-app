// 
var env = require("dotenv").config();
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// Access key information.
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Grab command
var command = process.argv[2];

// node liri.js my-tweets
// Show your last 20 tweets and when they were created at in your terminal/bash window.
if (command === "my-tweets") {

    console.log("Your last 20 tweets: ");
    console.log("-----------------------------------------------------------");

    var params = {screen_name: "BT Bravo"};

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i <= 20; i++) {
                console.log("Tweet: " + tweets[i].text);
                console.log("Created: " + tweets[i].created_at);
                console.log("-----------------------------------------------------------");
            }
        }
    });

// node liri.js spotify-this-song '<song name here>'
// Show the following information about the song in your terminal/bash window
//      Artist(s)    
//      The song's name
//      A preview link of the song from Spotify
//      The album that the song is from
// If no song is provided then your program will default to "The Sign" by Ace of Base.
} else if (command === "spotify-this-song") {

    var song = process.argv.slice(3).join(" ")

    spotify.search({ type: 'track', query: song}, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        };

    let searchData = [
        "Artist: " + data.tracks.items[0].artists[0].name,
        "Song: " + data.tracks.items[0].name,
        "Preview: " + data.tracks.items[0].preview_url,
        "Album: " + data.tracks.items[0].album.name,
    ].join("\n");

    console.log("-----------------------------------------------------------");
    console.log(searchData);

    fs.appendFile("log.txt", searchData, function(err) {
        if (err) throw err; 
          console.log(err);
    });

    });

// node liri.js movie-this '<movie name here>'
// This will output the following information to your terminal/bash window:
//   * Title of the movie.
//   * Year the movie came out.
//   * IMDB Rating of the movie.
//   * Rotten Tomatoes Rating of the movie.
//   * Country where the movie was produced.
//   * Language of the movie.
//   * Plot of the movie.
//   * Actors in the movie.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
} else if (command === "movie-this") {

    var movie = process.argv.slice(3).join(" ")

    request("http://www.omdbapi.com/?apikey=trilogy&t=" + movie, function (error, response, body) {
        if(error) {
            console.log("too bad.");
            return;
        };

        var jsonData = JSON.parse(body);

        let searchData = [
            "Title: " + jsonData.Title,
            "Year: " + jsonData.Year,
            "IMDB Rating: " + jsonData.Ratings[0].Value,
            "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
            "Country: " + jsonData.Country,
            "Language: " + jsonData.Language,
            "Plot: " + jsonData.Plot,
            "Actors: " + jsonData.Actors,
        ].join("\n");

        console.log("-----------------------------------------------------------");
        console.log(searchData);

        fs.appendFile("log.txt", searchData, function(err) {
            if (err) throw err; 
              console.log(err);
        });

    });

// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
//Feel free to change the text in that document to test out the feature for other commands.
//split the data from the. txt file. the first line is the command, and the second line is the song request
} else if (command === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        var thisSong = dataArr[1];

        spotify.search({ type: 'track', query: thisSong}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            };
        
        let searchData = [
            "Artist: " + data.tracks.items[1].artists[0].name,
            "Song: " + data.tracks.items[1].name,
            "Preview: " + data.tracks.items[1].preview_url,
            "Album: " + data.tracks.items[1].album.name,
        ].join("\n");

        console.log("-----------------------------------------------------------");
        console.log(searchData);

        fs.appendFile("log.txt", searchData, function(err) {
            if (err) throw err; 
              console.log(searchData);
        });
        });
    })

} else if (error) {
    console.log("Request not recognized. Please try again");
};

/*
BONUS

In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
Make sure you append each command you run to the log.txt file. 
Do not overwrite your file each time you run a command.
*/

