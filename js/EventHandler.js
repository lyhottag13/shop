var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class EventHandler {
    constructor({ isInteractionAllowed = true, eventHandlers, tools }) {
        this.isInteractionAllowed = isInteractionAllowed;
        this.eventHandlers = eventHandlers;
        this.tools = tools;
    }
    // Calls events so that we don't have overlap of events.
    callEvent(eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInteractionAllowed) {
                this.toggleInteraction(false);
                yield this.eventHandlers[eventName]();
                this.toggleInteraction(true);
            }
        });
    }
    toggleInteraction(enable) {
        switch (enable) {
            case true:
                this.isInteractionAllowed = true;
                this.tools.setCursor("normal");
                break;
            case false:
                this.isInteractionAllowed = false;
                this.tools.setCursor("wait");
                break;
        }
    }
}
