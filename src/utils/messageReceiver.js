const { logPlayerIn, upgradePlayerStateToLoggedIn, getState, processPlayerPrediction } = require("./game");
const getPlayerByIndex = require("./getPlayerByIndex");
const getPlayerIndex = require("./getPlayerIndex");
const messageSender = require("./messageSender");

module.exports = (wss, connectionId, dataBuffer) => {
    const data = JSON.parse(dataBuffer.toString());
    if(data.key === "S_LOGIN") {
        const player = logPlayerIn(data.data.username, data.data.password);
        if(player) {
            upgradePlayerStateToLoggedIn(player);
            messageSender(connectionId, "LOGIN_SUCCESSFUL", {loggedIn: true, playerWho: getPlayerIndex(player.username)});
            messageSender(null, "STATE", getState());
        } else {
            messageSender(connectionId, "LOGIN_ERROR", {
                message: "Giriş hatası.",
            });   
        }
    } else if (data.key === "S_PREDICTION") {
        const player = getPlayerByIndex(data.data.playerWho);
        processPlayerPrediction(player, data.data.prediction);
        messageSender(null, "STATE", getState())
    }
}