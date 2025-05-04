import { DialogueBox } from "./DialogueBox";
import { SoundManager } from "./SoundManager";

export class Tools {
    private skip: boolean;
    private player: SoundManager;
    private dialogueBox: DialogueBox;
    private isInteractionAllowed: boolean;
    private eventHandlers: Record<string, () => Promise<void>>;
    constructor(
        skip: boolean = false,
        isInteractionAllowed: boolean = true,
        player: SoundManager,
        dialogueBox: DialogueBox,
        eventHandlers: Record<string, () => Promise<void>>
    ) {
        this.skip = skip;
        this.player = player;
        this.dialogueBox = dialogueBox;
        this.isInteractionAllowed = isInteractionAllowed;
        this.eventHandlers = eventHandlers;
    }
    keyHandler(event: KeyboardEvent) {
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
    sleep(ms: number) {
        ms = (this.skip) ? 7 : ms;
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setCursor() {
        if (this.isInteractionAllowed) {
            document.body.style.cursor = "url('resources/images/Cursor.webp') 16 16, auto";
        } else {
            document.body.style.cursor = "url('resources/images/Cursor3.webp') 16 16, auto";
        }
    }
    async callEvent(eventName: string) {
        if (this.isInteractionAllowed) {
            this.isInteractionAllowed = false;
            this.setCursor();
            await this.eventHandlers[eventName]();
            this.isInteractionAllowed = true;
            this.setCursor();
        }
    }
    createButton(id: string, top: string, left: string, width: string, height: string, functionName: () => any, div: string) {
        div = div ?? "counter";
        const button = document.createElement("button");
        button.id = id;
        button.classList.add("interactable");
        button.style.top = top;
        button.style.left = left;
        button.style.width = width;
        button.style.height = height;
        document.getElementById(div)!.appendChild(button);
        button.addEventListener("pointerdown", functionName);
    }
}