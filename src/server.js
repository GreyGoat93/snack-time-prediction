const express = require("express");
const cors = require("cors");
const path = require("path");
const ws = require("ws");

const wss = new ws.WebSocketServer({
    port: 6666,
    perMessageDeflate: {
    zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
    },
    zlibInflateOptions: {
        chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
    }
});

wss.on("listening", () => {
    console.log("wss start");
})

wss.on("connection", (req) => {
    console.log(req.url);
})

const app = express();

app.use(cors());
app.use("/public", express.static(path.join(__dirname, "../public")))

app.set('view engine', 'html');
app.set('views', path.join(__dirname, './views'));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

app.listen(2424, () => {
    console.log("server start");
})