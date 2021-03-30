const request = require('request')
const yargs = require('yargs')
const chalk = require('chalk')
const steam_key = require('./key')()
const gamesUrl = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + steam_key + '&steamid=76561198014891321&format=json&include_appinfo=true'

request({url: gamesUrl, json: true}, (error, response) => {
    const gamesList = response.body.response.games
//    gamesList.forEach(game => console.log(game.name))

    console.log(chalk.blue.bold("\nYou have " + response.body.response.game_count + " games in your Steam library"))
    const unplayedGames = gamesList.filter(game => game.playtime_forever == 0)
    console.log("Of those games, you have "
                + chalk.red(unplayedGames.length) + " that you haven't played at all\n")

    const unplayedGameIndex = getRandomIntInclusive(0, unplayedGames.length)
    const unplayedGame = unplayedGames[unplayedGameIndex].name
    console.log("Here is a game you haven't tried yet: " + unplayedGame)

    const mostPlayedGames = gamesList.sort(function (a, b) {
        return -(a.playtime_forever - b.playtime_forever)
    })

    // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
    console.log("\nAnd here are your top 5 most played games:")
    for(i = 0; i < 5; i++) {
        cumPlaytime = Math.round((mostPlayedGames[i].playtime_forever / 60) * 10) / 10
        console.log(i + 1 + "." + mostPlayedGames[i].name + " with " + cumPlaytime + " hours on record")
    }
    console.log()
})

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
}

