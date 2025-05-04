var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Tools {
    constructor(skip = false, isInteractionAllowed = true, player, dialogueBox, eventHandlers) {
        this.skip = skip;
        this.player = player;
        this.dialogueBox = dialogueBox;
        this.isInteractionAllowed = isInteractionAllowed;
        this.eventHandlers = eventHandlers;
    }
    keyHandler(event) {
        switch (event.key) {
            case "c":
                this.dialogueBox.toggleSkip();
                this.skip = !this.skip;
                break;
            case "e":
                this.player.playSpammableSFX("explosion");
                break;
        }
    }
    sleep(ms) {
        ms = (this.skip) ? 7 : ms;
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setCursor() {
        if (this.isInteractionAllowed) {
            document.body.style.cursor = "url('resources/images/Cursor.webp') 16 16, auto";
        }
        else {
            document.body.style.cursor = "url('resources/images/Cursor3.webp') 16 16, auto";
        }
    }
    callEvent(eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInteractionAllowed) {
                this.isInteractionAllowed = false;
                this.setCursor();
                yield this.eventHandlers[eventName]();
                this.isInteractionAllowed = true;
                this.setCursor();
            }
        });
    }
    createButton(id, top, left, width, height, functionName, div) {
        div = div !== null && div !== void 0 ? div : "counter";
        const button = document.createElement("button");
        button.id = id;
        button.classList.add("interactable");
        button.style.top = top;
        button.style.left = left;
        button.style.width = width;
        button.style.height = height;
        document.getElementById(div).appendChild(button);
        button.addEventListener("pointerdown", functionName);
    }
}
