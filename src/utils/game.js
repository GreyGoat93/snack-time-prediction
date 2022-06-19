const players = require("../../storage/users.json");
const { WAITING_FOR_PLAYERS_BE_READY, WAITING_FOR_PLAYERS_TO_PREDICT, GAME_FINISHED } = require("../constants/gameStages");
const { LOGGED_IN, READY, PREDICTING, PREDICTION_COMPLETED, FINISHED } = require("../constants/playerStages");
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
        state.gameState = WAITING_FOR_PLAYERS_BE_READY;
    }
}

exports.getPlayerReady = (connectionId) => {
    const player = state.players.find(_player => _player.connectionId === connectionId);

    if(player.username === "taha"){
        state.players[0].state = READY;
    }

    if(player.username === "burak"){
        state.players[1].state = READY;
    }

    const areBothReady = state.players.every(_player => _player.state === READY);
    if(areBothReady){
        state.gameState = WAITING_FOR_PLAYERS_TO_PREDICT;
        state.players.forEach(player => {
            player.state = PREDICTING;
        })
    }
}

exports.processPlayerPrediction = (connectionId, prediction) => {
    if(player.username === "taha"){
        state.players[0].state = PREDICTION_COMPLETED;
        state.players[0].prediction = prediction;
    }

    if(player.username === "burak"){
        state.players[1].state = PREDICTION_COMPLETED;
        state.players[1].prediction = prediction;
    }

    const didBothPredict = state.players.every(_player => _player.state === PREDICTION_COMPLETED);
    if(didBothPredict){
        state.gameState = GAME_FINISHED;
        state.players.forEach(player => {
            player.state = FINISHED;
        })
    }
}

exports.getState = (sendPredictions = false) => {
    const state = JSON.parse(JSON.stringify(state));
    if(!sendPredictions){
        state.players.forEach(player => {
            player.prediction = null;
        })
        return state;    
    } 
    return state;    
}