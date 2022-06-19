const { logPlayerIn, upgradePlayerStateToLoggedIn, getState } = require("./game");

module.exports = (wss, connectionId, dataBuffer) => {
    const data = JSON.parse(dataBuffer.toString());
    switch(data.key){
        case "S_LOGIN":
            const player = logPlayerIn(data.data.username, data.data.password);
            upgradePlayerStateToLoggedIn(player);
            getState();
        break;
    }
}