import { SoundManager } from "./SoundManager.js";
const textBox = document.getElementById("text");
const closedSign = document.getElementById("closedSign");
const lightSwitch = document.getElementById("lightSwitch");
const player = new SoundManager();
let isTyping = true;

const AUDIO = ["wind", "generic1", "generic2"];

AUDIO.forEach((name) => {
    player.load(name);
});

window.onload = async () => {
    initialize();
};
let signClicks = {number: 0};
closedSign.addEventListener("pointerdown", () => {
    if (signClicks.number === 3) {
        display("You observe that this sign has nothing left to observe.");
    } else {
        display("The sign appears to be hastily painted on with a sharpie.", signClicks);
    }
});
lightSwitch.addEventListener("pointerdown", () => {
    display("This string has seen better days.");
});

async function initialize() {
    await sleep(2000);
    isTyping = false;
    display("There's nobody here...");
}
async function displayText(text) {
    textBox.textContent = "* ";
    isTyping = true;
    for (let i = 0; i < text.length; i++) {
        textBox.textContent += text.charAt(i);
        player.play("generic2");
        await sleep(35);
    }
    isTyping = false;
}
async function display(text, counter) {
    if (!isTyping) {
        displayText(text);
        if (counter !== undefined) {
            counter.number++;
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}