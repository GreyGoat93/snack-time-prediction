module.exports = class Connections {
    static connections = [];

    static changeNewConnections(newConnections) {
        this.connections = newConnections;
    }
};