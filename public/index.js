(() => {
    const wsc = new WebSocket(`ws://${location.hostname}:5000`);

    const wscSend = (key, data) => {
        const stringifiedData = JSON.stringify({
            key,
            data,
        })

        wsc.send(stringifiedData);
    }

    const wscReceive = (dataBuffer) => {
        const data = JSON.parse(dataBuffer.toString());
        console.log(data);
    }

    wsc.onopen = () => {
        wscSend("S_LOGIN", {
            username: "taha",
            password: "yozgat",
        })
    }

    wsc.onmessage = (ev) => {
        wscReceive(ev.data);
    }
})();