const NOT_LOGGED_IN = "NOT_LOGGED_IN";
const LOGGED_IN = "LOGGED_IN";
const READY = "READY";
const PREDICTING = "PREDICTING";
const PREDICTION_COMPLETED = "PREDICTION_COMPLETED";
const FINISHED = "FINISHED";

const WAITING_FOR_PLAYERS_LOGGED_IN = "WAITING_FOR_PLAYERS_LOGGED_IN";
const WAITING_FOR_PLAYERS_TO_PREDICT = "WAITING_FOR_PLAYERS_TO_PREDICT";
const GAME_FINISHED = "GAME_FINISHED";

(() => {
    let playerWho = null;
    let loggedIn = false;

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
        switch(data.key) {
            case "LOGIN_ERROR":
                loginErrorHandler();
            break;
            case "LOGIN_SUCCESSFUL":
                loginSuccessfulHandler(data.data);
            break;
            case "STATE":
                stateHandler(data.data);
            break;
        }
    }

    wsc.onmessage = (ev) => {
        wscReceive(ev.data);
    }

    const sectionOneInnerSections = document.querySelectorAll(".section-one .inner-section");
    const sectionTwoInnerSections = document.querySelectorAll(".section-two .inner-section");
    const loginButtonOne = document.querySelector("#login_button-one");
    const loginButtonTwo = document.querySelector("#login_button-two");
    const inputOne = document.querySelector("#player_one-input");
    const inputTwo = document.querySelector("#player_two-input");
    const submitButtonOne = document.querySelector("#player_one-button");
    const submitButtonTwo = document.querySelector("#player_two-button");
    const predictionOne = document.querySelector("#prediction-one");
    const predictionTwo = document.querySelector("#prediction-two");

    const dNoneEverySectionOne = () => {
        sectionOneInnerSections.forEach(section => {
            section.classList.add("d-none");
        })
    }

    const dNoneEverySectionTwo = () => {
        sectionTwoInnerSections.forEach(section => {
            section.classList.add("d-none");
        })      
    }

    loginButtonOne.onclick = (evt) => {
        const password = prompt("TAHA için şifreeeeee: ");
        wscSend("S_LOGIN", {
            username: "taha",
            password: password,
        })
    }

    loginButtonTwo.onclick = (evt) => {
        const password = prompt("BURAK için şifreeeeee: ");
        wscSend("S_LOGIN", {
            username: "burak",
            password: password,
        })
    }

    submitButtonOne.onclick = () => {
        const value = inputOne.value;
        console.log(value);
        wscSend("S_PREDICTION", {
            playerWho: playerWho,
            prediction: value,
        })
    }

    submitButtonTwo.onclick = () => {
        const value = inputTwo.value;
        console.log(value);
        wscSend("S_PREDICTION", {
            playerWho: playerWho,
            prediction: value,
        })
    }

    const loginErrorHandler = () => {
        alert("Hatalı giriş leyn raptiye rap rap...");
    }

    const loginSuccessfulHandler = (data) => {
        loggedIn = true;
        playerWho = data.playerWho;
    }

    const stateHandler = (data) => {
        data.players.forEach((player, index) => {
            if(data.gameState === WAITING_FOR_PLAYERS_LOGGED_IN) {
                if(loggedIn){
                    if(player.state === LOGGED_IN) {
                        if(index === 0){
                            dNoneEverySectionOne();
                            document.querySelector("#loggedin-stage-one").classList.remove("d-none");
                        } else if (index === 1){
                            dNoneEverySectionTwo();
                            document.querySelector("#loggedin-stage-two").classList.remove("d-none");
                        }
                    } else if (player.state === NOT_LOGGED_IN) {
                        if(index === 0){
                            dNoneEverySectionOne();
                            document.querySelector("#not-logged-in-yet-stage-one").classList.remove("d-none");
                        } else if (index === 1){
                            dNoneEverySectionTwo();
                            document.querySelector("#not-logged-in-yet-stage-two").classList.remove("d-none");
                        }
                    }
                } else {
                    if(player.state === LOGGED_IN) {
                        if(index === 0){
                            dNoneEverySectionOne();
                            document.querySelector("#loggedin-stage-one").classList.remove("d-none");
                        } else if (index === 1){
                            dNoneEverySectionTwo();
                            document.querySelector("#loggedin-stage-two").classList.remove("d-none");
                        }
                    } else if (player.state === NOT_LOGGED_IN) {
                        console.log("dsfkasdlşk");
                        if(index === 0) {
                            dNoneEverySectionOne();
                            document.querySelector("#login-stage-one").classList.remove("d-none");
                        } else if (index === 1) {
                            dNoneEverySectionTwo();
                            document.querySelector("#login-stage-two").classList.remove("d-none");
                        }
                    }
                }
            } else if (data.gameState === WAITING_FOR_PLAYERS_TO_PREDICT) {
                if(loggedIn){
                    if(player.state === PREDICTING) {
                        if(index === 0){
                            dNoneEverySectionOne();
                            if(index === playerWho) {
                                document.querySelector("#predicting-stage-one").classList.remove("d-none");
                            } else {
                                document.querySelector("#predicting-one").classList.remove("d-none");
                            }
                        } else if (index === 1){
                            dNoneEverySectionTwo();
                            if(index === playerWho) {
                                document.querySelector("#predicting-stage-two").classList.remove("d-none");
                            } else {
                                document.querySelector("#predicting-two").classList.remove("d-none");
                            }
                        }
                    } else if (player.state === PREDICTION_COMPLETED) {
                        if(index === 0){
                            dNoneEverySectionOne();
                            document.querySelector("#predicted-one").classList.remove("d-none");
                        } else if (index === 1) {
                            dNoneEverySectionTwo();
                            document.querySelector("#predicted-two").classList.remove("d-none");
                        }
                    }
                } else {
                    if(player.state === PREDICTING) {
                        if(index === 0){
                            dNoneEverySectionOne();
                            document.querySelector("#predicting-one").classList.remove("d-none");
                        } else if (index === 1) {
                            dNoneEverySectionTwo();
                            document.querySelector("#predicting-two").classList.remove("d-none");
                        }
                    } else if (player.state === PREDICTION_COMPLETED) {
                        if(index === 0){
                            dNoneEverySectionOne();
                            document.querySelector("#predicted-one").classList.remove("d-none");
                        } else if (index === 1) {
                            dNoneEverySectionTwo();
                            document.querySelector("#predicted-two").classList.remove("d-none");
                        }
                    }
                }
            } else if (data.gameState === GAME_FINISHED) {
                if(index === 0) {
                    dNoneEverySectionOne();
                    predictionOne.innerText = player.prediction;
                    document.querySelector("#did-predict-one").classList.remove("d-none");
                } else if (index === 1) {
                    dNoneEverySectionTwo();
                    predictionTwo.innerText = player.prediction;
                    document.querySelector("#did-predict-two").classList.remove("d-none");
                }
            }
        })
    }
})();