import { EventHandler } from "./EventHandler";
import { EventList } from "./EventList";
import { Tools } from "./Tools";

export class Shop {
    private shopContainer: HTMLDivElement;
    private shopTab: HTMLDivElement;
    private shopMenu: HTMLDivElement;
    private counter: HTMLDivElement;
    private textDiv: HTMLDivElement;
    private arrows: NodeListOf<HTMLDivElement>;
    private descriptionParts: NodeListOf<HTMLSpanElement>;
    private toggleMenuHandler: () => Promise<void>;
    private arrayOfItems: Array<HTMLDivElement>;
    private shopImages: Array<HTMLImageElement>;
    private dialogueJSON: Record<string, Array<string>>;
    private isMobile: boolean;
    private currentShopIndex: number;
    private isMenuShowing: boolean;
    private tools: Tools;
    private eventHandler: EventHandler;
    private eventList!: EventList;

    constructor(
        shopImages: Array<HTMLImageElement>, 
        dialogueJSON: Record<string, Array<string>>, 
        tools: Tools,
        eventHandler: EventHandler
    ) {
        this.shopContainer = document.getElementById("shopContainer")! as HTMLDivElement;
        this.shopTab = document.getElementById("shopTab")! as HTMLDivElement;
        this.shopMenu = document.getElementById("shopMenu")! as HTMLDivElement;
        this.counter = document.getElementById("counter")! as HTMLDivElement;
        this.textDiv = document.getElementById("textDiv")! as HTMLDivElement;
        this.arrows = document.querySelectorAll(".arrow")!;
        this.descriptionParts = document.querySelectorAll("#description span")!;
        this.toggleMenuHandler = async () => this.toggleMenu();
        this.arrayOfItems = [];
        this.shopImages = shopImages;
        this.dialogueJSON = dialogueJSON;
        this.isMobile = (window.innerWidth <= 600) ? true : false;
        this.currentShopIndex = 0;
        this.isMenuShowing = false;
        this.tools = tools;
        this.eventHandler = eventHandler;
    }
    public toggleMenu() {
        const shopTabLabel = document.getElementById("shopTabLabel")!;
        if (this.isMenuShowing) {
            shopTabLabel.textContent = "OPEN SHOP";
            if (this.isMobile) {
                this.moveWorld("-352px", "0", "0");
            } else {
                this.shopContainer.style.right = "-900px";
                this.counter.style.transform = "translateX(0)";
            }
            this.isMenuShowing = false;
        } else {
            shopTabLabel.textContent = "CLOSE SHOP";
            if (this.isMobile) {
                this.moveWorld("0", "-100px", "-190px");
            } else {
                this.shopContainer.style.right = "100px";
                this.counter.style.transform = "translateX(-500px)";
            }
            this.isMenuShowing = true;
        }

    }
    private moveWorld(bottom: string, translate: string, body: string) {
        this.shopContainer.style.bottom = bottom;
        this.counter.style.transform = `translateY(${translate})`;
        this.textDiv.style.transform = `translateY(${translate})`;
        document.body.style.backgroundPositionY = body;
    }
    public async initializeShop() {
        const itemShowcase = document.getElementById("item")!;
        this.shopContainer.style.visibility = "visible";
        this.toggleMenuVisibility("show");
        // This will generate the shop's divs and set items to each div.
        this.shopImages.forEach((_, index) => {
            this.initializeDiv(itemShowcase, index);
        });
        this.arrayOfItems.forEach((item, itemIndex) => {
            this.initializeItem(item, itemIndex);
        });
        this.arrows.forEach((arrow, arrowIndex) => {
            this.initializeArrow(arrow, arrowIndex);
        });
    }
    private initializeArrow(arrow: HTMLElement, arrowIndex: number) {
        const arrowImage = arrow.querySelector("img")!;
        if (arrowIndex === 0) {
            arrowImage.style.transform = `rotate(${this.isMobile ? "0" : "90"}deg)`;
        } else {
            arrowImage.style.transform = `rotate(${this.isMobile ? "180" : "270"}deg)`
        }
        const direction = arrowIndex === 0 ? "" : "-";
        const displacement = `${direction}200px`;
        arrow.addEventListener("pointerdown", () => {
            this.arrowEvent(arrowIndex, displacement);
        });
    }
    private initializeItem(item: HTMLElement, itemIndex: number) {
        // This sets the default visible item to the first item.
        if (itemIndex === 0) {
            this.updateShopTextContent(0);
            item.style.visibility = "visible";
        } else {
            item.style.visibility = "hidden";
            item.style.transform = `translate${this.isMobile ? "X" : "Y"}(300px) scale(0.5)`;
        }
        item.addEventListener("pointerdown", async () => {
            await this.eventList.itemEvent(itemIndex);
        });
    }
    private initializeDiv(itemShowcase: HTMLElement, index: number) {
        const newItemDiv = document.createElement("div");
        newItemDiv.className = "shopItem";
        const newItemDivImage = document.createElement("img");
        newItemDivImage.src = this.shopImages[index].src;
        newItemDiv.appendChild(newItemDivImage);
        itemShowcase.appendChild(newItemDiv);
        this.arrayOfItems.push(newItemDiv);
    }
    private async arrowEvent(arrowIndex: number, displacement: string) {
        // This checks to see if this is a valid move, i.e. we're not going left at the first, or right at the last.
        const isValidMove = ((arrowIndex === 0 && this.currentShopIndex !== 0) || (arrowIndex === 1 && this.currentShopIndex !== this.arrayOfItems.length - 1));
        let selectedItem = this.arrayOfItems[this.currentShopIndex];
        if (isValidMove) {
            selectedItem.style.transform = `translate${this.isMobile ? "X" : "Y"}(${displacement}) scale(0.5)`;
            selectedItem.style.filter = "opacity(0)";
            this.currentShopIndex += arrowIndex === 0 ? -1 : 1;
            selectedItem = this.arrayOfItems[this.currentShopIndex];
        }
        selectedItem.style.transform = `translate${this.isMobile ? "X" : "Y"}(0) scale(1)`;
        selectedItem.style.filter = "opacity(1)";
        selectedItem.style.visibility = "visible";
        const validIndex = Math.min(this.currentShopIndex, this.dialogueJSON["itemHeader"].length - 1);
        this.updateShopTextContent(validIndex);
    }
    public toggleMenuVisibility(instruction: string) {
        let cursor = "wait";
        switch (instruction) {
            case "hide":
                this.isMenuShowing && this.toggleMenu();
                this.shopContainer.style.opacity = "0";
                this.shopTab.removeEventListener("pointerdown", this.toggleMenuHandler);
                this.eventHandler.setInteractionAllowed(false);
                cursor = "wait";
                break;
            case "show":
                this.shopContainer.style.opacity = "1";
                this.shopTab.addEventListener("pointerdown", this.toggleMenuHandler);
                this.eventHandler.setInteractionAllowed(true);
                cursor = "normal";
                break;
        }
        this.tools.setCursor(cursor);
    }
    private updateShopTextContent(index: number) {
        this.descriptionParts[0].textContent = this.dialogueJSON["itemHeader"][index];
        this.descriptionParts[1].textContent = this.dialogueJSON["itemDescription"][index];
    }
    public setList(eventList: EventList): void {
        this.eventList = eventList;
    }
}