const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    // 1 hour of milliseconds
    // 60 minutes * 60 seconds * 1000 milliseconds
    let timer = 5.1 * 60 * 1000;

    const timerInterval = setInterval(() => {

    // set innerText of elementID "app" to mm::ss
    let minutes = Math.floor(timer / 1000 / 60);
    let seconds = Math.floor(timer / 1000) % 60;
    document.getElementById("app").innerText = `${minutes}:${seconds}`;
    timer -= 100;
    if (timer == 0) {
        const audio = new Audio("ding.mp3");

        clearInterval(timerInterval);

        audio.addEventListener("ended", () => {                
            ipcRenderer.send("close-app");
        });
        audio.play();

        
    } else if (timer == 5 * 60 * 1000) {
        document.getElementById("app").style.color = "red";
        const audio = new Audio("ding.mp3");
        audio.play();
    }
    }, 100);
});
