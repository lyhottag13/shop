export class Shop {
    constructor(dialogueBox) {
        this.shopContainer = document.getElementById("shopContainer");
        this.shopTab = document.getElementById("shopTab");
        this.shopMenu = document.getElementById("shopMenu");
        this.isMenuShowing = false;
        this.counter = document.getElementById("counter");
        this.dialogueBox = document.getElementById("textDiv");
        this.MOBILE = (window.innerWidth <= 600) ? true : false;
        this.dialogueBox1 = dialogueBox;
        this.toggleMenuHandler = () => this.toggleMenu();
    }
    hide() {
        if (this.isMenuShowing) {
            this.toggleMenu();
        }
        this.shopContainer.style.opacity = 0;
        this.shopTab.removeEventListener("pointerdown", this.toggleMenuHandler);
    }
    show() {
        this.shopContainer.style.opacity = 1;
        this.shopTab.addEventListener("pointerdown", this.toggleMenuHandler);
    }
    toggleMenu() {
        const shopTabLabel = document.getElementById("shopTabLabel");
        if (!this.isMenuShowing) {
            if (!this.MOBILE) {
                this.shopContainer.style.right = "100px";
                shopTabLabel.textContent = "CLOSE SHOP";
                this.counter.style.transform = "translateX(-500px)";
            } else {
                this.shopContainer.style.bottom = "0";
                shopTabLabel.textContent = "CLOSE SHOP";
                this.counter.style.transform = "translateY(-100px)";
                this.dialogueBox.style.transform = "translateY(-100px)";
                document.body.style.backgroundPositionY = "-190px";
            }
            this.isMenuShowing = true;
        } else {
            if (!this.MOBILE) {
                this.shopContainer.style.right = "-900px";
                shopTabLabel.textContent = "OPEN SHOP";
                this.counter.style.transform = "translateX(0)";
            } else {
                this.shopContainer.style.bottom = "-352px";
                shopTabLabel.textContent = "OPEN SHOP";
                this.counter.style.transform = "translateY(0)";
                this.dialogueBox.style.transform = "translateY(0)";
                document.body.style.backgroundPositionY = "0";
            }
            this.isMenuShowing = false;
        }

    }
    initializeItem(item, itemIndex, descriptionParts, dialogueJSON) {
        // This sets the default visible item to the first item.
        if (itemIndex === 0) {
            descriptionParts[0].textContent = dialogueJSON["itemHeader"][0];
            descriptionParts[1].textContent = dialogueJSON["itemDescription"][0];
            item.style.visibility = "visible";
        } else {
            item.style.visibility = "hidden";
            item.style.transform = `translate${this.MOBILE ? "X" : "Y"}(300px)`;
        }
        item.addEventListener("pointerdown", async () => {
            await this.itemEvent(itemIndex);
        });
    }
    async itemEvent(itemIndex) {
        this.toggleMenu();
        this.shopContainer.style.opacity = 0;
        this.shopTab.removeEventListener("pointerdown", this.toggleMenuHandler);
        await this.dialogueBox1.newText({ dialogueName: "itemDialogue", index: itemIndex });
        this.shopContainer.style.opacity = 1;
        this.shopTab.addEventListener("pointerdown", this.toggleMenuHandler);
    }
    initializeShopItemDivs(arrayOfItems) {
        resourceJSON["shopImages"].forEach((element, index) => {
            const newItemDiv = document.createElement("div");
            newItemDiv.className = "shopItem";
            const newItemDivImage = document.createElement("img");
            newItemDivImage.src = shopImages[index].src;
            newItemDiv.appendChild(newItemDivImage);
            document.getElementById("item").appendChild(newItemDiv);
            arrayOfItems.push(newItemDiv);
        });
    }
}