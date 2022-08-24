const express = require("express");
const cors = require("cors");
const path = require("path");
const ws = require("ws");
const fs = require("fs");
const users = require("../storage/users.json");
const Connections = require("./utils/connections");
const messageHandler = require("./utils/messageReceiver");
const messageSender = require("./utils/messageSender");
const { getState } = require("./utils/game");

const app = express();
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "../public")))

app.set('view engine', 'html');
app.set('views', path.join(__dirname, './views'));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

app.get("/c", (req, res) => {
    res.send(Connections.connections);
})

app.get("/admin", (req, res) => {
    res.send("ADMİN TAHA HOŞGELDİN KRAL");
})

app.get("/stats", (req, res) => {
    const statsArray = users.reduce((prev, curr) => {
        prev.push(curr.score + " | " + curr.username + " | " + curr.lastPrediction)
        return prev;
    }, []);
    const statsHTML = `
        <div>
            ${statsArray.map(stat => `<p>${stat}</p>`)}
        </div>
    `
    res.send(statsHTML);
})

app.listen(2424, () => {
    console.log("server start");
})

const wss = new ws.WebSocketServer({
    port: 5000,
});

wss.on("listening", () => {
    console.log("wss start");
})

let lastConnectionId = 1;

wss.on("connection", (wsc) => {
    const connectionId = lastConnectionId;
    lastConnectionId += 1;
    Connections.changeNewConnections([
        ...Connections.connections,
        {
            connectionId,
            wsc
        } 
    ]);

    wsc.on("close", () => {
        Connections.changeNewConnections(
            Connections.connections.filter(_connection => _connection.connectionId !== connectionId)
        );
    })

    wsc.on("message", (data) => {
        console.log(data);
        messageHandler(wss, connectionId, data);
    })

    messageSender(connectionId, "STATE", getState());
})

wss.on("error", (err) => {
    console.log(err);
})

Connections.setServer(wss);