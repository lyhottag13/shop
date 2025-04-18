import { SoundManager } from "./SoundManager.js";
const initialString = "There's nobody here..."
const textBox = document.getElementById("text");
const button = document.getElementById("closedSign");
const player = new SoundManager();
let isTyping = true;

const AUDIO = ["wind", "generic1"];

AUDIO.forEach((name) => {
    player.load(name);
});

window.onload = async () => {
    await sleep(4000);
    for (let i = 0; i < initialString.length; i++) {
        textBox.textContent += initialString.charAt(i);
        player.play("generic1");
        await sleep(35);
    }
    isTyping = false;
};
button.addEventListener("pointerdown", () => {
    displayText("The sign appears to be hastily painted with a sharpie.");
});
async function displayText(text) {
    if (!isTyping) {
        textBox.textContent = "* "; 
        isTyping = true;
        for (let i = 0; i < text.length; i++) {
            textBox.textContent += text.charAt(i);
            player.play("generic1");
            await sleep(35);
        }
        isTyping = false;
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}