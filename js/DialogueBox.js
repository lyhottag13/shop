export class DialogueBox {
    constructor() {
        this.openDialogues = new Map();
    }
    async displayText({ text, speed = 1, location = "text", playSound = true }) {
        if (!isTyping) {
            const textBox = document.getElementById(location);
            textBox.innerHTML = "";
            isTyping = true;
            let charAt;
            for (let i = 0; i < text.length; i++) {
                charAt = text.charAt(i);
                switch (charAt) {
                    case "|":
                        textBox.innerHTML += "<br>";
                        await sleep(700 * speed);
                        break;
                    case "#":
                        await sleep(1200 * speed);
                        textBox.innerHTML = "";
                        break;
                    case " ":
                        textBox.innerHTML += " ";
                        break;
                    case ",":
                        textBox.innerHTML += ",";
                        await sleep(500 * speed);
                        break;
                    case "!":
                    case ".":
                    case "?":
                        textBox.innerHTML += charAt;
                        await sleep(500 * speed);
                        break;
                    default:
                        textBox.innerHTML += charAt;
                        if (playSound) {
                            player.play("generic2");
                        }
                        await sleep(35 * speed);
                }
            }
            isTyping = false;
        }
        return;
    }
    /**
     * Keeps track of how many times an item has been clicked and displays updating text to match.
     * @param {string} dialogueName - The name of the dialogue event to display.
     * @param {number} speed - The speed of the text, inversely proportional to the number input.
     * @param {string} location - The div location where the text will be displayed.
     * @param {boolean} playSound - Indicates whether or not this should play a sound.
     * @returns Null, just gives more control over when to continue with certain actions in cutscenes.
     */
    async newText({ dialogueName, speed, location, playSound, starting: startingIndex, index }) {
        let openedDialogue = this.openDialogues.get(dialogueName);
        if (openedDialogue) {
            openedDialogue.clicks++;
        } else {
            openedDialogue = { clicks: 0 };
            openDialogues.set(dialogueName, openedDialogue);
        }
        const numberOfDialogues = dialogueJSON[dialogueName].length;
        const currentIndex = Math.min(numberOfDialogues - 1, openedDialogue.clicks);
        // If an index is selected, then we use the index. Else, we clamp it.
        const validIndex = index ?? (startingIndex ? (Math.floor(Math.random() * (numberOfDialogues - startingIndex)) + startingIndex) : currentIndex);
        const textToDisplay = dialogueJSON[dialogueName][validIndex];
        await displayText({
            text: textToDisplay,
            speed: speed,
            location: location,
            playSound: playSound
        });
        return;
    }
}