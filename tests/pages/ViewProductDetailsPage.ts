import { Locator, Page } from "@playwright/test";

export class ViewProductDetailsPage {
    readonly page: Page;
    readonly productTextElm: Locator;
    readonly productAmountElm: Locator;
    readonly addToCartBtnElm: Locator;
    readonly toasterElm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTextElm = page.locator("h2");
        this.productAmountElm = page.locator("//h3[contains(text(),'$')]");
        this.addToCartBtnElm = page.locator("//button[text()='Add to Cart']");
        this.toasterElm = page.locator("#toast-container");

    }


    async getProductTextElm(): Promise<string | null> {
        return await this.productTextElm.textContent();
    }

    async getProductAmountElm(): Promise<string | null> {
        return await this.productAmountElm.textContent();
    }

    async getToasterElm(): Promise<string | null> {
        return await this.toasterElm.textContent();
    }

    async clickAddToCartBtnElm() {
        await this.addToCartBtnElm.click();
    }
}