module.exports = class Connections {
    static connections = [];
    static server = null;

    static changeNewConnections(newConnections) {
        this.connections = newConnections;
    }

    static setServer(wss) {
        this.server = wss;
    }
};