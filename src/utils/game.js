const fs = require("fs");
const path = require("path");
const players = require("../../storage/users.json");
const { WAITING_FOR_PLAYERS_TO_PREDICT, GAME_FINISHED } = require("../constants/gameStages");
const { LOGGED_IN, PREDICTING, PREDICTION_COMPLETED, FINISHED } = require("../constants/playerStages");
const state = require("./state");

exports.logPlayerIn = (username, password) => {
    const player = players.find(player => player.username === username);
    if(player) {
        if(player.password !== password) {
            return null;
        } else {
            return player;
        }
    } else {
        return null;
    }
}

exports.upgradePlayerStateToLoggedIn = (player, connectionId) => {
    if(player.username === "taha"){
        state.players[0].connectionId = connectionId;
        state.players[0].state = LOGGED_IN;
    }

    if(player.username === "burak"){
        state.players[1].connectionId = connectionId;
        state.players[1].state = LOGGED_IN;
    }

    const areBothLoggedIn = state.players.every(_player => _player.state === LOGGED_IN)
    if(areBothLoggedIn){
        state.gameState = WAITING_FOR_PLAYERS_TO_PREDICT;
        state.players.forEach(player => {
            player.state = PREDICTING;
        })
    }
}

exports.processPlayerPrediction = (player, prediction) => {
    player.state = PREDICTION_COMPLETED;
    player.prediction = prediction;

    const didBothPredict = state.players.every(_player => _player.state === PREDICTION_COMPLETED);
    if(didBothPredict){
        const playersToBeWritten = [...players]
        playersToBeWritten.forEach((player, index) => {
            player.lastPrediction = state.players[index].prediction;
        })
        fs.writeFileSync(path.join(__dirname + "../../../storage/users.json"), JSON.stringify(playersToBeWritten));
        state.gameState = GAME_FINISHED;
        state.players.forEach(player => {
            player.state = FINISHED;
        })
    }
}

exports.getState = () => {
    const _state = JSON.parse(JSON.stringify(state));
    const sendPredictions = state.players.every(_player => _player.prediction);
    if(!sendPredictions){
        _state.players.forEach(player => {
            player.prediction = null;
        })
        return _state;    
    }
    return _state;    
}