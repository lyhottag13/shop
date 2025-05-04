import { Animator } from "./Animator";
import { DialogueBox } from "./DialogueBox";
import { SoundManager } from "./SoundManager";
import { Tools } from "./Tools";

export type GameContext = {
    tools: Tools;
    player: SoundManager;
    dialogueBox: DialogueBox;
    animations: Record<string, Animator>;
}