const { WAITING_FOR_PLAYERS_LOGGED_IN } = require("../constants/gameStages");
const { NOT_LOGGED_IN } = require("../constants/playerStages");

module.exports = {
    gameState: WAITING_FOR_PLAYERS_LOGGED_IN,
    players: [
        {
            connectionId: null,
            prediction: null,
            state: NOT_LOGGED_IN
        },
        {
            connectionId: null,
            prediction: null,
            state: NOT_LOGGED_IN
        },
    ],
}