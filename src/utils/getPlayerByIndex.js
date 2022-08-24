const { players } = require("./state")

module.exports = (index) => {
    return players[index];
}