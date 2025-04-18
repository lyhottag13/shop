import { SoundManager } from "./SoundManager.js";
const textBox = document.getElementById("text");
const button = document.getElementById("closedSign");
const player = new SoundManager();
let isTyping = true;

const AUDIO = ["wind", "generic1", "generic2"];

AUDIO.forEach((name) => {
    player.load(name);
});

window.onload = async () => {
    await sleep(2000);
    isTyping = false;
    displayText("There's nobody here...");
};
button.addEventListener("pointerdown", () => {
    displayText("The sign appears to be hastily painted on with a sharpie.");
});
async function displayText(text) {
    if (!isTyping) {
        textBox.textContent = "* "; 
        isTyping = true;
        for (let i = 0; i < text.length; i++) {
            textBox.textContent += text.charAt(i);
            player.play("generic2");
            await sleep(35);
        }
        isTyping = false;
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}