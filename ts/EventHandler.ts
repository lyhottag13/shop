import { Tools } from "./Tools";

export class EventHandler {
    private isInteractionAllowed: boolean;
    private eventHandlers: Record<string, () => Promise<void>>;
    private tools: Tools;
    constructor({
        isInteractionAllowed = true,
        eventHandlers,
        tools
    }: EventHandlerOptions) {
        this.isInteractionAllowed = isInteractionAllowed;
        this.eventHandlers = eventHandlers;
        this.tools = tools;
    }
    // Calls events so that we don't have overlap of events.
    async callEvent(eventName: string) {
        if (this.isInteractionAllowed) {
            this.toggleInteraction(false);
            await this.eventHandlers[eventName]();
            this.toggleInteraction(true);
        }
    }
    toggleInteraction(enable: boolean) {
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
    setList(eventList: Record<string, () => Promise<void>>) {
        this.eventHandlers = eventList;
    }
    getInteractionAllowed(): boolean {
        return this.isInteractionAllowed;
    }
    setInteractionAllowed(allowed: boolean) {
        this.isInteractionAllowed = allowed;
    }
}
type EventHandlerOptions = {
    isInteractionAllowed?: boolean,
    eventHandlers: Record<string, () => Promise<void>>,
    tools: Tools
}