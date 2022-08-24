const Connections = require("./connections")

module.exports = (connectionId = null, key, data) => {
    const connection = Connections.connections.find(_connection => _connection.connectionId === connectionId);
    const _data = JSON.stringify({key, data});
    if(connectionId) {
        if(connection) {
            connection.wsc.send(_data);
        }
    } else {
        Connections.server.clients.forEach(client => {
            client.send(_data)  
        })
    }
}